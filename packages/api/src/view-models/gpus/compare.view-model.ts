import { Injectable } from '@nestjs/common';
import {
  binarySearch,
  CompareGpusAdditionalData,
  CompareGpusViewModel,
  getGpuChipset,
  GpuProduct,
  GpuProductComparison,
  hasProductFieldRawValue,
  ListProductsRequest,
  ListSort,
  ProductFieldKey,
  productFieldRawValue,
  ProductRankKey,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
} from '@pcpartdb/shared';
import { Database } from '../../database';
import { ProductService } from '../../product/product.service';
import { CacheService, CacheType } from '../../shared/cache/cache.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_GPUS = 10;

@Injectable()
export class CompareGpusViewModelService {
  constructor(
    private db: Database,
    private productService: ProductService,
    private cacheService: CacheService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    console.time('CompareGpusViewModelService');

    console.time('CompareGpusViewModelService.getComparison');
    const comparison = await this.getComparison(slug, ctx);
    console.timeEnd('CompareGpusViewModelService.getComparison');
    console.time('CompareGpusViewModelService.getAdditionalData');
    const additionalData = await this.getAdditionalData(comparison, ctx);
    console.timeEnd('CompareGpusViewModelService.getAdditionalData');

    const relatedGpus = await this.getRelatedGpus(
      3,
      additionalData.relativePerformanceGpus,
      additionalData.relativeValueGpus,
      comparison,
    );
    const relatedComparisons = await this.getRelatedComparisons(
      3,
      additionalData.relativePerformanceGpus,
      additionalData.relativeValueGpus,
      comparison,
    );

    console.timeEnd('CompareGpusViewModelService');

    return {
      comparison,
      additionalData: additionalData,
      relatedGpus,
      relatedComparisons,
    } as CompareGpusViewModel;
  }

  private async getComparison(slug: string, ctx: Context) {
    const comparisonRequest = {
      productType: ProductType.Gpu,
      slug,

      includeParent: true,
      includeChildren: false,
      includeBenchmarks: true,
      includeImages: true,

      includeAutomation: false,
      includeSources: false,
      includeUpdates: false,

      includeRanks: [
        'performanceRating',
        'performancePerMsrp',
      ] as ProductRankKey[],
    };
    const cacheKey = comparisonRequest;
    const comparison = await this.cacheService.cache(
      () =>
        this.db.transaction(
          () => this.productService.getComparison(comparisonRequest, ctx),
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.GpuComparison, key: cacheKey },
    );
    return comparison as GpuProductComparison;
  }

  private async getAdditionalData(
    comparison: GpuProductComparison,
    ctx: Context,
  ) {
    const chipset1 = getGpuChipset(comparison[0]);
    const chipset2 = getGpuChipset(comparison[1]);

    const retailModels1 = await this.getRetailModels(chipset1, ctx);
    const retailModels2 = await this.getRetailModels(chipset2, ctx);

    const [performanceGpus, valueGpus] = await this.getAllRelativeGpus(
      chipset1,
      chipset2,
      ctx,
    );

    const relativePerformanceGpus = this.getRelativePerformanceGpus(
      chipset1,
      chipset2,
      performanceGpus,
    );

    const relativeValueGpus = this.getRelativeValueGpus(
      chipset1,
      chipset2,
      valueGpus,
    );

    return {
      relativePerformanceGpus,
      relativeValueGpus,
      retailModels1,
      retailModels2,
    } as CompareGpusAdditionalData;
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

  private async getAllRelativeGpus(
    gpu1: GpuProduct,
    gpu2: GpuProduct,
    ctx: Context,
  ) {
    // Missing performance. Cannot have neighbors.
    if (
      !hasProductFieldRawValue(gpu1.fields?.performanceRating) &&
      !hasProductFieldRawValue(gpu2.fields?.performanceRating)
    ) {
      return [[], []];
    }

    const segment = [
      productFieldRawValue(gpu1.fields?.marketSegment),
      productFieldRawValue(gpu2.fields?.marketSegment),
    ]
      .filter((value) => value != null)
      .sort();

    const listRequest: ListProductsRequest = {
      productType: ProductType.Gpu,
      query: {
        filter: {
          isChipset: true,
          segment,
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
    gpu1: GpuProduct,
    gpu2: GpuProduct,
    sortedGpus: GpuProduct[],
  ) {
    const chipset1 = getGpuChipset(gpu1);
    const chipset2 = getGpuChipset(gpu2);

    const gpu1Idx = binarySearch(
      sortedGpus,
      chipset1,
      (g1, g2) =>
        productFieldRawValue(g1.fields?.performanceRating) -
        productFieldRawValue(g2.fields?.performanceRating),
    );
    const neighbors1 = getSurroundingValues(
      sortedGpus,
      gpu1Idx,
      TOTAL_COMPARED_GPUS,
    );

    const gpu2Idx = binarySearch(
      sortedGpus,
      chipset2,
      (g1, g2) =>
        productFieldRawValue(g1.fields?.performanceRating) -
        productFieldRawValue(g2.fields?.performanceRating),
    );
    const neighbors2 = getSurroundingValues(
      sortedGpus,
      gpu2Idx,
      TOTAL_COMPARED_GPUS,
    );

    // At least one GPU has no neighbors (missing rank)
    if (neighbors1.length === 0 && neighbors2.length === 0) {
      return [];
    }
    if (neighbors1.length === 0 || neighbors2.length === 0) {
      const neighbors = [...neighbors1, ...neighbors2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex(
          (gpu) => gpu.id === chipset1.id || gpu.id === chipset2.id,
        ),
        TOTAL_COMPARED_GPUS,
      );
    }

    // Both GPUS have neighbors
    const hasNoGap =
      neighbors1.find((p) => p.id === chipset2.id) ||
      neighbors2.find((p) => p.id === chipset1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [chipset1, chipset2],
        neighbors1,
        neighbors2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performanceRating) -
          productFieldRawValue(g1.fields?.performanceRating),
      );
    } else {
      return this.concatNeighbors(
        [chipset1, chipset2],
        neighbors1,
        neighbors2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performanceRating) -
          productFieldRawValue(g1.fields?.performanceRating),
      );
    }
  }

  private getRelativeValueGpus(
    gpu1: GpuProduct,
    gpu2: GpuProduct,
    sortedGpus: GpuProduct[],
  ) {
    const chipset1 = getGpuChipset(gpu1);
    const chipset2 = getGpuChipset(gpu2);

    const gpu1Idx = binarySearch(
      sortedGpus,
      chipset1,
      (g1, g2) =>
        productFieldRawValue(g1.fields?.performancePerMsrp) -
        productFieldRawValue(g2.fields?.performancePerMsrp),
    );
    const neighbors1 = getSurroundingValues(
      sortedGpus,
      gpu1Idx,
      TOTAL_COMPARED_GPUS,
    );

    const gpu2Idx = binarySearch(
      sortedGpus,
      chipset2,
      (g1, g2) =>
        productFieldRawValue(g1.fields?.performancePerMsrp) -
        productFieldRawValue(g2.fields?.performancePerMsrp),
    );
    const neighbors2 = getSurroundingValues(
      sortedGpus,
      gpu2Idx,
      TOTAL_COMPARED_GPUS,
    );

    // At least one GPU has no neighbors (missing rank)
    if (neighbors1.length === 0 && neighbors2.length === 0) {
      return [];
    }
    if (neighbors1.length === 0 || neighbors2.length === 0) {
      const neighbors = [...neighbors1, ...neighbors2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex(
          (gpu) => gpu.id === chipset1.id || gpu.id === chipset2.id,
        ),
        TOTAL_COMPARED_GPUS,
      );
    }

    // Both GPUs have neighbors. Need to combine them.
    const hasNoGap =
      neighbors1.find((p) => p.id === chipset2.id) ||
      neighbors2.find((p) => p.id === chipset1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [chipset1, chipset2],
        neighbors1,
        neighbors2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performancePerMsrp) -
          productFieldRawValue(g1.fields?.performancePerMsrp),
      );
    } else {
      return this.concatNeighbors(
        [chipset1, chipset2],
        neighbors1,
        neighbors2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performancePerMsrp) -
          productFieldRawValue(g1.fields?.performancePerMsrp),
      );
    }
  }

  private concatNeighbors(
    comparison: GpuProductComparison,
    neighbors1: GpuProduct[],
    neighbors2: GpuProduct[],
    compareFn: (gpu1: GpuProduct, gpu2: GpuProduct) => number,
  ) {
    const [gpu1, gpu2] = comparison;

    // Get the nearest neighbors for both GPUs
    const surrounding1 = getSurroundingValues(
      neighbors1,
      neighbors1.findIndex((gpu) => gpu.id === gpu1.id),
      TOTAL_COMPARED_GPUS / 2,
    );
    const surrounding2 = getSurroundingValues(
      neighbors2,
      neighbors2.findIndex((gpu) => gpu.id === gpu2.id),
      TOTAL_COMPARED_GPUS / 2,
    );

    // Combine them and sort.
    const set = [...surrounding1, ...surrounding2].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, GpuProduct>);
    return Object.values(set).sort(compareFn);
  }

  private mergeNeighbors(
    comparison: GpuProductComparison,
    neighbors1: GpuProduct[],
    neighbors2: GpuProduct[],
    compareFn: (gpu1: GpuProduct, gpu2: GpuProduct) => number,
  ) {
    const [gpu1, gpu2] = comparison;

    // Get the nearest neighbors for both GPUs
    const surrounding1 = getSurroundingValues(
      neighbors1,
      neighbors1.findIndex((gpu) => gpu.id === gpu1.id),
      TOTAL_COMPARED_GPUS,
    );
    const surrounding2 = getSurroundingValues(
      neighbors2,
      neighbors2.findIndex((gpu) => gpu.id === gpu2.id),
      TOTAL_COMPARED_GPUS,
    );

    // Combine the nearest neighbors. Factor in that they may overlap.
    const set = [...surrounding1, ...surrounding2].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, GpuProduct>);
    const merged = Object.values(set).sort(compareFn);

    // Find the middle point between the two GPUs that are being compared.
    const idx1 = merged.findIndex((gpu) => gpu.id === gpu1.id);
    const idx2 = merged.findIndex((gpu) => gpu.id === gpu2.id);
    const pivot = Math.ceil((idx1 + idx2) / 2);

    // Find the GPUs surrounding the middle point.
    return getSurroundingValues(merged, pivot, TOTAL_COMPARED_GPUS);
  }

  private async getRelatedGpus(
    total: number,
    performanceGpus: GpuProduct[],
    valueGpus: GpuProduct[],
    excludeGpus: GpuProduct[],
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, GpuProduct>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    excludeGpus.forEach((gpu) => set.delete(gpu.id));

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
    pageComparison: GpuProductComparison,
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, GpuProduct>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    pageComparison.forEach((gpu) => set.delete(gpu.id));

    const related: GpuProduct[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedGpu, i) => [
      pageComparison[i % 2],
      relatedGpu,
    ]);

    return { comparisons } as RelatedProductComparisons;
  }
}
