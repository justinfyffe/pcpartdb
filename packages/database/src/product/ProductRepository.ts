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
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { CpuFieldsEntity } from './CpuFieldsEntity';
import { GpuFieldsEntity } from './GpuFieldsEntity';
import { ProductBenchmarkEntity } from './ProductBenchmarkEntity';
import { ProductEntity } from './ProductEntity';
import { ProductRankEntity } from './ProductRankEntity';
import { ProductSourceEntity } from './ProductSourceEntity';
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
  includeFields?: boolean;
  includeImages?: boolean;
  includeBenchmarks?: boolean;
  includeRanks?: boolean;
  includeSources?: boolean;

  includeRelated?: boolean;
  includeRelatedFields?: boolean;
  includeRelatedBenchmarks?: boolean;
  includeRelatedRanks?: boolean;

  includeParent?: boolean;
  includeParentFields?: boolean;

  fields?: ProductFieldKey[];
  parentFields?: ProductFieldKey[];
  relatedFields?: ProductFieldKey[];
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
  }

  async findByIds(
    options: FindByIdsOptions,
    config?: RepositoryConfig,
  ): Promise<ProductEntity[]> {
    const db = config?.trx ?? this.db;
    const ids = options.ids;

    // Fetch base product entities for the ids
    const products: ProductEntity[] = await db.product.findMany({
      where: { id: { in: ids } },
    });
    if (products.length === 0) {
      return null;
    }

    // First set of queries: Fetching relevant products like parent and related
    // products. These will be needed to fetch the data for each relevant
    // product.

    // Fetch parents
    const parents = await this.populateParents(products, options, config);

    // Fetch related products
    const relatedProductEntities = await this.populateRelated(
      products,
      parents,
      options,
      config,
    );
    const relatedProducts = relatedProductEntities.map(
      (rpe) => rpe.relatedProduct,
    );

    // Second set of queries: Fetching related data to the products fetched
    // earlier. For example: ranks, benchmarks, fields.

    const queries = [
      this.populateFields(products, parents, relatedProducts, options, config),
      this.populateBenchmarks(
        products,
        parents,
        relatedProducts,
        options,
        config,
      ),
      this.populateRanks(products, parents, relatedProducts, options, config),
      this.populateSources(products, options, config),
    ];

    await Promise.all(queries);

    return sortByIds(ids, products, (p) => p.id);
  }

  async findBySlug(
    options: FindBySlugOptions,
    config?: RepositoryConfig,
  ): Promise<ProductEntity> {
    const db = config?.trx ?? this.db;

    const productType = options.productType;
    const slug = options.slug;

    const product: ProductEntity = await db.product.findUnique({
      where: { productType_slug: { productType, slug } },
    });

    if (product != null) {
      const products = await this.findByIds(
        { ...options, ids: [product.id] },
        config,
      );
      return products[0] || null;
    } else {
      return null;
    }
  }

  async count(options: CountOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;
    const { productType } = options;

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
            { product: { ...this.generateWhere(productType, options.filter) } },
          ],
        },
      });
    } else {
      return await db.product.count({
        where: { ...this.generateWhere(options.productType, options.filter) },
      });
    }
  }

  async countChildren(
    options: CountChildrenOptions,
    config?: RepositoryConfig,
  ) {
    const { productIds } = options;
    const db = config?.trx ?? this.db;

    const results = await db.product.groupBy({
      _count: true,
      by: ['parentId'],
      where: { parentId: { in: productIds } },
    });

    return results.reduce((acc, result) => {
      acc[result.parentId] = result._count;
      return acc;
    }, {} as Record<number, number>);
  }

  async list(options: ListOptions, config?: RepositoryConfig) {
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
      return await this.findByIds({ ...options, ids });
    } else {
      const productIdsResult = await db.product.findMany({
        select: { id: true },
        where: { ...this.generateWhere(productType, options.filter) },
        orderBy: this.generateOrderBy(productType, options.orderBy),
        skip: options.pagination?.offset,
        take: options.pagination?.limit,
      });
      const productIds = productIdsResult.map((p) => p.id);

      return await this.findByIds({ ...options, ids: productIds }, config);
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

  private async populateParents(
    products: ProductEntity[],
    options: IncludeRelationsOptions,
    config?: RepositoryConfig,
  ) {
    if (!options.includeParent) {
      return [];
    }

    const db = config?.trx ?? this.db;

    const parentIds = products
      .filter((p) => p.parentId)
      .map((p) => Number(p.parentId));

    const parents = await db.product.findMany({
      where: { id: { in: parentIds } },
    });
    const parentsMap = parents.reduce((acc, parent) => {
      acc[parent.id] = parent;
      return acc;
    }, {} as Record<number, ProductEntity>);

    for (const product of products) {
      if (product.parentId) {
        product.parent = parentsMap[product.parentId] ?? null;
      }
    }

    return parents;
  }

  private async populateRelated(
    products: ProductEntity[],
    parents: ProductEntity[],
    options: IncludeRelationsOptions,
    config?: RepositoryConfig,
  ) {
    if (!options.includeRelated) {
      return [];
    }

    const db = config?.trx ?? this.db;

    const ids = [...products, ...parents].map((p) => p.id);
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

    const relatedProductsMap = relatedProducts.reduce((acc, rp) => {
      acc[rp.productId] = acc[rp.productId] || [];
      acc[rp.productId].push(rp);
      return acc;
    }, {} as Record<number, RelatedProductEntity[]>);

    for (const product of [...products, ...parents]) {
      product.relatedProducts = relatedProductsMap[product.id];
    }

    return relatedProducts;
  }

  private async populateRanks(
    products: ProductEntity[],
    parents: ProductEntity[],
    related: ProductEntity[],
    options: IncludeRelationsOptions,
    config?: RepositoryConfig,
  ) {
    const ids: number[] = [];
    if (options.includeRanks) {
      const productIds = products.map((p) => p.id);
      const parentIds = parents.map((p) => p.id);
      ids.push(...productIds, ...parentIds);
    }

    if (options.includeRelatedRanks) {
      const relatedIds = related.map((p) => p.id);
      ids.push(...relatedIds);
    }

    const db = config?.trx ?? this.db;

    const ranks = await db.productRank.findMany({
      where: { productId: { in: ids } },
    });
    const ranksMap = ranks.reduce((acc, r) => {
      acc[r.productId] = r;
      return acc;
    }, {} as Record<number, ProductRankEntity>);

    for (const product of [...products, ...parents, ...related]) {
      product.ranks = ranksMap[product.id];
    }
  }

  private async populateBenchmarks(
    products: ProductEntity[],
    parents: ProductEntity[],
    related: ProductEntity[],
    options: IncludeRelationsOptions,
    config?: RepositoryConfig,
  ) {
    const ids: number[] = [];
    if (options.includeBenchmarks) {
      const productIds = products.map((p) => p.id);
      const parentIds = parents.map((p) => p.id);
      ids.push(...productIds, ...parentIds);
    }

    if (options.includeRelatedBenchmarks) {
      const relatedIds = related.map((p) => p.id);
      ids.push(...relatedIds);
    }

    const db = config?.trx ?? this.db;
    const benchmarks: ProductBenchmarkEntity[] =
      await db.productBenchmark.findMany({
        where: { productId: { in: ids } },
      });
    const benchmarksMap = benchmarks.reduce((acc, b) => {
      acc[b.productId] = acc[b.productId] || [];
      acc[b.productId].push(b);
      return acc;
    }, {} as Record<number, ProductBenchmarkEntity[]>);

    for (const product of [...products, ...parents, ...related]) {
      product.benchmarks = benchmarksMap[product.id];
    }
  }

  private async populateSources(
    products: ProductEntity[],
    options: IncludeRelationsOptions,
    config?: RepositoryConfig,
  ) {
    if (!options.includeSources) {
      return;
    }
    const ids: number[] = products.map((p) => p.id);

    const db = config?.trx ?? this.db;
    const sources = await db.productSource.findMany({
      where: { productId: { in: ids } },
    });
    const sourcesMap = sources.reduce((acc, s) => {
      acc[s.productId] = acc[s.productId] || [];
      acc[s.productId].push(s);
      return acc;
    }, {} as Record<number, ProductSourceEntity[]>);

    for (const product of products) {
      product.sources = sourcesMap[product.id];
    }
  }

  private async populateFields(
    products: ProductEntity[],
    parents: ProductEntity[],
    related: ProductEntity[],
    options: IncludeRelationsOptions,
    config?: RepositoryConfig,
  ) {
    if (!options.includeFields) {
      return;
    }

    const productType = products[0]?.productType;
    if (!productType) {
      return;
    }

    const db = config?.trx ?? this.db;

    // Products
    if (options.includeFields) {
      const ids = products.map((p) => p.id);
      const selectFields = this.buildFieldsSelect(options.fields);
      let fields: CpuFieldsEntity[] | GpuFieldsEntity[];
      let fieldsMap:
        | Record<number, CpuFieldsEntity>
        | Record<number, GpuFieldsEntity>;
      if (productType === ProductType.Cpu) {
        fields = (await db.cpuFields.findMany({
          where: { productId: { in: ids } },
          select: selectFields,
        })) as any;
        fieldsMap = this.buildFieldsMap(fields as CpuFieldsEntity[]);
      } else if (productType === ProductType.Gpu) {
        fields = (await db.gpuFields.findMany({
          where: { productId: { in: ids } },
          select: selectFields,
        })) as any;
        fieldsMap = this.buildFieldsMap(fields as GpuFieldsEntity[]);
      }

      for (const product of products) {
        if (productType === ProductType.Cpu) {
          product.cpuFields = fieldsMap[product.id] as CpuFieldsEntity;
        } else if (productType === ProductType.Gpu) {
          product.gpuFields = fieldsMap[product.id] as GpuFieldsEntity;
        }
      }
    }

    // Parents
    if (options.includeParentFields) {
      const ids = parents.map((p) => p.id);
      const selectFields = this.buildFieldsSelect(options.parentFields);
      let fields: CpuFieldsEntity[] | GpuFieldsEntity[];
      let fieldsMap:
        | Record<number, CpuFieldsEntity>
        | Record<number, GpuFieldsEntity>;
      if (productType === ProductType.Cpu) {
        fields = (await db.cpuFields.findMany({
          where: { productId: { in: ids } },
          select: selectFields,
        })) as any;
        fieldsMap = this.buildFieldsMap(fields as CpuFieldsEntity[]);
      } else if (productType === ProductType.Gpu) {
        fields = (await db.gpuFields.findMany({
          where: { productId: { in: ids } },
          select: selectFields,
        })) as any;
        fieldsMap = this.buildFieldsMap(fields as GpuFieldsEntity[]);
      }

      for (const product of parents) {
        if (productType === ProductType.Cpu) {
          product.cpuFields = fieldsMap[product.id] as CpuFieldsEntity;
        } else if (productType === ProductType.Gpu) {
          product.gpuFields = fieldsMap[product.id] as GpuFieldsEntity;
        }
      }
    }

    // Related
    if (options.includeRelatedFields) {
      const ids = related.map((p) => p.id);
      const selectFields = this.buildFieldsSelect(options.relatedFields);
      let fields: CpuFieldsEntity[] | GpuFieldsEntity[];
      let fieldsMap:
        | Record<number, CpuFieldsEntity>
        | Record<number, GpuFieldsEntity>;
      if (productType === ProductType.Cpu) {
        fields = (await db.cpuFields.findMany({
          where: { productId: { in: ids } },
          select: selectFields,
        })) as any;
        fieldsMap = this.buildFieldsMap(fields as CpuFieldsEntity[]);
      } else if (productType === ProductType.Gpu) {
        fields = (await db.gpuFields.findMany({
          where: { productId: { in: ids } },
          select: selectFields,
        })) as any;
        fieldsMap = this.buildFieldsMap(fields as GpuFieldsEntity[]);
      }

      for (const product of related) {
        if (productType === ProductType.Cpu) {
          product.cpuFields = fieldsMap[product.id] as CpuFieldsEntity;
        } else if (productType === ProductType.Gpu) {
          product.gpuFields = fieldsMap[product.id] as GpuFieldsEntity;
        }
      }
    }
  }

  private buildFieldsSelect(fields: ProductFieldKey[]) {
    if (fields == null) {
      return undefined;
    }

    return fields.reduce(
      (acc, fieldKey) => {
        acc[fieldKey + 'Value'] = true;
        acc[fieldKey + 'Meta'] = true;
        return acc;
      },
      { productId: true } as Record<string, boolean>,
    );
  }

  private buildFieldsMap<T extends CpuFieldsEntity | GpuFieldsEntity>(
    fields: T[],
  ) {
    return fields.reduce((acc, value) => {
      acc[value.productId] = value;
      return acc;
    }, {} as Record<number, T>);
  }
}
