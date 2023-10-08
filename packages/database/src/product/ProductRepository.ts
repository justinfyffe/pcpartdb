import {
  ListCpusFilter,
  ListGpusFilter,
  ListOrder,
  ListOrderBy,
  ListPagination,
  ListProductsFilter,
  ListSort,
  ProductType,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductEntity } from './ProductEntity';

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
  includeBenchmarks?: boolean;
  includeImages?: boolean;
  includeSources?: boolean;
  includeParent?: boolean;
  includeChildren?: boolean;
}

export class ProductRepository {
  constructor(protected db: DatabaseClient) {}

  async findById(options: FindByIdOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const includeParent = options.includeParent ?? false;
    const includeChildren = options.includeChildren ?? false;
    const includeImages = options.includeImages ?? false;
    const includeSources = options.includeSources ?? false;
    const includeBenchmarks = options.includeBenchmarks ?? false;

    const id = options.id;
    return await db.product.findUnique({
      where: { id },
      include: {
        cpuFields: true,
        gpuFields: true,
        benchmarks: includeBenchmarks,
        sources: includeSources,
        parent: includeParent
          ? { include: { cpuFields: true, gpuFields: true } }
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

    const includeParent = options.includeParent ?? false;
    const includeChildren = options.includeChildren ?? false;
    const includeImages = options.includeImages ?? false;
    const includeSources = options.includeSources ?? false;
    const includeBenchmarks = options.includeBenchmarks ?? false;

    const productType = options.productType;
    const slug = options.slug;
    return await db.product.findUnique({
      where: { productType_slug: { productType, slug } },
      include: {
        cpuFields: true,
        gpuFields: true,
        benchmarks: includeBenchmarks,
        sources: includeSources,
        parent: includeParent
          ? { include: { cpuFields: true, gpuFields: true } }
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
      where: {
        AND: [
          { productType: options.productType },
          { ...this.generateWhere(options.productType, options.filter) },
        ],
      },
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
    return await db.product.findMany({
      where: {
        AND: [
          { productType: options.productType },
          { ...this.generateWhere(options.productType, options.filter) },
        ],
      },
      orderBy: this.generateOrderBy(options.productType, options.orderBy),
      skip: options.pagination?.offset,
      take: options.pagination?.limit,
      include: {
        cpuFields: true,
        gpuFields: true,
        benchmarks: options.includeBenchmarks ?? false,
        sources: options.includeSources ?? false,
        parent: options.includeParent ?? false,
        children: options.includeChildren ?? false,
        images:
          options.includeImages ?? false ? { include: { image: true } } : false,
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
      sources: sources,
      updates: _updates,
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
      sources: sources,
      id: _id,
      updates: _updates,
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

  private generateWhere(
    productType: ProductType,
    filter?: ListProductsFilter,
  ): Prisma.ProductWhereInput {
    switch (productType) {
      case ProductType.Cpu:
        return this.generateCpuWhere(filter as ListCpusFilter);
      case ProductType.Gpu:
        return this.generateGpuWhere(filter as ListGpusFilter);
      default:
        throw new Error('Invalid product type');
    }
  }

  private generateCpuWhere(filter?: ListCpusFilter): Prisma.ProductWhereInput {
    const performanceRated = filter?.performanceRated ?? false;
    const valueRated = filter?.valueRated;
    const maxPerformanceScore = filter?.maxPerformanceScore;
    const minPerformanceScore = filter?.minPerformanceScore;
    const maxValueScore = filter?.maxValueScore;
    const minValueScore = filter?.minValueScore;
    const companies = filter?.company?.filter((value) => value != null) ?? [];
    const years = filter?.year?.filter((value) => value != null) ?? [];
    const segments = filter?.segment?.filter((value) => value != null) ?? [];
    const excludeIds =
      filter?.excludeIds?.filter((value) => value != null) ?? [];

    // Exclude Ids
    let idWhere: Prisma.IntFilter = {};
    if (excludeIds != null) {
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
        { id: idWhere },
        { company: companyWhere },
        { cpuFields: { marketSegmentValue: segmentsWhere } },
        { cpuFields: { performanceRatingValue: performanceWhere } },
        { cpuFields: { performancePerMsrpValue: valueWhere } },
        { OR: yearWhere },
      ],
    };
  }

  private generateGpuWhere(filter?: ListGpusFilter): Prisma.ProductWhereInput {
    const chipsetId = filter?.chipsetId;
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
    const excludeIds =
      filter?.excludeIds?.filter((value) => value != null) ?? [];

    // Exclude Ids
    let idWhere: Prisma.IntFilter = {};
    if (excludeIds != null) {
      idWhere = { ...idWhere, notIn: excludeIds };
    }

    // Parent
    let parentWhere: Prisma.IntNullableFilter = {};
    if (isChipset && !isRetailModel) {
      parentWhere = null;
    } else if (!isChipset && isRetailModel) {
      parentWhere = { not: null };
    }
    if (chipsetId != null) {
      parentWhere = { ...parentWhere, equals: chipsetId };
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
        { id: idWhere },
        { parentId: parentWhere },
        { company: companyWhere },
        { gpuFields: { marketSegmentValue: segmentWhere } },
        { gpuFields: { performanceRatingValue: performanceWhere } },
        { gpuFields: { performancePerMsrpValue: valueWhere } },
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
      return [{ company: { sort: order, nulls: 'last' } }, { name: order }];
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
}
