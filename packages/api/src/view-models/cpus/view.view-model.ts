import { Injectable } from '@nestjs/common';
import {
  binarySearch,
  CpuProduct,
  hasProductFieldRawValue,
  ListOrder,
  ListProductsRequest,
  ListSort,
  ProductFieldKey,
  productFieldRawValue,
  ProductRankKey,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
  ViewCpuContentData,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import { Database } from '../../database';
import { ProductService } from '../../product/product.service';
import { CacheService, CacheType } from '../../shared/cache/cache.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class ViewCpuViewModelService {
  constructor(
    private db: Database,
    private productService: ProductService,
    private cacheService: CacheService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    console.time('ViewCpuViewModelService');
    const viewModel = await this.cacheService.cache(
      async () => {
        const cpu = await this.getCpu(slug, ctx);
        const additionalData = await this.getAdditionalData(cpu, ctx);

        const relatedCpus = await this.getRelatedCpus(
          3,
          additionalData.relativePerformanceCpus,
          additionalData.relativeValueCpus,
          cpu,
        );
        const relatedComparisons = await this.getRelatedComparisons(
          3,
          additionalData.relativePerformanceCpus,
          additionalData.relativeValueCpus,
          cpu,
        );

        return {
          cpu,
          additionalData: additionalData,
          relatedCpus,
          relatedCpuComparisons: relatedComparisons,
        } as ViewCpuViewModel;
      },
      { type: CacheType.CpuProduct, key: `viewModel__${slug}` },
    );
    console.timeEnd('ViewCpuViewModelService');

    return viewModel;
  }

  private async getCpu(slug: string, ctx: Context) {
    const cpu = await this.db.transaction(
      () =>
        this.productService.getBySlug(
          {
            productType: ProductType.Cpu,
            slug,

            includeParent: false,
            includeChildren: false,
            includeAutomation: false,
            includeBenchmarks: true,
            includeImages: true,
            includeSources: false,
            includeUpdates: false,

            includeRanks: [
              'performanceRating',
              'performanceRatingForMarketSegment',
              'performancePerMsrp',
              'performancePerMsrpForMarketSegment',
            ] as ProductRankKey[],
          },
          ctx,
        ),
      { ctx, isolationLevel: 'ReadCommitted' },
    );
    return cpu as CpuProduct;
  }

  private async getAdditionalData(cpu: CpuProduct, ctx: Context) {
    const relativePerformanceCpus = await this.getRelativePerformanceCpus(
      cpu,
      ctx,
    );
    const relativeValueCpus = await this.getRelativeValueCpus(cpu, ctx);

    const { totalPerformanceCpus, bestPerformanceCpu, bestValueCpu } =
      await this.getCpuStats(ctx);

    return {
      totalPerformanceCpus: totalPerformanceCpus || [],
      relativePerformanceCpus: relativePerformanceCpus || [],
      relativeValueCpus: relativeValueCpus || [],
      bestPerformanceCpu,
      bestValueCpu,
    } as ViewCpuContentData;
  }

  private async getRelativePerformanceCpus(seed: CpuProduct, ctx: Context) {
    // Missing performance. Cannot have neighbors.
    if (!hasProductFieldRawValue(seed.fields?.performanceRating)) {
      return [];
    }

    const segment = productFieldRawValue(seed.fields?.marketSegment) || null;
    const performanceScore = productFieldRawValue(
      seed.fields.performanceRating,
    );

    // Get ids for relative cpus with a higher rating
    const aboveRequest: ListProductsRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: {
          segment: segment ? [segment] : [],
          performanceRated: true,
          minPerformanceScore: performanceScore,
        },
        pagination: {
          limit: TOTAL_COMPARED_CPUS,
        },
        orderBy: {
          order: ListOrder.Asc,
          sort: ListSort.PerformanceRating,
        },
      },
    };
    const aboveOptions = {
      fields: [] as ProductFieldKey[],
      skipCount: true,
    };
    const aboveResponse = await this.productService.list(
      aboveRequest,
      aboveOptions,
      ctx,
    );

    // Get ids for relative cpus with a lower rating
    const belowRequest: ListProductsRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: {
          segment: segment ? [segment] : [],
          performanceRated: true,
          maxPerformanceScore: performanceScore,
        },
        pagination: {
          limit: TOTAL_COMPARED_CPUS,
        },
        orderBy: {
          order: ListOrder.Desc,
          sort: ListSort.PerformanceRating,
        },
      },
    };
    const belowOptions = {
      fields: [] as ProductFieldKey[],
      skipCount: true,
    };
    const belowResponse = await this.productService.list(
      belowRequest,
      belowOptions,
      ctx,
    );

    // Fetch relative cpus by id
    const relativeIds = [
      ...aboveResponse.results,
      ...belowResponse.results,
    ].map((result) => result.id);
    const relativeResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: { filter: { ids: relativeIds, excludeIds: [seed.id] } },
      },
      { fields: ['performanceRating'], skipCount: true },
      ctx,
    );

    // Sort related cpus by performance
    const cpus = [...relativeResponse.results, seed]
      .filter(
        (cpu) => productFieldRawValue(cpu.fields?.performanceRating) != null,
      )
      .sort(
        (g1, g2) =>
          productFieldRawValue(g1.fields?.performanceRating) -
          productFieldRawValue(g2.fields?.performanceRating),
      ) as CpuProduct[];

    // Build list of surrounding cpus
    const cpuIdx = binarySearch(
      cpus,
      seed,
      (c1, c2) =>
        productFieldRawValue(c1.fields?.performanceRating) -
        productFieldRawValue(c2.fields?.performanceRating),
    );
    const neighbors = getSurroundingValues(cpus, cpuIdx, TOTAL_COMPARED_CPUS);

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    ).sort(
      (c1, c2) =>
        productFieldRawValue(c2.fields?.performanceRating) -
        productFieldRawValue(c1.fields?.performanceRating),
    );
  }

  private async getRelativeValueCpus(seed: CpuProduct, ctx: Context) {
    // Missing performance. Cannot have neighbors.
    if (!hasProductFieldRawValue(seed.fields?.performancePerMsrp)) {
      return [];
    }

    const segment = productFieldRawValue(seed.fields?.marketSegment) || null;
    const performancePerMsrp = productFieldRawValue(
      seed.fields.performancePerMsrp,
    );

    // Get ids for relative cpus with a higher rating
    const aboveRequest: ListProductsRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: {
          segment: segment ? [segment] : [],
          valueRated: true,
          minValueScore: performancePerMsrp,
        },
        pagination: {
          limit: TOTAL_COMPARED_CPUS,
        },
        orderBy: {
          order: ListOrder.Asc,
          sort: ListSort.PerformancePerMsrp,
        },
      },
    };
    const aboveOptions = {
      fields: [] as ProductFieldKey[],
      skipCount: true,
    };
    const aboveResponse = await this.productService.list(
      aboveRequest,
      aboveOptions,
      ctx,
    );

    // Get ids for relative cpus with a lower rating
    const belowRequest: ListProductsRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: {
          segment: segment ? [segment] : [],
          valueRated: true,
          maxValueScore: performancePerMsrp,
        },
        pagination: {
          limit: TOTAL_COMPARED_CPUS,
        },
        orderBy: {
          order: ListOrder.Desc,
          sort: ListSort.PerformancePerMsrp,
        },
      },
    };
    const belowOptions = {
      fields: [] as ProductFieldKey[],
      skipCount: true,
    };
    const belowResponse = await this.productService.list(
      belowRequest,
      belowOptions,
      ctx,
    );

    // Fetch relative cpus by id
    const relativeIds = [
      ...aboveResponse.results,
      ...belowResponse.results,
    ].map((result) => result.id);
    const relativeResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: {
          filter: { ids: relativeIds, excludeIds: [seed.id] },
        },
      },
      { fields: ['performancePerMsrp'], skipCount: true },
      ctx,
    );

    // Sort relative cpus by value
    const cpus = [...relativeResponse.results, seed]
      .filter(
        (cpu) => productFieldRawValue(cpu.fields?.performancePerMsrp) != null,
      )
      .sort(
        (c1, c2) =>
          productFieldRawValue(c1.fields?.performancePerMsrp) -
          productFieldRawValue(c2.fields?.performancePerMsrp),
      ) as CpuProduct[];

    // Build list of surrounding cpus
    const cpuIdx = binarySearch(
      cpus,
      seed,
      (c1, c2) =>
        productFieldRawValue(c1.fields?.performancePerMsrp) -
        productFieldRawValue(c2.fields?.performancePerMsrp),
    );
    const neighbors = getSurroundingValues(cpus, cpuIdx, TOTAL_COMPARED_CPUS);

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    ).sort(
      (c1, c2) =>
        productFieldRawValue(c2.fields?.performancePerMsrp) -
        productFieldRawValue(c1.fields?.performancePerMsrp),
    );
  }

  private async getRelatedCpus(
    total: number,
    performanceCpus: CpuProduct[],
    valueCpus: CpuProduct[],
    excludeCpu: CpuProduct,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, CpuProduct>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(excludeCpu.id);

    const related: CpuProduct[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    return { products: related } as RelatedProducts;
  }

  private async getRelatedComparisons(
    total: number,
    performanceCpus: CpuProduct[],
    valueCpus: CpuProduct[],
    pageCpu: CpuProduct,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, CpuProduct>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(pageCpu.id);

    const related: CpuProduct[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedCpu) => [pageCpu, relatedCpu]);

    return { comparisons } as RelatedProductComparisons;
  }

  private async getCpuStats(ctx: Context) {
    // cache all of the following
    const countRequest = {
      productType: ProductType.Cpu,
      query: { filter: { performanceRated: true } },
    };
    const totalPerformanceCpus = await this.db.transaction(
      () => this.productService.count(countRequest, ctx),
      { ctx, isolationLevel: 'ReadCommitted' },
    );

    // TODO: convert to find instead of list
    const bestPerformanceCpu = await this.db.transaction(
      async () => {
        const response = await this.productService.list(
          {
            productType: ProductType.Cpu,
            query: {
              filter: { performanceRated: true },
              orderBy: {
                sort: ListSort.PerformanceRating,
                order: ListOrder.Desc,
              },
              pagination: { limit: 1 },
            },
          },
          { skipCount: true },
          ctx,
        );
        return response.results?.[0] || null;
      },
      { ctx, isolationLevel: 'ReadCommitted' },
    );

    // TODO: convert to find instead of list
    const bestValueCpu = await this.db.transaction(
      async () => {
        const response = await this.productService.list(
          {
            productType: ProductType.Cpu,
            query: {
              filter: { valueRated: true },
              orderBy: {
                sort: ListSort.PerformancePerMsrp,
                order: ListOrder.Desc,
              },
              pagination: { limit: 1 },
            },
          },
          { skipCount: true },
          ctx,
        );
        return response.results?.[0] || null;
      },
      { ctx, isolationLevel: 'ReadCommitted' },
    );

    return {
      totalPerformanceCpus,
      bestPerformanceCpu,
      bestValueCpu,
    };
  }
}
