import {
  ListCpusFilter,
  ListGpusFilter,
  ListOrder,
  ListOrderBy,
  ListPagination,
  ListProductsFilter,
  ListSort,
  ProductCalculationsRequest,
  ProductFieldMeta,
  ProductType,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductEntity } from './ProductEntity';
import { ProductRankEntity } from './ProductRankEntity';
import { RelatedProductEntity } from './RelatedProductEntity';

interface FindByIdOptions extends IncludeRelationsOptions {
  id: number;
}

interface FindBySlugOptions extends IncludeRelationsOptions {
  productType: ProductType;
  slug: string;
}

interface CountOptions {
  productType: ProductType;
  filter?: ListProductsFilter;
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
  includeRelatedFields?: boolean;
  includeBenchmarks?: boolean;
  includeRanks?: boolean;
  includeImages?: boolean;
  includeSources?: boolean;
  includeRelated?: boolean;
  includeParent?: boolean;
  includeChildren?: boolean;
}

export class ProductRepository {
  constructor(protected db: DatabaseClient) {}

  async findById(options: FindByIdOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const includeFields = options.includeFields ?? true;
    const includeParent = options.includeParent ?? false;
    const includeChildren = options.includeChildren ?? false;
    const includeImages = options.includeImages ?? false;
    const includeSources = options.includeSources ?? false;
    const includeBenchmarks = options.includeBenchmarks ?? false;
    const includeRanks = options.includeRanks ?? false;
    const includeRelated = options.includeRelated ?? false;
    const includeRelatedFields = options.includeRelatedFields ?? false;

    const id = options.id;
    return await db.product.findUnique({
      where: { id },
      include: {
        cpuFields: includeFields,
        gpuFields: includeFields,
        benchmarks: includeBenchmarks,
        ranks: includeRanks,
        sources: includeSources,
        relatedProducts: includeRelated
          ? {
              include: {
                relatedProduct: {
                  include: {
                    cpuFields: includeRelatedFields,
                    gpuFields: includeRelatedFields,
                  },
                },
              },
            }
          : false,
        parent: includeParent
          ? {
              include: {
                cpuFields: true,
                gpuFields: true,
                relatedProducts: includeRelated
                  ? {
                      include: {
                        relatedProduct: {
                          include: {
                            cpuFields: includeRelatedFields,
                            gpuFields: includeRelatedFields,
                          },
                        },
                      },
                    }
                  : false,
              },
            }
          : false,
        children: includeChildren
          ? { include: { cpuFields: true, gpuFields: true } }
          : false,
        images: includeImages ? { include: { image: true } } : false,
      },
    });
  }

  async findBySlug(options: FindBySlugOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const productType = options.productType;
    const includeFields = options.includeFields ?? true;
    const includeParent = options.includeParent ?? false;
    const includeChildren = options.includeChildren ?? false;
    const includeImages = options.includeImages ?? false;
    const includeSources = options.includeSources ?? false;
    const includeBenchmarks = options.includeBenchmarks ?? false;
    const includeRanks = options.includeRanks ?? false;
    const includeRelated = options.includeRelated ?? false;
    const includeRelatedFields = options.includeRelatedFields ?? false;

    const slug = options.slug;

    return await db.product.findUnique({
      where: { productType_slug: { productType, slug } },
      include: {
        cpuFields: includeFields && productType === ProductType.Cpu,
        gpuFields: includeFields && productType === ProductType.Gpu,
        benchmarks: includeBenchmarks,
        ranks: includeRanks,
        sources: includeSources,
        relatedProducts: includeRelated
          ? {
              include: {
                relatedProduct: {
                  include: {
                    cpuFields:
                      includeRelatedFields && productType === ProductType.Cpu,
                    gpuFields:
                      includeRelatedFields && productType === ProductType.Gpu,
                  },
                },
              },
            }
          : false,
        parent: includeParent
          ? {
              include: {
                cpuFields: true,
                gpuFields: true,
                relatedProducts: includeRelated
                  ? {
                      include: {
                        relatedProduct: {
                          include: {
                            cpuFields:
                              includeRelatedFields &&
                              productType === ProductType.Cpu,
                            gpuFields:
                              includeRelatedFields &&
                              productType === ProductType.Gpu,
                          },
                        },
                      },
                    }
                  : false,
              },
            }
          : false,
        children: includeChildren
          ? { include: { cpuFields: true, gpuFields: true } }
          : false,
        images: includeImages ? { include: { image: true } } : false,
      },
    });
  }

  async count(options: CountOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    return await db.product.count({
      where: { ...this.generateWhere(options.productType, options.filter) },
    });
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
    const includeFields = options.includeFields ?? true;
    const includeBenchmarks = options.includeBenchmarks ?? false;
    const includeRanks = options.includeRanks ?? false;
    const includeSources = options.includeBenchmarks ?? false;
    const includeParent = options.includeParent ?? false;
    const includeChildren = options.includeChildren ?? false;
    const includeImages = options.includeImages ?? false;
    const includeRelated = options.includeRelated ?? false;
    const includeRelatedFields = options.includeRelatedFields ?? false;

    return await db.product.findMany({
      where: { ...this.generateWhere(productType, options.filter) },
      orderBy: this.generateOrderBy(productType, options.orderBy),
      skip: options.pagination?.offset,
      take: options.pagination?.limit,
      include: {
        cpuFields: includeFields && productType === ProductType.Cpu,
        gpuFields: includeFields && productType === ProductType.Gpu,
        benchmarks: includeBenchmarks,
        ranks: includeRanks,
        sources: includeSources,
        relatedProducts: includeRelated
          ? {
              include: {
                relatedProduct: {
                  include: {
                    cpuFields:
                      includeRelatedFields && productType === ProductType.Cpu,
                    gpuFields:
                      includeRelatedFields && productType === ProductType.Gpu,
                  },
                },
              },
            }
          : false,
        parent: includeParent
          ? {
              include: {
                cpuFields: true,
                gpuFields: true,
                relatedProducts: includeRelated
                  ? {
                      include: {
                        relatedProduct: {
                          include: {
                            cpuFields:
                              includeRelatedFields &&
                              productType === ProductType.Cpu,
                            gpuFields:
                              includeRelatedFields &&
                              productType === ProductType.Gpu,
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
      },
    });
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

    // Unset relations
    await db.product.update({
      where: { id },
      data: {
        images: { set: [] },
        benchmarks: { set: [] },
        sources: { set: [] },
      },
    });

    return await db.product.update({
      where: { id },
      data: {
        ...productData,
        cpuFields: cpuFields != null ? { update: cpuFields } : undefined,
        gpuFields: gpuFields != null ? { update: gpuFields } : undefined,
        images: {
          connectOrCreate: images?.map((image) => ({
            create: { imageId: image.imageId },
            where: {
              productId_imageId: { productId: id, imageId: image.imageId },
            },
          })),
        },
        benchmarks: {
          connectOrCreate: benchmarks?.map((benchmark) => ({
            create: { ...benchmark, id: undefined, productId: undefined },
            where: {
              productId_benchmarkKey: {
                productId: id,
                benchmarkKey: benchmark.benchmarkKey,
              },
            },
          })),
        },
        sources: {
          connectOrCreate: sources?.map((source) => ({
            create: { ...source, id: undefined, productId: undefined },
            where: {
              productId_sourceKey: {
                productId: id,
                sourceKey: source.sourceKey,
              },
            },
          })),
        },
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
        slug: true,
        updatedAt: true,
      },
      where: {
        productType,
        parentId: hasParent ? { not: null } : { equals: null },
      },
    });
  }

  async applyCalculations(
    productType: ProductType,
    calculations: ProductCalculationsRequest[],
    config?: RepositoryConfig,
  ) {
    await this.resetCalculations(productType, config);
    await this.setScoreCalculations(productType, calculations, config);
    await this.setRankCalculations(calculations, config);
    await this.setRelatedProductCalculations(calculations, config);
  }

  private async resetCalculations(
    productType: ProductType,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    // Clear out fields
    const tableName: string = this.getFieldsTable(productType);
    await db.$executeRaw(Prisma.sql`
      UPDATE ${Prisma.raw(tableName)}
      SET 
        performance_rating_value = null,
        performance_rating_meta = null,
        performance_per_msrp_value = null,
        performance_per_msrp_meta = null
    `);

    // Clear out ranks
    await db.productRank.deleteMany({ where: { product: { productType } } });

    // Clear out related products
    await db.relatedProduct.deleteMany({ where: { product: { productType } } });
  }

  private async setScoreCalculations(
    productType: ProductType,
    calculations: ProductCalculationsRequest[],
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    const productIds: number[] = [];
    const performanceRatingValues: number[] = [];
    const performanceRatingMetas: Partial<ProductFieldMeta>[] = [];
    const performancePerMsrpValues: number[] = [];
    const performancePerMsrpMetas: Partial<ProductFieldMeta>[] = [];
    calculations.forEach((calculation) => {
      if (calculation.scores == null) {
        return;
      }
      const { productId, scores } = calculation;

      productIds.push(productId);
      performanceRatingValues.push(scores.performanceRating || null);
      performancePerMsrpValues.push(scores.performancePerMsrp || null);
      performanceRatingMetas.push(
        scores.performanceRating != null
          ? {
              fieldKey: 'performanceRating',
              formattedValue: `${scores.performanceRating.toFixed(2)}`,
              autoUpdate: true,
            }
          : null,
      );
      performancePerMsrpMetas.push(
        scores.performancePerMsrp != null
          ? {
              fieldKey: 'performancePerMsrp',
              formattedValue: `${scores.performancePerMsrp.toFixed(2)}`,
              autoUpdate: true,
            }
          : null,
      );
    });

    const tableName: string = this.getFieldsTable(productType);
    await db.$executeRaw(Prisma.sql`
      UPDATE ${Prisma.raw(tableName)} f
      SET (
        performance_rating_value,
        performance_rating_meta,
        performance_per_msrp_value,
        performance_per_msrp_meta
      ) = (
        d.performance_rating_value,
        d.performance_rating_meta,
        d.performance_per_msrp_value,
        d.performance_per_msrp_meta
      )
      FROM (
        SELECT * FROM UNNEST(
          ${productIds}::INT[],
          ${performanceRatingValues}::FLOAT[],
          ${performanceRatingMetas}::JSON[],
          ${performancePerMsrpValues}::FLOAT[],
          ${performancePerMsrpMetas}::JSON[]
        ) AS t(product_id,
                performance_rating_value,
                performance_rating_meta,
                performance_per_msrp_value,
                performance_per_msrp_meta)
      ) AS d
      WHERE f.product_id = d.product_id
    `);
  }

  private async setRankCalculations(
    calculations: ProductCalculationsRequest[],
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;
    const dataToInsert: ProductRankEntity[] = [];

    const filtered = calculations.filter((c) => c.ranks != null);
    for (const calculation of filtered) {
      const entries = Object.entries(calculation.ranks).map(([key, rank]) => ({
        id: undefined,
        productId: calculation.productId,
        rankKey: key,
        rank: rank.rank,
        totalRanked: rank.totalRanked,
        metadata: null,
      }));

      dataToInsert.push(...entries);
    }
    await db.productRank.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });
  }

  private async setRelatedProductCalculations(
    calculations: ProductCalculationsRequest[],
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;
    const dataToInsert: RelatedProductEntity[] = [];

    const filtered = calculations.filter((c) => c.related != null);
    for (const calculation of filtered) {
      const groupedEntries = Object.entries(calculation.related).map(
        ([type, relatedProductIds]) =>
          relatedProductIds.map((relatedProductId) => ({
            productId: calculation.productId,
            relatedProductId,
            type,
          })),
      );

      for (const entries of groupedEntries) {
        dataToInsert.push(...entries);
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
    const performanceRated = filter?.performanceRated ?? false;
    const valueRated = filter?.valueRated;
    const maxPerformanceScore = filter?.maxPerformanceScore;
    const minPerformanceScore = filter?.minPerformanceScore;
    const maxValueScore = filter?.maxValueScore;
    const minValueScore = filter?.minValueScore;
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

    // Performance Score
    let performanceWhere: Prisma.FloatNullableFilter = {};
    if (performanceRated) {
      performanceWhere = { ...performanceWhere, not: null };
    }
    if (maxPerformanceScore != null) {
      performanceWhere = { ...performanceWhere, lte: maxPerformanceScore };
    }
    if (minPerformanceScore != null) {
      performanceWhere = { ...performanceWhere, gte: minPerformanceScore };
    }

    // Value Score
    let valueWhere: Prisma.FloatNullableFilter = {};
    if (valueRated) {
      valueWhere = { ...valueWhere, not: null };
    }
    if (maxValueScore != null) {
      valueWhere = { ...valueWhere, lte: maxValueScore };
    }
    if (minValueScore != null) {
      valueWhere = { ...valueWhere, gte: minValueScore };
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
            performanceRatingValue: performanceWhere,
            performancePerMsrpValue: valueWhere,
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
    const performanceRated = filter?.performanceRated ?? false;
    const valueRated = filter?.valueRated;
    const maxPerformanceScore = filter?.maxPerformanceScore;
    const minPerformanceScore = filter?.minPerformanceScore;
    const maxValueScore = filter?.maxValueScore;
    const minValueScore = filter?.minValueScore;
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

    // Performance Score
    let performanceWhere: Prisma.FloatNullableFilter = {};
    if (performanceRated) {
      performanceWhere = { ...performanceWhere, not: null };
    }
    if (maxPerformanceScore != null) {
      performanceWhere = { ...performanceWhere, lte: maxPerformanceScore };
    }
    if (minPerformanceScore != null) {
      performanceWhere = { ...performanceWhere, gte: minPerformanceScore };
    }

    // Value Score
    let valueWhere: Prisma.FloatNullableFilter = {};
    if (valueRated) {
      valueWhere = { ...valueWhere, not: null };
    }
    if (maxValueScore != null) {
      valueWhere = { ...valueWhere, lte: maxValueScore };
    }
    if (minValueScore != null) {
      valueWhere = { ...valueWhere, gte: minValueScore };
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

    return {
      AND: [
        {
          productType,
          id: idWhere,
          parentId: parentWhere,
          company: companyWhere,
          gpuFields: {
            performanceRatingValue: performanceWhere,
            performancePerMsrpValue: valueWhere,
            marketSegmentValue: segmentWhere,
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

    if (sort === ListSort.PerformanceRating) {
      // Default DESC
      const order = orderBy?.order ?? ListOrder.Desc;
      if (productType === ProductType.Cpu) {
        return {
          cpuFields: { performanceRatingValue: { sort: order, nulls: 'last' } },
        };
      } else if (productType === ProductType.Gpu) {
        return {
          gpuFields: { performanceRatingValue: { sort: order, nulls: 'last' } },
        };
      } else {
        throw new Error(
          'Unsupported product type for performance rating sort.',
        );
      }
    }

    if (sort === ListSort.PerformancePerMsrp) {
      // Default DESC
      const order = orderBy?.order ?? ListOrder.Desc;
      if (productType === ProductType.Cpu) {
        return {
          cpuFields: {
            performancePerMsrpValue: { sort: order, nulls: 'last' },
          },
        };
      } else if (productType === ProductType.Gpu) {
        return {
          gpuFields: {
            performancePerMsrpValue: { sort: order, nulls: 'last' },
          },
        };
      } else {
        throw new Error(
          'Unsupported product type for performance per msrp sort.',
        );
      }
    }

    return { id: 'desc' };
  }

  private getFieldsTable(productType: ProductType) {
    if (productType === ProductType.Cpu) {
      return 'cpu_fields';
    } else if (productType === ProductType.Gpu) {
      return 'gpu_fields';
    } else {
      throw new Error(
        `Invalid product type (${productType}) for ProductRepository.getFieldsTableName`,
      );
    }
  }
}
