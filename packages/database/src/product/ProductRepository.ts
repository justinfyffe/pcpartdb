import {
  BenchmarkKey,
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
  UpdateProductRanksRequest,
  UpdateRelatedProductsRequest,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductEntity } from './ProductEntity';
import { ProductRanksEntity } from './ProductRankEntity';
import { RelatedProductEntity } from './RelatedProductEntity';

interface FindById2Options {
  id: number;
}

interface FindByIds2Options {
  ids: number[];
}

interface FindBestProductOptions {
  benchmark: BenchmarkKey;
  sort: ListSort;
}

interface FindIdBySlugOptions {
  productType: ProductType;
  slug: string;
}

interface CountOptions {
  productType: ProductType;
  filter?: ListProductsFilter;
  orderBy?: ListOrderBy;
}

interface ListOptions extends IncludeRelationsOptions {
  filter: ListProductsFilter;
  orderBy?: ListOrderBy;
  pagination?: ListPagination;
}

interface IncludeRelationsOptions {
  includeFields?: boolean;
  includeImages?: boolean;
  includeSources?: boolean;

  includeRelated?: boolean;
  includeRelatedFields?: boolean;

  includeBenchmarks?: boolean;
  includeRelatedBenchmarks?: boolean;

  includeGames?: boolean;
  includeRelatedGames?: boolean;

  includeRanks?: boolean;
  includeRelatedRanks?: boolean;

  fields?: ProductFieldKey[];
  relatedFields?: ProductFieldKey[];
}

export class ProductRepository {
  constructor(protected db: DatabaseClient) {}

  async findById2(options: FindById2Options, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const result: ProductEntity = await db.product.findUnique({
      where: { id: options.id },
    });
    return result;
  }

  async findBestProductId(
    options: FindBestProductOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    let orderBy: Prisma.ProductBenchmarkOrderByWithRelationAndSearchRelevanceInput =
      undefined;
    if (options.sort === ListSort.PerformanceRating) {
      orderBy = { value: { sort: ListOrder.Desc, nulls: 'last' } };
    } else if (options.sort === ListSort.PerformancePerMsrp) {
      orderBy = { valuePerMsrp: { sort: ListOrder.Desc, nulls: 'last' } };
    }

    const { productId } = await db.productBenchmark.findFirst({
      select: { productId: true },
      where: { benchmarkKey: options.benchmark },
      orderBy,
      take: 1,
    });

    return productId;
  }

  async findByIds2(options: FindByIds2Options, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const result: ProductEntity[] = await db.product.findMany({
      where: { id: { in: options.ids } },
    });
    return result;
  }

  async findIdBySlug(options: FindIdBySlugOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const productType = options.productType;
    const slug = options.slug;

    const result = await db.product.findUnique({
      select: { id: true },
      where: { productType_slug: { productType, slug } },
    });
    return result?.id || null;
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

  async list2(options: ListOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;
    const productType = options.filter.productType;

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
      return ids;
    } else {
      const productIdsResult = await db.product.findMany({
        select: { id: true },
        where: { ...this.generateWhere(productType, options.filter) },
        orderBy: this.generateOrderBy(productType, options.orderBy),
        skip: options.pagination?.offset,
        take: options.pagination?.limit,
      });
      const productIds = productIdsResult.map((p) => p.id);
      return productIds;
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
      gameFps: gameFps,
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
        gameFps: { createMany: { data: gameFps, skipDuplicates: true } },
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
    await db.productGameFps.deleteMany({ where: { productId: id } });
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
      gameFps: gameFps,
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
        gameFps: { createMany: { data: gameFps, skipDuplicates: true } },
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
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;
    return await db.product.findMany({
      select: {
        id: true,
        slug: true,
        updatedAt: true,
        cpuFields: {
          select: { releaseDateValue: true, marketSegmentValue: true },
        },
        gpuFields: {
          select: { releaseDateValue: true, marketSegmentValue: true },
        },
        benchmarks: {
          select: { productId: true },
          where: { value: { not: null } },
        },
      },
      where: { productType },
    });
  }

  async applyRanks(
    updates: UpdateProductRanksRequest,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    const dataToInsert: ProductRanksEntity[] = [];

    // Clear out and create ranks
    const { productType } = updates;
    await db.productRanks.deleteMany({ where: { product: { productType } } });

    for (const data of Object.entries(updates.ranks)) {
      const [id, ranks] = data;
      dataToInsert.push({
        productId: Number(id),
        ranks,
      });
    }

    await db.productRanks.createMany({
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
      for (const [_key, relatedItem] of Object.entries(relatedProducts)) {
        dataToInsert.push({
          productId,
          relatedProductId: relatedItem.id,
        });
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
    if (productType === ProductType.Cpu) {
      return this.generateCpuWhere(productType, filter as ListCpusFilter);
    } else if (productType === ProductType.Gpu) {
      return this.generateGpuWhere(productType, filter as ListGpusFilter);
    } else {
      return this.generateGenericWhere(productType, filter);
    }
  }

  private generateCpuWhere(
    productType: ProductType,
    filter?: ListCpusFilter,
  ): Prisma.ProductWhereInput {
    const companies = filter?.company?.filter((value) => value != null) ?? [];
    const years = filter?.year?.filter((value) => value != null) ?? [];
    const segments = filter?.segment?.filter((value) => value != null) ?? [];
    const isMissingMarketSegment = filter?.missingMarketSegment;
    const isMissingProductionStatus = filter?.missingProductionStatus;
    const isMissingSummary = filter?.missingSummary;
    const isStaleSummary = filter?.staleSummary;
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
    const segmentsWhere: Prisma.ProductWhereInput[] = [];
    if (segments.length > 0) {
      segmentsWhere.push({
        cpuFields: {
          marketSegmentValue:
            segments.length > 0
              ? { in: segments, mode: 'insensitive' }
              : undefined,
        },
      });
    }
    if (isMissingMarketSegment === true) {
      segmentsWhere.push({ cpuFields: { marketSegmentValue: null } });
      segmentsWhere.push({ cpuFields: { marketSegmentValue: '' } });
    } else if (isMissingMarketSegment === false) {
      segmentsWhere.push({ cpuFields: { marketSegmentValue: { not: null } } });
      segmentsWhere.push({ cpuFields: { marketSegmentValue: { not: '' } } });
    }

    // Year
    const yearWhere: Prisma.ProductWhereInput[] = years.map((year) => ({
      cpuFields: {
        releaseDateValue: {
          gte: `${year}-01-01`,
          lte: `${year}-12-31`,
        },
      },
    }));

    // Production Status
    const productionStatusWhere: Prisma.ProductWhereInput[] = [];
    if (isMissingProductionStatus === true) {
      productionStatusWhere.push({
        cpuFields: { productionStatusValue: null },
      });
      productionStatusWhere.push({ cpuFields: { productionStatusValue: '' } });
    } else if (isMissingProductionStatus === false) {
      productionStatusWhere.push({
        cpuFields: { productionStatusValue: { not: null } },
      });
      productionStatusWhere.push({
        cpuFields: { productionStatusValue: { not: '' } },
      });
    }

    // Summary
    const summaryWhere: Prisma.ProductWhereInput[] = [];
    if (isMissingSummary === true) {
      summaryWhere.push({ summary: null });
      summaryWhere.push({ summary: '' });
    } else if (isMissingSummary === false) {
      summaryWhere.push({ summary: { not: null } });
      summaryWhere.push({ summary: { not: '' } });
    }
    if (isStaleSummary != null) {
      summaryWhere.push({ summaryStale: isStaleSummary });
    }

    const searchTextWhere = filter?.search
      ? { contains: filter.search, mode: 'insensitive' as Prisma.QueryMode }
      : undefined;

    return {
      AND: [
        {
          productType,
          id: idWhere,
          company: companyWhere,
          searchText: searchTextWhere,
        },
        { OR: summaryWhere },
        { OR: segmentsWhere },
        { OR: productionStatusWhere },
        { OR: yearWhere },
      ],
    };
  }

  private generateGpuWhere(
    productType: ProductType,
    filter?: ListGpusFilter,
  ): Prisma.ProductWhereInput {
    const companies = filter?.company?.filter((value) => value != null) ?? [];
    const years = filter?.year?.filter((value) => value != null) ?? [];
    const segments = filter?.segment?.filter((value) => value != null) ?? [];
    const isMissingMarketSegment = filter?.missingMarketSegment;
    const isMissingProductionStatus = filter?.missingProductionStatus;
    const isMissingSummary = filter?.missingSummary;
    const isStaleSummary = filter?.staleSummary;
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

    // Company
    const companyWhere: Prisma.StringNullableFilter =
      companies.length > 0 ? { in: companies, mode: 'insensitive' } : undefined;

    // Segment
    const segmentsWhere: Prisma.ProductWhereInput[] = [];
    if (segments.length > 0) {
      segmentsWhere.push({
        gpuFields: {
          marketSegmentValue:
            segments.length > 0
              ? { in: segments, mode: 'insensitive' }
              : undefined,
        },
      });
    }
    if (isMissingMarketSegment === true) {
      segmentsWhere.push({ gpuFields: { marketSegmentValue: null } });
      segmentsWhere.push({ gpuFields: { marketSegmentValue: '' } });
    } else if (isMissingMarketSegment === false) {
      segmentsWhere.push({ gpuFields: { marketSegmentValue: { not: null } } });
      segmentsWhere.push({ gpuFields: { marketSegmentValue: { not: '' } } });
    }

    // Year
    const yearWhere: Prisma.ProductWhereInput[] = years.map((year) => ({
      gpuFields: {
        releaseDateValue: {
          gte: `${year}-01-01`,
          lte: `${year}-12-31`,
        },
      },
    }));

    // Production Status
    const productionStatusWhere: Prisma.ProductWhereInput[] = [];
    if (isMissingProductionStatus === true) {
      productionStatusWhere.push({
        gpuFields: { productionStatusValue: null },
      });
      productionStatusWhere.push({ gpuFields: { productionStatusValue: '' } });
    } else if (isMissingProductionStatus === false) {
      productionStatusWhere.push({
        gpuFields: { productionStatusValue: { not: null } },
      });
      productionStatusWhere.push({
        gpuFields: { productionStatusValue: { not: '' } },
      });
    }

    // Summary
    const summaryWhere: Prisma.ProductWhereInput[] = [];
    if (isMissingSummary === true) {
      summaryWhere.push({ summary: null });
      summaryWhere.push({ summary: '' });
    } else if (isMissingSummary === false) {
      summaryWhere.push({ summary: { not: null } });
      summaryWhere.push({ summary: { not: '' } });
    }
    if (isStaleSummary != null) {
      summaryWhere.push({ summaryStale: isStaleSummary });
    }

    // Has Release Date
    let hasReleaseDateWhere: Prisma.StringNullableFilter = undefined;
    if (hasReleaseDate != null) {
      hasReleaseDateWhere = hasReleaseDate ? { not: null } : { equals: null };
    }

    const searchTextWhere = filter?.search
      ? { contains: filter.search, mode: 'insensitive' as Prisma.QueryMode }
      : undefined;

    return {
      AND: [
        {
          productType,
          id: idWhere,
          company: companyWhere,
          gpuFields: {
            releaseDateValue: hasReleaseDateWhere,
          },
          searchText: searchTextWhere,
        },
        { OR: segmentsWhere },
        { OR: productionStatusWhere },
        { OR: summaryWhere },
        { OR: yearWhere },
      ],
    };
  }

  private generateGenericWhere(
    productType: ProductType,
    filter?: ListProductsFilter,
  ): Prisma.ProductWhereInput {
    const searchTextWhere = filter?.search
      ? { contains: filter.search, mode: 'insensitive' as Prisma.QueryMode }
      : undefined;

    return {
      AND: [{ productType, searchText: searchTextWhere }],
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
}
