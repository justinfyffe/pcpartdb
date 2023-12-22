import {
  getDefaultBenchmark,
  ListCpusFilter,
  ListGpusFilter,
  ListOrder,
  ListOrderBy,
  ListPagination,
  ListProductsFilter,
  ListSort,
  ProductFieldKey,
  ProductType,
  ProductUpdateStatus,
  sortByIds,
  UpdateProductRanksRequest,
  UpdateRelatedProductsRequest,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import * as uuid from 'uuid';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductBenchmarkEntity } from './ProductBenchmarkEntity';
import { ProductEntity } from './ProductEntity';
import { ProductRankEntity } from './ProductRankEntity';
import { RelatedProductEntity } from './RelatedProductEntity';

interface FindByIdOptions extends IncludeRelationsOptions {
  id: number;
}

interface FindByIdsOptions extends IncludeRelationsOptions {
  ids: number[];
}

interface FindBySlugOptions extends IncludeRelationsOptions {
  productType: ProductType;
  slug: string;
}

interface CountOptions {
  productType: ProductType;
  filter?: ListProductsFilter;
  orderBy?: ListOrderBy;
}

interface CountChildrenOptions {
  productIds: number[];
}

interface ListOptions extends IncludeRelationsOptions {
  productType: ProductType;
  filter?: ListProductsFilter;
  orderBy?: ListOrderBy;
  pagination?: ListPagination;
}

interface IncludeRelationsOptions {
  includeFields?: boolean | ProductFieldKey[];
  includeRelatedFields?: boolean | ProductFieldKey[];

  includeBenchmarks?: boolean;
  includeRelatedBenchmarks?: boolean;
  includeRelatedRanks?: boolean;
  includeRanks?: boolean;
  includeImages?: boolean;
  includeSources?: boolean;
  includeRelated?: boolean;
  includeParent?: boolean;
  includeChildren?: boolean;
}

export class ProductRepository {
  constructor(protected db: DatabaseClient) {}

  async findById(
    options: FindByIdOptions,
    config?: RepositoryConfig,
  ): Promise<ProductEntity> {
    const id = options.id;

    const products = await this.findByIds({ ...options, ids: [id] }, config);
    return products[0] || null;

    // return await db.product.findUnique({
    //   where: { id },
    //   select: this.generateProductSelect(options),
    // });
  }

  async findByIds(
    options: FindByIdsOptions,
    config?: RepositoryConfig,
  ): Promise<ProductEntity[]> {
    const db = config?.trx ?? this.db;

    const ids = options.ids;
    const includeParent = options.includeParent;
    const includeFields = options.includeFields;
    const includeBenchmarks = options.includeBenchmarks;
    const includeRanks = options.includeRanks;
    const includeRelated = options.includeRelated;
    const includeRelatedFields = options.includeRelatedFields;
    const includeRelatedBenchmarks = options.includeRelatedBenchmarks;
    const includeRelatedRanks = options.includeRelatedRanks;

    // Fetch base product entities for the ids
    let products: ProductEntity[] = await db.product.findMany({
      where: { id: { in: ids } },
    });
    if (products.length === 0) {
      return null;
    }
    products = sortByIds(ids, products, (p) => p.id);

    // TODO: When needed, support multiple product types.
    const productType = products[0].productType;

    // Build a list of relevant product ids (products, parents, related)
    const productIds = products.map((p) => p.id);
    const parentIds = products
      .filter((p) => p.parentId)
      .map((p) => Number(p.parentId));
    const relatedProductIds: number[] = [];

    let hasParent = false;
    const allProducts: ProductEntity[] = [...products];

    // First set of queries: Fetching relevant products like parent and related
    // products.

    // const queries1 = [];
    if (includeParent && parentIds.length > 0) {
      const parents = await db.product.findMany({
        where: { id: { in: parentIds } },
      });

      hasParent = true;
      for (const product of products) {
        // TODO: use map
        product.parent = parents.filter((p) => p.id === product.parentId)[0];
      }
      allProducts.push(...parents);
    }

    if (includeRelated) {
      const ids = [...productIds, ...parentIds];
      const relatedProducts: RelatedProductEntity[] =
        await db.relatedProduct.findMany({
          select: {
            productId: true,
            relatedProductKey: true,
            relatedProductId: true,
            relatedProduct: true,
          },
          where: { productId: { in: ids } },
        });
      relatedProductIds.push(
        ...relatedProducts.map((rp) => rp.relatedProductId),
      );

      for (const product of allProducts) {
        // TODO: use map
        product.relatedProducts = relatedProducts.filter(
          (rp) => rp.productId === product.id,
        );
      }
      allProducts.push(...relatedProducts.map((rp) => rp.relatedProduct));
    }

    // await Promise.all(queries1);

    // Second set of queries: Fetching related data to the base products.
    // For example: ranks, benchmarks, fields.

    const queries2 = [];
    if (includeFields && productType === ProductType.Cpu) {
      queries2.push(
        (async () => {
          const ids = [...productIds, ...parentIds];
          if (includeRelatedFields) {
            ids.push(...relatedProductIds);
          }

          const cpuFields = await db.cpuFields.findMany({
            where: { productId: { in: ids } },
          });

          for (const product of allProducts) {
            // TODO: use map
            product.cpuFields = cpuFields.find(
              (cf) => cf.productId === product.id,
            );
          }
        })(),
      );
    }
    if (includeFields && productType === ProductType.Gpu) {
      queries2.push(
        (async () => {
          const ids = [...productIds, ...parentIds];
          if (includeRelatedFields) {
            ids.push(...relatedProductIds);
          }

          const gpuFields = await db.gpuFields.findMany({
            where: { productId: { in: ids } },
          });

          for (const product of allProducts) {
            // TODO: use map
            product.gpuFields = gpuFields.find(
              (gf) => gf.productId === product.id,
            );
          }
        })(),
      );
    }
    if (includeBenchmarks) {
      queries2.push(
        (async () => {
          const ids = [...productIds, ...parentIds];
          if (includeRelatedBenchmarks) {
            ids.push(...relatedProductIds);
          }
          const benchmarks: ProductBenchmarkEntity[] =
            await db.productBenchmark.findMany({
              where: { productId: { in: ids } },
            });

          for (const product of allProducts) {
            // TODO: use map
            product.benchmarks = benchmarks.filter(
              (b) => b.productId === product.id,
            );
          }
        })(),
      );
    }
    if (includeRanks) {
      queries2.push(
        (async () => {
          const ids = [...productIds, ...parentIds];
          if (includeRelatedRanks) {
            ids.push(...relatedProductIds);
          }

          const ranks = await db.productRank.findMany({
            where: { productId: { in: ids } },
          });

          for (const product of allProducts) {
            // TODO: use map
            product.ranks = ranks.find((r) => r.productId === product.id);
          }
        })(),
      );
    }
    await Promise.all(queries2);

    return products;
  }

  async findBySlug(
    options: FindBySlugOptions,
    config?: RepositoryConfig,
  ): Promise<ProductEntity> {
    const timer = `ProductRepository.findBySlug (${uuid.v4()})`;
    console.time(timer);

    try {
      const db = config?.trx ?? this.db;

      const productType = options.productType;
      const slug = options.slug;

      const product: ProductEntity = await db.product.findUnique({
        where: { productType_slug: { productType, slug } },
      });

      const products = await this.findByIds(
        { ...options, ids: [product.id] },
        config,
      );

      return products[0] || null;

      // const productId = product.id;
      // const { parentId } = product;
      // const productIds = [productId];

      // let hasParent = false;
      // if (includeParent && Number.isInteger(parentId)) {
      //   const parent = await db.product.findUnique({
      //     where: { id: parentId },
      //   });
      //   productIds.push(parent.id);
      //   product.parent = parent;
      //   hasParent = true;
      // }

      // const queries1 = [];
      // if (includeFields && productType === ProductType.Gpu) {
      //   queries1.push(
      //     (async () => {
      //       const [gpuFields, parentGpuFields] = await db.gpuFields.findMany({
      //         where: { productId: { in: productIds } },
      //       });
      //       product.gpuFields = gpuFields;
      //       if (hasParent) {
      //         product.parent.gpuFields = parentGpuFields;
      //       }
      //     })(),
      //   );
      // }
      // if (includeBenchmarks) {
      //   queries1.push(
      //     (async () => {
      //       const benchmarks: ProductBenchmarkEntity[] =
      //         await db.productBenchmark.findMany({
      //           where: { productId: { in: productIds } },
      //         });
      //       product.benchmarks = benchmarks.filter(
      //         (b) => b.productId === productId,
      //       );
      //       if (hasParent) {
      //         product.parent.benchmarks = benchmarks.filter(
      //           (b) => b.productId === parentId,
      //         );
      //       }
      //     })(),
      //   );
      // }
      // if (includeRanks) {
      //   queries1.push(
      //     (async () => {
      //       const ranks: ProductRankEntity[] = await db.productRank.findMany({
      //         where: { productId: { in: productIds } },
      //       });
      //       product.ranks = ranks.filter((r) => r.productId === productId)[0];
      //       if (hasParent) {
      //         product.parent.ranks = ranks.filter(
      //           (r) => r.productId === parentId,
      //         )[0];
      //       }
      //     })(),
      //   );
      // }

      // await Promise.all(queries1);

      // const queries2 = [];
      // if (includeRelated) {
      //   const relatedProducts: RelatedProductEntity[] =
      //     await db.relatedProduct.findMany({
      //       select: {
      //         productId: true,
      //         relatedProductKey: true,
      //         relatedProductId: true,
      //         relatedProduct: true,
      //       },
      //       where: { productId: { in: productIds } },
      //     });
      //   const relatedProductIds = relatedProducts.map(
      //     (rp) => rp.relatedProductId,
      //   );

      //   if (options.includeRelatedBenchmarks) {
      //     queries2.push(
      //       (async () => {
      //         const benchmarks = await db.productBenchmark.findMany({
      //           where: { productId: { in: relatedProductIds } },
      //         });

      //         for (const relatedProduct of relatedProducts) {
      //           relatedProduct.relatedProduct.benchmarks = benchmarks.filter(
      //             (b) => b.productId === relatedProduct.relatedProductId,
      //           );
      //         }
      //       })(),
      //     );
      //   }
      //   if (options.includeRelatedRanks) {
      //     queries2.push(
      //       (async () => {
      //         const ranks = await db.productRank.findMany({
      //           where: { productId: { in: relatedProductIds } },
      //         });
      //         for (const relatedProduct of relatedProducts) {
      //           relatedProduct.relatedProduct.ranks = ranks.filter(
      //             (r) => r.productId === relatedProduct.relatedProductId,
      //           )[0];
      //         }
      //       })(),
      //     );
      //   }

      //   product.relatedProducts = relatedProducts.filter(
      //     (rp) => rp.productId === productId,
      //   );
      //   if (hasParent) {
      //     product.parent.relatedProducts = relatedProducts.filter(
      //       (rp) => rp.productId === parentId,
      //     );
      //   }
      // }

      // await Promise.all(queries2);

      // return product;

      // return await db.product.findUnique({
      //   where: { productType_slug: { productType, slug } },
      //   include: this.generateProductInclude(options),
      // });
    } finally {
      console.timeEnd(timer);
    }
  }

  async count(options: CountOptions, config?: RepositoryConfig) {
    const timer = `ProductRepository.count (${uuid.v4()})`;
    console.time(timer);
    const db = config?.trx ?? this.db;
    const { productType } = options;

    try {
      if (
        options.orderBy?.sort === ListSort.PerformanceRating ||
        options.orderBy?.sort === ListSort.PerformancePerMsrp
      ) {
        const benchmarkToSort =
          options.orderBy.benchmark ?? getDefaultBenchmark(productType);

        return await db.productBenchmark.count({
          where: {
            AND: [
              { benchmarkKey: benchmarkToSort },
              {
                product: { ...this.generateWhere(productType, options.filter) },
              },
            ],
          },
        });
      } else {
        return await db.product.count({
          where: { ...this.generateWhere(options.productType, options.filter) },
        });
      }
    } finally {
      console.timeEnd(timer);
    }
  }

  async countChildren(
    options: CountChildrenOptions,
    config?: RepositoryConfig,
  ) {
    const timer = `ProductRepository.countChildren (${uuid.v4()})`;
    console.time(timer);
    const { productIds } = options;
    const db = config?.trx ?? this.db;
    try {
      const results = await db.product.groupBy({
        _count: true,
        by: ['parentId'],
        where: { parentId: { in: productIds } },
      });

      return results.reduce((acc, result) => {
        acc[result.parentId] = result._count;
        return acc;
      }, {} as Record<number, number>);
    } finally {
      console.timeEnd(timer);
    }
  }

  async list(options: ListOptions, config?: RepositoryConfig) {
    const timer = `ProductRepository.list (${uuid.v4()})`;
    console.time(timer);

    try {
      const db = config?.trx ?? this.db;
      const productType = options.productType;

      if (
        options.orderBy?.sort === ListSort.PerformanceRating ||
        options.orderBy?.sort === ListSort.PerformancePerMsrp
      ) {
        // If we're sorting by perf or value, then we need to filter benchmarks
        // first. We're not able to filter by benchmark key when querying
        // products first.
        const benchmarkToSort =
          options.orderBy.benchmark ?? getDefaultBenchmark(productType);

        let orderBy: Prisma.ProductBenchmarkOrderByWithRelationAndSearchRelevanceInput =
          null;
        if (options.orderBy.sort === ListSort.PerformanceRating) {
          orderBy = {
            value: {
              sort: options.orderBy?.order ?? ListOrder.Desc,
              nulls: 'last',
            },
          };
        } else if (options.orderBy?.sort === ListSort.PerformancePerMsrp) {
          orderBy = {
            valuePerMsrp: {
              sort: options.orderBy?.order ?? ListOrder.Desc,
              nulls: 'last',
            },
          };
        }

        const results = await db.productBenchmark.findMany({
          select: { productId: true },
          skip: options.pagination?.offset,
          take: options.pagination?.limit,
          orderBy,
          where: {
            benchmarkKey: benchmarkToSort,
            product: { ...this.generateWhere(productType, options.filter) },
          },
        });
        const ids = results.map((result) => result.productId);
        // const products = await db.product.findMany({
        //   where: { id: { in: ids } },
        //   select: this.generateProductSelect(options),
        // });
        const products = await this.findByIds({
          ...options,
          ids,
        });
        return sortByIds(ids, products, (p) => p.id);
      } else {
        // We are not sorting by benchmark, so we can fetch the products
        // directly.
        return await db.product.findMany({
          where: {
            ...this.generateWhere(productType, options.filter),
          },
          orderBy: this.generateOrderBy(productType, options.orderBy),
          skip: options.pagination?.offset,
          take: options.pagination?.limit,
          select: this.generateProductSelect(options),
        });
      }
    } finally {
      console.timeEnd(timer);
    }
  }

  async popNextIdToBeUpdated(config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;
    const { id, productType } = await db.product.findFirst({
      select: { id: true, productType: true },
      orderBy: { automatedAt: 'asc' },
    });

    await db.product.update({
      where: { id },
      data: { automatedAt: new Date() },
    });

    return { id, productType };
  }

  async create(data: Omit<ProductEntity, 'id'>, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const {
      cpuFields: cpuFields,
      gpuFields: gpuFields,
      benchmarks: benchmarks,
      ranks: _ranks,
      sources: sources,
      updates: _updates,
      relatedProducts: _relatedProducts,
      parent: _parent,
      children: _children,
      relatedAutomationSources: _related,
      images,
      ...productData
    } = data;

    const imagesData =
      images?.map((image) => ({ imageId: image.imageId })) ?? [];

    return await db.product.create({
      data: {
        ...productData,
        cpuFields: cpuFields != null ? { create: cpuFields } : undefined,
        gpuFields: gpuFields != null ? { create: gpuFields } : undefined,
        images: { createMany: { data: imagesData, skipDuplicates: true } },
        benchmarks: { createMany: { data: benchmarks, skipDuplicates: true } },
        sources: { createMany: { data: sources, skipDuplicates: true } },
      },
    });
  }

  async update(
    id: number,
    data: Partial<ProductEntity>,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    // Reject any pending updates.
    await db.productUpdate.updateMany({
      where: { productId: id, status: ProductUpdateStatus.Pending },
      data: {
        status: ProductUpdateStatus.Rejected,
      },
    });

    await db.productImage.deleteMany({ where: { productId: id } });
    await db.productBenchmark.deleteMany({ where: { productId: id } });
    await db.productSource.deleteMany({ where: { productId: id } });

    // Update Product
    const {
      cpuFields: cpuFields,
      gpuFields: gpuFields,
      benchmarks: benchmarks,
      ranks: _ranks,
      sources: sources,
      id: _id,
      updates: _updates,
      relatedProducts: _relatedProducts,
      parent: _parent,
      children: _children,
      relatedAutomationSources: _related,
      images,
      ...productData
    } = data;

    // Update product
    return await db.product.update({
      where: { id },
      data: {
        ...productData,
        cpuFields: cpuFields != null ? { update: cpuFields } : undefined,
        gpuFields: gpuFields != null ? { update: gpuFields } : undefined,
        images: { createMany: { data: images, skipDuplicates: true } },
        benchmarks: { createMany: { data: benchmarks, skipDuplicates: true } },
        sources: { createMany: { data: sources, skipDuplicates: true } },
      },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;
    await db.product.delete({ where: { id } });
  }

  async listSitemapProductSlugs(
    productType: ProductType,
    hasParent: boolean,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;
    return await db.product.findMany({
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
      where: {
        productType,
        parentId: hasParent ? { not: null } : { equals: null },
      },
    });
  }

  async applyRanks(
    updates: UpdateProductRanksRequest,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    const dataToInsert: ProductRankEntity[] = [];

    // Clear out and create ranks
    const { productType } = updates;
    await db.productRank.deleteMany({ where: { product: { productType } } });

    for (const data of Object.entries(updates.ranks)) {
      const [id, ranks] = data;
      dataToInsert.push({
        productId: Number(id),
        ranks,
      });
    }

    await db.productRank.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });
  }

  async applyRelatedProducts(
    updates: UpdateRelatedProductsRequest,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    // Clear out product ids that will be updated.
    const { productType } = updates;
    await db.relatedProduct.deleteMany({ where: { product: { productType } } });

    const dataToInsert: RelatedProductEntity[] = [];
    for (const [productIdStr, relatedProducts] of Object.entries(
      updates.relatedProducts,
    )) {
      const productId = Number(productIdStr);
      for (const [key, relatedList] of Object.entries(relatedProducts)) {
        for (const relatedItem of relatedList) {
          dataToInsert.push({
            productId,
            relatedProductId: relatedItem.id,
            relatedProductKey: key,
          });
        }
      }
    }

    await db.relatedProduct.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });
  }

  private generateWhere(
    productType: ProductType,
    filter?: ListProductsFilter,
  ): Prisma.ProductWhereInput {
    switch (productType) {
      case ProductType.Cpu:
        return this.generateCpuWhere(productType, filter as ListCpusFilter);
      case ProductType.Gpu:
        return this.generateGpuWhere(productType, filter as ListGpusFilter);
      default:
        throw new Error('Invalid product type');
    }
  }

  private generateCpuWhere(
    productType: ProductType,
    filter?: ListCpusFilter,
  ): Prisma.ProductWhereInput {
    const companies = filter?.company?.filter((value) => value != null) ?? [];
    const years = filter?.year?.filter((value) => value != null) ?? [];
    const segments = filter?.segment?.filter((value) => value != null) ?? [];
    const includeIds = filter?.ids?.filter((value) => value != null) ?? [];
    const excludeIds =
      filter?.excludeIds?.filter((value) => value != null) ?? [];

    // Include/Exclude Ids
    let idWhere: Prisma.IntFilter = {};
    if (includeIds && includeIds.length > 0) {
      idWhere = { ...idWhere, in: includeIds };
    }
    if (excludeIds && excludeIds.length > 0) {
      idWhere = { ...idWhere, notIn: excludeIds };
    }

    // Company
    const companyWhere: Prisma.StringNullableFilter =
      companies.length > 0 ? { in: companies, mode: 'insensitive' } : undefined;

    // Segment
    const segmentsWhere: Prisma.StringNullableFilter =
      segments.length > 0 ? { in: segments, mode: 'insensitive' } : undefined;

    // Year
    const yearWhere: Prisma.ProductWhereInput[] = years.map((year) => ({
      cpuFields: {
        releaseDateValue: {
          gte: `${year}-01-01`,
          lte: `${year}-12-31`,
        },
      },
    }));

    return {
      AND: [
        {
          productType,
          id: idWhere,
          company: companyWhere,
          cpuFields: {
            marketSegmentValue: segmentsWhere,
          },
        },
        { OR: yearWhere },
      ],
    };
  }

  private generateGpuWhere(
    productType: ProductType,
    filter?: ListGpusFilter,
  ): Prisma.ProductWhereInput {
    const chipsetIds = filter?.chipsetId ?? [];
    const isChipset = filter?.isChipset ?? false;
    const isRetailModel = filter?.isRetailModel ?? false;
    const companies = filter?.company?.filter((value) => value != null) ?? [];
    const years = filter?.year?.filter((value) => value != null) ?? [];
    const segments = filter?.segment?.filter((value) => value != null) ?? [];
    const includeIds = filter?.ids?.filter((value) => value != null) ?? [];
    const excludeIds =
      filter?.excludeIds?.filter((value) => value != null) ?? [];
    const hasReleaseDate = filter?.hasReleaseDate ?? undefined;

    // Include/Exclude Ids
    let idWhere: Prisma.IntFilter = {};
    if (includeIds && includeIds.length > 0) {
      idWhere = { ...idWhere, in: includeIds };
    }
    if (excludeIds && excludeIds.length > 0) {
      idWhere = { ...idWhere, notIn: excludeIds };
    }

    // Parent
    let parentWhere: Prisma.IntNullableFilter = {};
    if (isChipset && !isRetailModel) {
      parentWhere = null;
    } else if (!isChipset && isRetailModel) {
      parentWhere = { not: null };
    }
    if (chipsetIds != null && chipsetIds.length > 0) {
      parentWhere = { ...parentWhere, in: chipsetIds };
    }

    // Company
    const companyWhere: Prisma.StringNullableFilter =
      companies.length > 0 ? { in: companies, mode: 'insensitive' } : undefined;

    // Segment
    const segmentWhere: Prisma.StringNullableFilter =
      segments.length > 0 ? { in: segments, mode: 'insensitive' } : undefined;

    // Year
    const yearWhere: Prisma.ProductWhereInput[] = years.map((year) => ({
      gpuFields: {
        releaseDateValue: {
          gte: `${year}-01-01`,
          lte: `${year}-12-31`,
        },
      },
    }));

    // Has Release Date
    let hasReleaseDateWhere: Prisma.StringNullableFilter = undefined;
    if (hasReleaseDate != null) {
      hasReleaseDateWhere = hasReleaseDate ? { not: null } : { equals: null };
    }

    return {
      AND: [
        {
          productType,
          id: idWhere,
          parentId: parentWhere,
          company: companyWhere,
          gpuFields: {
            marketSegmentValue: segmentWhere,
            releaseDateValue: hasReleaseDateWhere,
          },
        },
        { OR: yearWhere },
      ],
    };
  }

  private generateOrderBy(
    productType: ProductType,
    orderBy: ListOrderBy,
  ):
    | Prisma.ProductOrderByWithRelationAndSearchRelevanceInput
    | Prisma.ProductOrderByWithRelationAndSearchRelevanceInput[] {
    if (orderBy == null) {
      return { id: 'desc' };
    }

    const { sort } = orderBy;
    if (sort === ListSort.Id) {
      // Default ASC
      const order = orderBy?.order ?? ListOrder.Asc;
      return { id: order };
    }

    if (sort === ListSort.Name) {
      // Default ASC
      const order = orderBy?.order ?? ListOrder.Asc;
      return [{ searchText: order }];
    }

    if (sort === ListSort.ReleaseDate) {
      // Default DESC
      const order = orderBy?.order ?? ListOrder.Desc;
      if (productType === ProductType.Cpu) {
        return {
          cpuFields: { releaseDateValue: { sort: order, nulls: 'last' } },
        };
      } else if (productType === ProductType.Gpu) {
        return {
          gpuFields: { releaseDateValue: { sort: order, nulls: 'last' } },
        };
      } else {
        throw new Error('Unsupported product type for release date sort.');
      }
    }

    return { id: 'desc' };
  }

  private generateProductInclude(
    options: IncludeRelationsOptions & { productType?: ProductType },
  ): Prisma.ProductInclude {
    const productType = options.productType;
    const includeFields = options.includeFields ?? true;
    const includeBenchmarks = options.includeBenchmarks ?? false;
    const includeRanks = options.includeRanks ?? false;
    const includeSources = options.includeBenchmarks ?? false;
    const includeParent = options.includeParent ?? false;
    const includeChildren = options.includeChildren ?? false;
    const includeImages = options.includeImages ?? false;
    const includeRelated = options.includeRelated ?? false;
    const includeRelatedFields = options.includeRelatedFields ?? false;
    const includeRelatedBenchmarks = options.includeRelatedBenchmarks ?? false;
    const includeRelatedRanks = options.includeRelatedRanks ?? false;

    const includeCpuFields =
      includeFields && (productType === ProductType.Cpu || productType == null);
    const includeGpuFields =
      includeFields && (productType === ProductType.Gpu || productType == null);
    const includeRelatedCpuFields =
      includeRelatedFields &&
      (productType === ProductType.Cpu || productType == null);
    const includeRelatedGpuFields =
      includeRelatedFields &&
      (productType === ProductType.Gpu || productType == null);

    return {
      cpuFields: includeCpuFields,
      gpuFields: includeGpuFields,
      benchmarks: includeBenchmarks,
      ranks: includeRanks,
      sources: includeSources,
      relatedProducts: includeRelated
        ? {
            include: {
              relatedProduct: {
                include: {
                  cpuFields: includeRelatedCpuFields,
                  gpuFields: includeRelatedGpuFields,
                  benchmarks: includeRelatedBenchmarks,
                  ranks: includeRelatedRanks,
                },
              },
            },
          }
        : false,
      parent: includeParent
        ? {
            include: {
              cpuFields: includeCpuFields,
              gpuFields: includeGpuFields,
              ranks: includeRanks,
              benchmarks: includeBenchmarks,
              relatedProducts: includeRelated
                ? {
                    include: {
                      relatedProduct: {
                        include: {
                          cpuFields: includeRelatedCpuFields,
                          gpuFields: includeRelatedGpuFields,
                          benchmarks: includeRelatedBenchmarks,
                          ranks: includeRelatedRanks,
                        },
                      },
                    },
                  }
                : false,
            },
          }
        : false,
      children: includeChildren,
      images: includeImages ? { include: { image: true } } : false,
    };
  }

  private generateProductSelect(
    options: IncludeRelationsOptions & { productType?: ProductType },
  ): Prisma.ProductSelect {
    const productType = options.productType;
    const includeFields = options.includeFields ?? true;
    const includeBenchmarks = options.includeBenchmarks ?? false;
    const includeRanks = options.includeRanks ?? false;
    const includeSources = options.includeBenchmarks ?? false;
    const includeParent = options.includeParent ?? false;
    const includeChildren = options.includeChildren ?? false;
    const includeImages = options.includeImages ?? false;
    const includeRelated = options.includeRelated ?? false;
    const includeRelatedFields = options.includeRelatedFields ?? false;
    const includeRelatedBenchmarks = options.includeRelatedBenchmarks ?? false;
    const includeRelatedRanks = options.includeRelatedRanks ?? false;

    const includeCpuFields =
      includeFields && (productType === ProductType.Cpu || productType == null);
    const includeGpuFields =
      includeFields && (productType === ProductType.Gpu || productType == null);
    const includeRelatedCpuFields =
      includeRelatedFields &&
      (productType === ProductType.Cpu || productType == null);
    const includeRelatedGpuFields =
      includeRelatedFields &&
      (productType === ProductType.Gpu || productType == null);

    let selectCpuFields = undefined;
    if (includeCpuFields && Array.isArray(includeFields)) {
      selectCpuFields = {
        select: includeFields.reduce((acc, fieldKey) => {
          acc[fieldKey + 'Value'] = true;
          acc[fieldKey + 'Meta'] = true;
          return acc;
        }, {} as Record<string, boolean>),
      };
    } else if (includeCpuFields) {
      selectCpuFields = true;
    }

    let selectGpuFields = undefined;
    if (includeGpuFields && Array.isArray(includeFields)) {
      selectGpuFields = {
        select: includeFields.reduce((acc, fieldKey) => {
          acc[fieldKey + 'Value'] = true;
          acc[fieldKey + 'Meta'] = true;
          return acc;
        }, {} as Record<string, boolean>),
      };
    } else if (includeGpuFields) {
      selectGpuFields = true;
    }

    return {
      id: true,
      productType: true,
      parentId: true,
      name: true,
      slug: true,
      summary: true,
      searchText: true,
      otherNames: true,
      company: true,
      affiliateUrl: true,
      metadata: true,

      benchmarks: includeBenchmarks
        ? {
            select: {
              productId: true,
              benchmarkKey: true,
              value: true,
              valuePerMsrp: true,
              metadata: true,
            },
          }
        : undefined,
      ranks: includeRanks
        ? {
            select: {
              productId: true,
              ranks: true,
            },
          }
        : undefined,
      sources: includeSources
        ? {
            select: {
              productId: true,
              sourceKey: true,
              sourceUrl: true,
              metadata: true,
            },
          }
        : undefined,
      images: includeImages
        ? {
            select: {
              image: {
                select: {
                  id: true,
                  path: true,
                  name: true,
                  sourceName: true,
                  sourceUrl: true,
                  fileSize: true,
                  height: true,
                  width: true,
                },
              },
            },
          }
        : undefined,
      cpuFields: selectCpuFields,
      gpuFields: selectGpuFields,

      parent: includeParent
        ? {
            select: {
              name: true,
              productType: true,
              slug: true,
              company: true,
              benchmarks: includeBenchmarks
                ? {
                    select: {
                      productId: true,
                      benchmarkKey: true,
                      value: true,
                      valuePerMsrp: true,
                    },
                  }
                : undefined,
              gpuFields: selectGpuFields,
              ranks: includeRanks
                ? {
                    select: {
                      productId: true,
                      ranks: true,
                    },
                  }
                : undefined,
              relatedProducts: includeRelated
                ? {
                    select: {
                      relatedProduct: {
                        select: {
                          name: true,
                          productType: true,
                          slug: true,
                          company: true,
                          benchmarks: includeRelatedBenchmarks
                            ? {
                                select: {
                                  productId: true,
                                  benchmarkKey: true,
                                  value: true,
                                  valuePerMsrp: true,
                                },
                              }
                            : undefined,
                          cpuFields: false,
                          gpuFields: false,
                          ranks: includeRelatedRanks
                            ? {
                                select: {
                                  productId: true,
                                  ranks: true,
                                },
                              }
                            : undefined,
                        },
                      },
                    },
                  }
                : undefined,
            },
          }
        : undefined,
      children: false,

      relatedProducts: includeRelated
        ? {
            select: {
              relatedProduct: {
                select: {
                  name: true,
                  productType: true,
                  slug: true,
                  company: true,
                  benchmarks: includeRelatedBenchmarks
                    ? {
                        select: {
                          productId: true,
                          benchmarkKey: true,
                          value: true,
                          valuePerMsrp: true,
                        },
                      }
                    : undefined,
                  cpuFields: false,
                  gpuFields: false,
                  ranks: includeRelatedRanks
                    ? {
                        select: {
                          productId: true,
                          ranks: true,
                        },
                      }
                    : undefined,
                },
              },
            },
          }
        : undefined,

      // cpuFields: includeCpuFields,
      // gpuFields: includeGpuFields,
      // benchmarks: includeBenchmarks,
      // ranks: includeRanks,
      // sources: includeSources,
      // relatedProducts: includeRelated
      //   ? {
      //       include: {
      //         relatedProduct: {
      //           include: {
      //             cpuFields: includeRelatedCpuFields,
      //             gpuFields: includeRelatedGpuFields,
      //             benchmarks: includeRelatedBenchmarks,
      //             ranks: includeRelatedRanks,
      //           },
      //         },
      //       },
      //     }
      //   : false,
      // parent: includeParent
      //   ? {
      //       include: {
      //         cpuFields: includeCpuFields,
      //         gpuFields: includeGpuFields,
      //         ranks: includeRanks,
      //         benchmarks: includeBenchmarks,
      //         relatedProducts: includeRelated
      //           ? {
      //               include: {
      //                 relatedProduct: {
      //                   include: {
      //                     cpuFields: includeRelatedCpuFields,
      //                     gpuFields: includeRelatedGpuFields,
      //                     benchmarks: includeRelatedBenchmarks,
      //                     ranks: includeRelatedRanks,
      //                   },
      //                 },
      //               },
      //             }
      //           : false,
      //       },
      //     }
      //   : false,
      // children: includeChildren,
      // images: includeImages ? { include: { image: true } } : false,
    };
  }
}
