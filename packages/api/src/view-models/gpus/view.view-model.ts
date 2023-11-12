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
    const viewModel = await this.cacheService.cache(
      async () => {
        const gpu = await this.getGpu(slug, ctx);
        const additionalData = await this.getAdditionalData(gpu, ctx);

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

        return {
          gpu,
          relatedGpus,
          relatedGpuComparisons,
          additionalData,
        } as ViewGpuViewModel;
      },
      { type: CacheType.GpuProduct, key: `viewModel__${slug}` },
    );
    console.timeEnd('ViewGpuViewModelService');

    return viewModel;
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

    const gpu = await this.db.transaction(
      () => this.productService.getBySlug(getRequest, ctx),
      { ctx, isolationLevel: 'ReadCommitted' },
    );
    return gpu as GpuProduct;
  }

  private async getAdditionalData(gpu: GpuProduct, ctx: Context) {
    const chipset = getGpuChipset(gpu);

    const relativePerformanceGpus = await this.getRelativePerformanceGpus(
      chipset,
      ctx,
    );
    const relativeValueGpus = await this.getRelativeValueGpus(chipset, ctx);

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

  private async getRelativePerformanceGpus(seed: GpuProduct, ctx: Context) {
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
    const gpu1Idx = binarySearch(
      gpus,
      seed,
      (g1, g2) =>
        productFieldRawValue(g1.fields?.performanceRating) -
        productFieldRawValue(g2.fields?.performanceRating),
    );
    const neighbors = getSurroundingValues(gpus, gpu1Idx, TOTAL_COMPARED_GPUS);

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

  private async getRelativeValueGpus(seed: GpuProduct, ctx: Context) {
    // Missing performance. Cannot have neighbors.
    if (!hasProductFieldRawValue(seed.fields?.performancePerMsrp)) {
      return [];
    }

    const segment = productFieldRawValue(seed.fields?.marketSegment) || null;
    const performancePerMsrp = productFieldRawValue(
      seed.fields.performancePerMsrp,
    );

    // Get ids for relative gpus with a higher rating
    const aboveRequest: ListProductsRequest = {
      productType: ProductType.Gpu,
      query: {
        filter: {
          isChipset: true,
          segment: segment ? [segment] : [],
          valueRated: true,
          minValueScore: performancePerMsrp,
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
          maxValueScore: performancePerMsrp,
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

    // Sort relative gpus by value
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

  private async getGpuStats(gpu: GpuProduct, ctx: Context) {
    // cache all of the following
    const countRequest = {
      productType: ProductType.Gpu,
      query: { filter: { isChipset: true, performanceRated: true } },
    };
    const totalPerformanceGpus = await this.db.transaction(
      () => this.productService.count(countRequest, ctx),
      { ctx, isolationLevel: 'ReadCommitted' },
    );

    const segment = productFieldRawValue(gpu.fields?.marketSegment);

    // TODO: convert to find instead of list
    const bestPerformanceSegmentGpu = await this.db.transaction(
      async () => {
        const response = await this.productService.list(
          {
            productType: ProductType.Gpu,
            query: {
              filter: {
                isChipset: true,
                segment: segment != null ? [segment] : [],
                performanceRated: true,
              },
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
    const bestValueSegmentGpu = await this.db.transaction(
      async () => {
        const response = await this.productService.list(
          {
            productType: ProductType.Gpu,
            query: {
              filter: {
                isChipset: true,
                segment: segment != null ? [segment] : [],
                valueRated: true,
              },
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
      totalPerformanceGpus,
      bestPerformanceSegmentGpu,
      bestValueSegmentGpu,
    };
  }
}
