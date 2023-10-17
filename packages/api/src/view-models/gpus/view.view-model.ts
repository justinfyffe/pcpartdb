import { Injectable } from '@nestjs/common';
import {
  binarySearch,
  getGpuChipset,
  GpuProduct,
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
  ViewGpuAdditionalData,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { Database } from '../../database';
import { ProductService } from '../../product/product.service';
import { CacheService, CacheType } from '../../shared/cache/cache.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_GPUS = 10;

@Injectable()
export class ViewGpuViewModelService {
  constructor(
    private db: Database,
    private productService: ProductService,
    private cacheService: CacheService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    console.time('ViewGpuViewModelService');
    console.time('ViewGpuViewModelService.getGpu');
    const gpu = await this.getGpu(slug, ctx);
    console.timeEnd('ViewGpuViewModelService.getGpu');
    console.time('ViewGpuViewModelService.getAdditionalData');
    const additionalData = await this.getAdditionalData(gpu, ctx);
    console.timeEnd('ViewGpuViewModelService.getAdditionalData');

    const relatedGpus = await this.getRelatedGpus(
      3,
      additionalData.relativePerformanceGpus,
      additionalData.relativeValueGpus,
      gpu,
    );
    const relatedGpuComparisons = await this.getRelatedComparisons(
      3,
      additionalData.relativePerformanceGpus,
      additionalData.relativeValueGpus,
      gpu,
    );
    console.timeEnd('ViewGpuViewModelService');

    return {
      gpu,
      relatedGpus,
      relatedGpuComparisons,
      additionalData,
    } as ViewGpuViewModel;
  }

  private async getGpu(slug: string, ctx: Context) {
    const getRequest = {
      productType: ProductType.Gpu,
      slug,

      includeParent: true,
      includeChildren: false,
      includeAutomation: false,
      includeBenchmarks: true,
      includeImages: true,
      includeSources: false,
      includeUpdates: false,

      parentFields: [
        'msrp',
        'performanceRating',
        'performancePerMsrp',
      ] as ProductFieldKey[],
      includeRanks: [
        'performanceRating',
        'performanceRatingForArchitectureAndMarketSegment',
        'performanceRatingForMarketSegment',
        'performancePerMsrp',
        'performancePerMsrpForMarketSegment',
      ] as ProductRankKey[],
    };
    const cacheKey = getRequest;
    const gpu = await this.cacheService.cache(
      () =>
        this.db.transaction(
          () => this.productService.getBySlug(getRequest, ctx),
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.GpuComparison, key: cacheKey },
    );
    return gpu as GpuProduct;
  }

  private async getAdditionalData(gpu: GpuProduct, ctx: Context) {
    const chipset = getGpuChipset(gpu);

    const [performanceGpus, valueGpus] = await this.getAllRelativeGpus(
      chipset,
      ctx,
    );
    const relativePerformanceGpus = this.getRelativePerformanceGpus(
      chipset,
      performanceGpus,
    );
    const relativeValueGpus = this.getRelativeValueGpus(chipset, valueGpus);

    const {
      totalPerformanceGpus,
      bestPerformanceSegmentGpu,
      bestValueSegmentGpu,
    } = await this.getGpuStats(gpu, ctx);

    const retailModels = await this.getRetailModels(chipset, ctx);

    return {
      totalPerformanceGpus,
      relativePerformanceGpus,
      relativeValueGpus,
      bestPerformanceGpuForSegment: bestPerformanceSegmentGpu,
      bestValueGpuForSegment: bestValueSegmentGpu,
      retailModels,
    } as ViewGpuAdditionalData;
  }

  private async getAllRelativeGpus(gpu: GpuProduct, ctx: Context) {
    // Missing performance. Cannot have neighbors.
    if (!hasProductFieldRawValue(gpu.fields?.performanceRating)) {
      return [[], []];
    }

    const segment = productFieldRawValue(gpu.fields?.marketSegment) || null;

    const listRequest: ListProductsRequest = {
      productType: ProductType.Gpu,
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
      { type: CacheType.GpusList, key: cacheKey },
    );
    const gpus = response.results as GpuProduct[];

    const performance = gpus
      .filter(
        (gpu) => productFieldRawValue(gpu.fields?.performanceRating) != null,
      )
      .sort(
        (g1, g2) =>
          productFieldRawValue(g1.fields?.performanceRating) -
          productFieldRawValue(g2.fields?.performanceRating),
      );

    const value = gpus
      .filter(
        (gpu) => productFieldRawValue(gpu.fields?.performancePerMsrp) != null,
      )
      .sort(
        (g1, g2) =>
          productFieldRawValue(g1.fields?.performancePerMsrp) -
          productFieldRawValue(g2.fields?.performancePerMsrp),
      );

    return [performance, value];
  }

  private getRelativePerformanceGpus(
    seed: GpuProduct,
    sortedGpus: GpuProduct[],
  ) {
    if (!hasProductFieldRawValue(seed.fields?.performanceRating)) {
      return [];
    }
    const gpu1Idx = binarySearch(
      sortedGpus,
      seed,
      (g1, g2) =>
        productFieldRawValue(g1.fields?.performanceRating) -
        productFieldRawValue(g2.fields?.performanceRating),
    );
    const neighbors = getSurroundingValues(
      sortedGpus,
      gpu1Idx,
      TOTAL_COMPARED_GPUS,
    );

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((gpu) => gpu.id === seed.id),
      TOTAL_COMPARED_GPUS,
    ).sort(
      (g1, g2) =>
        productFieldRawValue(g2.fields?.performanceRating) -
        productFieldRawValue(g1.fields?.performanceRating),
    );
  }

  private getRelativeValueGpus(seed: GpuProduct, sortedGpus: GpuProduct[]) {
    if (!hasProductFieldRawValue(seed.fields?.performancePerMsrp)) {
      return [];
    }

    const gpu1Idx = binarySearch(
      sortedGpus,
      seed,
      (g1, g2) =>
        productFieldRawValue(g1.fields?.performancePerMsrp) -
        productFieldRawValue(g2.fields?.performancePerMsrp),
    );
    const neighbors = getSurroundingValues(
      sortedGpus,
      gpu1Idx,
      TOTAL_COMPARED_GPUS,
    );

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((gpu) => gpu.id === seed.id),
      TOTAL_COMPARED_GPUS,
    ).sort(
      (g1, g2) =>
        productFieldRawValue(g2.fields?.performancePerMsrp) -
        productFieldRawValue(g1.fields?.performancePerMsrp),
    );
  }

  private async getRelatedGpus(
    total: number,
    performanceGpus: GpuProduct[],
    valueGpus: GpuProduct[],
    excludeGpu: GpuProduct,
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, GpuProduct>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(excludeGpu.id);

    const related: GpuProduct[] = [];
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
    performanceGpus: GpuProduct[],
    valueGpus: GpuProduct[],
    pageGpu: GpuProduct,
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, GpuProduct>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const pageChipset = pageGpu.parent || pageGpu;
    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(pageChipset.id);

    const related: GpuProduct[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedGpu) => [pageChipset, relatedGpu]);

    return { comparisons } as RelatedProductComparisons;
  }

  private async getRetailModels(gpu: GpuProduct, ctx: Context) {
    const chipset = getGpuChipset(gpu);

    const listRequest: ListProductsRequest = {
      productType: ProductType.Gpu,
      query: {
        filter: { chipsetId: [chipset.id] },
        orderBy: { sort: ListSort.Name },
      },
    };
    const listOptions = {
      fields: [
        'gpuCoreBaseClock',
        'gpuCoreBoostClock',
        'length',
        'slotWidth',
        'width',
        'height',
        'tdp',
      ] as ProductFieldKey[],
      skipCount: true,
    };
    const cacheKey = { ...listRequest, listOptions };
    const response = await this.cacheService.cache(
      () =>
        this.db.transaction(
          () => this.productService.list(listRequest, listOptions, ctx),
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.GpusList, key: cacheKey },
    );
    return response.results;
  }

  private async getGpuStats(gpu: GpuProduct, ctx: Context) {
    // cache all of the following
    const countRequest = {
      productType: ProductType.Gpu,
      query: { filter: { isChipset: true, performanceRated: true } },
    };
    const totalPerformanceGpus = await this.cacheService.cache(
      () =>
        this.db.transaction(
          () => this.productService.count(countRequest, ctx),
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.GpuStats, key: countRequest },
    );

    const segment = productFieldRawValue(gpu.fields?.marketSegment);

    const bestInPerformanceSegmentRequest = {
      productType: ProductType.Gpu,
      query: {
        filter: {
          isChipset: true,
          segment: segment != null ? [segment] : [],
          performanceRated: true,
        },
        orderBy: { sort: ListSort.PerformanceRating, order: ListOrder.Desc },
        pagination: { limit: 1 },
      },
    };
    // TODO: convert to find instead of list
    const bestPerformanceSegmentGpu = await this.cacheService.cache(
      () =>
        this.db.transaction(
          async () => {
            const response = await this.productService.list(
              bestInPerformanceSegmentRequest,
              {},
              ctx,
            );
            return response.results?.[0] || null;
          },
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.GpuStats, key: bestInPerformanceSegmentRequest },
    );

    const bestInValueSegmentRequest = {
      productType: ProductType.Gpu,
      query: {
        filter: {
          isChipset: true,
          segment: segment != null ? [segment] : [],
          valueRated: true,
        },
        orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
        pagination: { limit: 1 },
      },
    };
    // TODO: convert to find instead of list
    const bestValueSegmentGpu = await this.cacheService.cache(
      () =>
        this.db.transaction(
          async () => {
            const response = await this.productService.list(
              bestInValueSegmentRequest,
              {},
              ctx,
            );
            return response.results?.[0] || null;
          },
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.GpuStats, key: bestInValueSegmentRequest },
    );

    return {
      totalPerformanceGpus,
      bestPerformanceSegmentGpu,
      bestValueSegmentGpu,
    };
  }
}
