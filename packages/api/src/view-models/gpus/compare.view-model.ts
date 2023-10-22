import { Injectable } from '@nestjs/common';
import {
  binarySearch,
  CompareGpusAdditionalData,
  CompareGpusViewModel,
  getGpuChipset,
  GpuProduct,
  GpuProductComparison,
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
    const viewModel = await this.cacheService.cache(
      async () => {
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

        return {
          comparison,
          additionalData: additionalData,
          relatedGpus,
          relatedComparisons,
        } as CompareGpusViewModel;
      },
      { type: CacheType.GpuComparison, key: `viewModel__${slug}` },
    );
    console.timeEnd('CompareGpusViewModelService');

    return viewModel;
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
    const comparison = await this.db.transaction(
      () => this.productService.getComparison(comparisonRequest, ctx),
      { ctx, isolationLevel: 'ReadCommitted' },
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

    const relativePerformanceGpus = await this.getRelativePerformanceGpus(
      chipset1,
      chipset2,
      ctx,
    );

    const relativeValueGpus = await this.getRelativeValueGpus(
      chipset1,
      chipset2,
      ctx,
    );
    return {
      relativePerformanceGpus,
      relativeValueGpus,
      retailModels1,
      retailModels2,
    } as CompareGpusAdditionalData;
  }

  private async getRetailModels(chipset: GpuProduct, ctx: Context) {
    const response = await this.db.transaction(
      () =>
        this.productService.list(
          {
            productType: ProductType.Gpu,
            query: {
              filter: { chipsetId: [chipset.id] },
              orderBy: { sort: ListSort.Name },
            },
          },
          {
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
          },
          ctx,
        ),
      { ctx, isolationLevel: 'ReadCommitted' },
    );
    return response.results;
  }

  private async getRelativePerformanceGpus(
    seed1: GpuProduct,
    seed2: GpuProduct,
    ctx: Context,
  ) {
    const relative1 = await this.fetchRelativePerformanceGpus(seed1, ctx);
    const relative2 = await this.fetchRelativePerformanceGpus(seed2, ctx);

    const gpu1Idx = binarySearch(
      relative1,
      seed1,
      (g1, g2) =>
        productFieldRawValue(g2.fields?.performanceRating) -
        productFieldRawValue(g1.fields?.performanceRating),
    );
    const neighbors1 = getSurroundingValues(
      relative1,
      gpu1Idx,
      TOTAL_COMPARED_GPUS,
    );

    const gpu2Idx = binarySearch(
      relative2,
      seed2,
      (g1, g2) =>
        productFieldRawValue(g2.fields?.performanceRating) -
        productFieldRawValue(g1.fields?.performanceRating),
    );
    const neighbors2 = getSurroundingValues(
      relative2,
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
          (gpu) => gpu.id === seed1.id || gpu.id === seed2.id,
        ),
        TOTAL_COMPARED_GPUS,
      );
    }

    // Both GPUS have neighbors
    const hasNoGap =
      neighbors1.find((p) => p.id === seed2.id) ||
      neighbors2.find((p) => p.id === seed1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [seed1, seed2],
        neighbors1,
        neighbors2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performanceRating) -
          productFieldRawValue(g1.fields?.performanceRating),
      );
    } else {
      return this.concatNeighbors(
        [seed1, seed2],
        neighbors1,
        neighbors2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performanceRating) -
          productFieldRawValue(g1.fields?.performanceRating),
      );
    }
  }

  private async getRelativeValueGpus(
    seed1: GpuProduct,
    seed2: GpuProduct,
    ctx: Context,
  ) {
    const relative1 = await this.fetchRelativeValueGpus(seed1, ctx);
    const relative2 = await this.fetchRelativeValueGpus(seed2, ctx);

    const gpu1Idx = binarySearch(
      relative1,
      seed1,
      (g1, g2) =>
        productFieldRawValue(g2.fields?.performancePerMsrp) -
        productFieldRawValue(g1.fields?.performancePerMsrp),
    );
    const neighbors1 = getSurroundingValues(
      relative1,
      gpu1Idx,
      TOTAL_COMPARED_GPUS,
    );

    const gpu2Idx = binarySearch(
      relative2,
      seed2,
      (g1, g2) =>
        productFieldRawValue(g2.fields?.performancePerMsrp) -
        productFieldRawValue(g1.fields?.performancePerMsrp),
    );
    const neighbors2 = getSurroundingValues(
      relative2,
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
          (gpu) => gpu.id === seed1.id || gpu.id === seed2.id,
        ),
        TOTAL_COMPARED_GPUS,
      );
    }

    // Both GPUS have neighbors
    const hasNoGap =
      neighbors1.find((p) => p.id === seed2.id) ||
      neighbors2.find((p) => p.id === seed1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [seed1, seed2],
        neighbors1,
        neighbors2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performancePerMsrp) -
          productFieldRawValue(g1.fields?.performancePerMsrp),
      );
    } else {
      return this.concatNeighbors(
        [seed1, seed2],
        neighbors1,
        neighbors2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performancePerMsrp) -
          productFieldRawValue(g1.fields?.performancePerMsrp),
      );
    }
  }

  private async fetchRelativePerformanceGpus(seed: GpuProduct, ctx: Context) {
    // Missing performance. Cannot have neighbors.
    if (!hasProductFieldRawValue(seed.fields?.performanceRating)) {
      return [];
    }

    const segment = productFieldRawValue(seed.fields?.marketSegment) || null;
    const performanceScore = productFieldRawValue(
      seed.fields.performanceRating,
    );

    // Get ids for relative gpus with a higher rating
    const aboveRequest: ListProductsRequest = {
      productType: ProductType.Gpu,
      query: {
        filter: {
          isChipset: true,
          segment: segment ? [segment] : [],
          performanceRated: true,
          minPerformanceScore: performanceScore,
        },
        pagination: {
          limit: TOTAL_COMPARED_GPUS,
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

    // Get ids for relative gpus with a lower rating
    const belowRequest: ListProductsRequest = {
      productType: ProductType.Gpu,
      query: {
        filter: {
          isChipset: true,
          segment: segment ? [segment] : [],
          performanceRated: true,
          maxPerformanceScore: performanceScore,
        },
        pagination: {
          limit: TOTAL_COMPARED_GPUS,
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

    // Fetch relative gpus by id
    const relativeIds = [
      ...aboveResponse.results,
      ...belowResponse.results,
    ].map((result) => result.id);
    const relativeResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            ids: relativeIds,
            excludeIds: [seed.id],
          },
        },
      },
      { fields: ['performanceRating'], skipCount: true },
      ctx,
    );

    // Sort related gpus by performance
    const gpus = [...relativeResponse.results, seed]
      .filter(
        (gpu) => productFieldRawValue(gpu.fields?.performanceRating) != null,
      )
      .sort(
        (g1, g2) =>
          productFieldRawValue(g1.fields?.performanceRating) -
          productFieldRawValue(g2.fields?.performanceRating),
      ) as GpuProduct[];

    // Build list of surrounding GPUs
    const gpuIdx = binarySearch(
      gpus,
      seed,
      (g1, g2) =>
        productFieldRawValue(g1.fields?.performanceRating) -
        productFieldRawValue(g2.fields?.performanceRating),
    );
    const neighbors = getSurroundingValues(gpus, gpuIdx, TOTAL_COMPARED_GPUS);

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

  private async fetchRelativeValueGpus(seed: GpuProduct, ctx: Context) {
    // Missing value. Cannot have neighbors.
    if (!hasProductFieldRawValue(seed.fields?.performancePerMsrp)) {
      return [];
    }

    const segment = productFieldRawValue(seed.fields?.marketSegment) || null;
    const valueScore = productFieldRawValue(seed.fields.performancePerMsrp);

    // Get ids for relative gpus with a higher rating
    const aboveRequest: ListProductsRequest = {
      productType: ProductType.Gpu,
      query: {
        filter: {
          isChipset: true,
          segment: segment ? [segment] : [],
          valueRated: true,
          minValueScore: valueScore,
        },
        pagination: {
          limit: TOTAL_COMPARED_GPUS,
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

    // Get ids for relative gpus with a lower rating
    const belowRequest: ListProductsRequest = {
      productType: ProductType.Gpu,
      query: {
        filter: {
          isChipset: true,
          segment: segment ? [segment] : [],
          valueRated: true,
          maxValueScore: valueScore,
        },
        pagination: {
          limit: TOTAL_COMPARED_GPUS,
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

    // Fetch relative gpus by id
    const relativeIds = [
      ...aboveResponse.results,
      ...belowResponse.results,
    ].map((result) => result.id);
    const relativeResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            ids: relativeIds,
            excludeIds: [seed.id],
          },
        },
      },
      { fields: ['performancePerMsrp'], skipCount: true },
      ctx,
    );

    // Sort related gpus by value
    const gpus = [...relativeResponse.results, seed]
      .filter(
        (gpu) => productFieldRawValue(gpu.fields?.performancePerMsrp) != null,
      )
      .sort(
        (g1, g2) =>
          productFieldRawValue(g1.fields?.performancePerMsrp) -
          productFieldRawValue(g2.fields?.performancePerMsrp),
      ) as GpuProduct[];

    // Build list of surrounding GPUs
    const gpu1Idx = binarySearch(
      gpus,
      seed,
      (g1, g2) =>
        productFieldRawValue(g1.fields?.performancePerMsrp) -
        productFieldRawValue(g2.fields?.performancePerMsrp),
    );
    const neighbors = getSurroundingValues(gpus, gpu1Idx, TOTAL_COMPARED_GPUS);

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
