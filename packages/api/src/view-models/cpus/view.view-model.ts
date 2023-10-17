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
    console.time('ViewCpuViewModelService.getCpu');
    const cpu = await this.getCpu(slug, ctx);
    console.timeEnd('ViewCpuViewModelService.getCpu');
    console.time('ViewCpuViewModelService.getAdditionalData');
    const additionalData = await this.getAdditionalData(cpu, ctx);
    console.timeEnd('ViewCpuViewModelService.getAdditionalData');

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
    console.timeEnd('ViewCpuViewModelService');

    return {
      cpu,
      additionalData: additionalData,
      relatedCpus,
      relatedCpuComparisons: relatedComparisons,
    } as ViewCpuViewModel;
  }

  private async getCpu(slug: string, ctx: Context) {
    const getRequest = {
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
    };
    const cacheKey = getRequest;
    const cpu = await this.cacheService.cache(
      () =>
        this.db.transaction(
          () => this.productService.getBySlug(getRequest, ctx),
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.CpuComparison, key: cacheKey },
    );
    return cpu as CpuProduct;
  }

  private async getAdditionalData(cpu: CpuProduct, ctx: Context) {
    const [performanceCpus, valueCpus] = await this.getAllRelativeCpus(
      cpu,
      ctx,
    );

    const relativePerformanceCpus = await this.getRelativePerformanceCpus(
      cpu,
      performanceCpus,
    );
    const relativeValueCpus = await this.getRelativeValueCpus(cpu, valueCpus);

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

  private async getAllRelativeCpus(cpu: CpuProduct, ctx: Context) {
    // Missing performance. Cannot have neighbors.
    if (!hasProductFieldRawValue(cpu.fields?.performanceRating)) {
      return [[], []];
    }

    const segment = productFieldRawValue(cpu.fields?.marketSegment) || null;

    const listRequest: ListProductsRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: {
          isChipset: true,
          segment: segment ? [segment] : [],
          performanceRated: true,
        },
      },
    };
    const listOptions = {
      fields: ['performanceRating', 'performancePerMsrp'] as ProductFieldKey[],
      skipCount: true,
    };

    const cacheKey = { ...listRequest, ...listOptions };
    const response = await this.cacheService.cache(
      () =>
        this.db.transaction(
          () => this.productService.list(listRequest, listOptions, ctx),
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.CpusList, key: cacheKey },
    );
    const cpus = response.results as CpuProduct[];

    const performance = cpus
      .filter(
        (cpu) => productFieldRawValue(cpu.fields?.performanceRating) != null,
      )
      .sort(
        (c1, c2) =>
          productFieldRawValue(c1.fields?.performanceRating) -
          productFieldRawValue(c2.fields?.performanceRating),
      );

    const value = cpus
      .filter(
        (cpu) => productFieldRawValue(cpu.fields?.performancePerMsrp) != null,
      )
      .sort(
        (c1, c2) =>
          productFieldRawValue(c1.fields?.performancePerMsrp) -
          productFieldRawValue(c2.fields?.performancePerMsrp),
      );

    return [performance, value];
  }

  private async getRelativePerformanceCpus(
    seed: CpuProduct,
    sortedCpus: CpuProduct[],
  ) {
    if (!hasProductFieldRawValue(seed.fields?.performanceRating)) {
      return [];
    }
    const cpu1Idx = binarySearch(
      sortedCpus,
      seed,
      (g1, g2) =>
        productFieldRawValue(g1.fields?.performanceRating) -
        productFieldRawValue(g2.fields?.performanceRating),
    );
    const neighbors = getSurroundingValues(
      sortedCpus,
      cpu1Idx,
      TOTAL_COMPARED_CPUS,
    );

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

  private async getRelativeValueCpus(
    seed: CpuProduct,
    sortedCpus: CpuProduct[],
  ) {
    if (!hasProductFieldRawValue(seed.fields?.performancePerMsrp)) {
      return [];
    }

    const cpu1Idx = binarySearch(
      sortedCpus,
      seed,
      (c1, c2) =>
        productFieldRawValue(c1.fields?.performancePerMsrp) -
        productFieldRawValue(c2.fields?.performancePerMsrp),
    );
    const neighbors = getSurroundingValues(
      sortedCpus,
      cpu1Idx,
      TOTAL_COMPARED_CPUS,
    );

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
    const totalPerformanceCpus = await this.cacheService.cache(
      () =>
        this.db.transaction(
          () => this.productService.count(countRequest, ctx),
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.CpuStats, key: countRequest },
    );

    const bestInPerformanceRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: { performanceRated: true },
        orderBy: { sort: ListSort.PerformanceRating, order: ListOrder.Desc },
        pagination: { limit: 1 },
      },
    };
    // TODO: convert to find instead of list
    const bestPerformanceCpu = await this.cacheService.cache(
      () =>
        this.db.transaction(
          async () => {
            const response = await this.productService.list(
              bestInPerformanceRequest,
              {},
              ctx,
            );
            return response.results?.[0] || null;
          },
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.CpuStats, key: bestInPerformanceRequest },
    );

    const bestInValueRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: { valueRated: true },
        orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
        pagination: { limit: 1 },
      },
    };
    // TODO: convert to find instead of list
    const bestValueCpu = await this.cacheService.cache(
      () =>
        this.db.transaction(
          async () => {
            const response = await this.productService.list(
              bestInValueRequest,
              {},
              ctx,
            );
            return response.results?.[0] || null;
          },
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.CpuStats, key: bestInValueRequest },
    );

    return {
      totalPerformanceCpus,
      bestPerformanceCpu,
      bestValueCpu,
    };
  }
}
