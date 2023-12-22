import { Injectable } from '@nestjs/common';
import {
  buildRelatedProductKey,
  getGpuChipset,
  getPreferredBenchmark,
  GpuContentData,
  GpuProduct,
  ListOrder,
  ListSort,
  preferredBenchmarkOrDefault,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  ProductFieldKey,
  ProductType,
  RelatedProductType,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import * as uuid from 'uuid';
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
    const timer = `ViewGpuViewModelService (${uuid.v4()})`;
    console.time(timer);

    const preferredBenchmark = preferredBenchmarkOrDefault(
      ProductType.Gpu,
      ctx.config?.userSettings?.preferredBenchmarks?.[ProductType.Gpu],
    ).toLowerCase();

    const viewModel = await this.cacheService.cache(
      async () => {
        const [gpu, bestPerformanceGpu, bestValueGpu] = await Promise.all([
          this.getGpu(slug, ctx),
          this.getBestPerformanceGpu(ctx),
          this.getBestValueGpu(ctx),
        ]);

        const chipset = getGpuChipset(gpu);
        const relativePerformanceGpus = await this.getRelativePerformanceGpus(
          chipset,
          ctx,
        );
        const relativeValueGpus = await this.getRelativeValueGpus(chipset, ctx);

        const relatedGpus = await this.getRelatedGpus(
          5,
          relativePerformanceGpus,
          relativeValueGpus,
          gpu,
        );
        const relatedGpuComparisons = await this.getRelatedComparisons(
          5,
          relativePerformanceGpus,
          relativeValueGpus,
          gpu,
        );

        const retailModels = await this.getRetailModels(chipset, ctx);

        const contentData: GpuContentData = {
          bestPerformanceGpu,
          bestValueGpu,
        };

        return {
          gpu,
          relativePerformanceGpus,
          relativeValueGpus,
          retailModels,
          relatedGpus,
          relatedGpuComparisons,
          contentData,
        } as ViewGpuViewModel;
      },
      {
        type: CacheType.GpuProduct,
        key: `viewModel__${slug}__benchmark_${preferredBenchmark}`,
      },
    );
    console.timeEnd(timer);

    return viewModel;
  }

  private async getGpu(slug: string, ctx: Context) {
    const gpu = await this.productService.getBySlug(
      {
        productType: ProductType.Gpu,
        slug,

        includeParent: true,
        includeChildren: false,
        includeAutomation: false,
        includeBenchmarks: true,
        includeImages: true,
        includeSources: false,
        includeUpdates: false,

        includeRanks: true,

        parentFields: ['msrp'] as ProductFieldKey[],

        includeRelated: true,
        includeRelatedBenchmarks: [
          getPreferredBenchmark(ctx.config?.userSettings, ProductType.Gpu),
        ],
        includeRelatedRanks: true,
      },
      ctx,
    );
    return gpu as GpuProduct;
  }

  private async getRelativePerformanceGpus(seed: GpuProduct, ctx: Context) {
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Gpu,
    );

    // Missing performance. Cannot have neighbors.
    if (productBenchmarkValue(seed, benchmark) == null) {
      return [];
    }

    const relatedProductKey = buildRelatedProductKey({
      type: RelatedProductType.Performance,
      benchmark,
    });
    const relative =
      (seed.relatedProducts?.[relatedProductKey]
        ?.filter((p) => productBenchmarkValue(p, benchmark) != null)
        .sort(
          (p1, p2) =>
            productBenchmarkValue(p2, benchmark) -
            productBenchmarkValue(p1, benchmark),
        ) as Partial<GpuProduct>[]) ?? [];

    return getSurroundingValues(
      relative,
      relative.findIndex((gpu) => gpu.id === seed.id),
      TOTAL_COMPARED_GPUS,
    ).sort(
      (p1, p2) =>
        productBenchmarkValue(p2, benchmark) -
        productBenchmarkValue(p1, benchmark),
    );
  }

  private async getRelativeValueGpus(seed: GpuProduct, ctx: Context) {
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Gpu,
    );

    // Missing performance. Cannot have neighbors.
    if (productBenchmarkValuePerMsrp(seed, benchmark) == null) {
      return [];
    }

    const relatedProductKey = buildRelatedProductKey({
      type: RelatedProductType.Value,
      benchmark,
    });
    const relative =
      (seed.relatedProducts?.[relatedProductKey]
        ?.filter((p) => productBenchmarkValuePerMsrp(p, benchmark) != null)
        .sort(
          (p1, p2) =>
            productBenchmarkValuePerMsrp(p2, benchmark) -
            productBenchmarkValuePerMsrp(p1, benchmark),
        ) as Partial<GpuProduct>[]) ?? [];

    return getSurroundingValues(
      relative,
      relative.findIndex((gpu) => gpu.id === seed.id),
      TOTAL_COMPARED_GPUS,
    ).sort(
      (p1, p2) =>
        productBenchmarkValuePerMsrp(p2, benchmark) -
        productBenchmarkValuePerMsrp(p1, benchmark),
    );
  }

  private async getRelatedGpus(
    total: number,
    performanceGpus: Partial<GpuProduct>[],
    valueGpus: Partial<GpuProduct>[],
    excludeGpu: Partial<GpuProduct>,
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, Partial<GpuProduct>>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(excludeGpu.id);

    const related: Partial<GpuProduct>[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    return related;
  }

  private async getRelatedComparisons(
    total: number,
    performanceGpus: Partial<GpuProduct>[],
    valueGpus: Partial<GpuProduct>[],
    pageGpu: Partial<GpuProduct>,
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, Partial<GpuProduct>>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const pageChipset = pageGpu.parent || pageGpu;
    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(pageChipset.id);

    const related: Partial<GpuProduct>[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedGpu) => [pageChipset, relatedGpu]);
    return comparisons;
  }

  private async getRetailModels(gpu: GpuProduct, ctx: Context) {
    const chipset = getGpuChipset(gpu);

    const response = await this.productService.list(
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
    );
    return response.results;
  }

  private async getBestPerformanceGpu(ctx: Context) {
    const response = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: { isChipset: true },
          orderBy: {
            sort: ListSort.PerformanceRating,
            order: ListOrder.Desc,
          },
          pagination: { limit: 1 },
        },
      },
      {
        skipCount: true,
        includeBenchmarks: [
          getPreferredBenchmark(ctx.config?.userSettings, ProductType.Gpu),
        ],
      },
      ctx,
    );
    return (response.results?.[0] || null) as GpuProduct;
  }

  private async getBestValueGpu(ctx: Context) {
    const response = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: { isChipset: true },
          orderBy: {
            sort: ListSort.PerformancePerMsrp,
            order: ListOrder.Desc,
          },
          pagination: { limit: 1 },
        },
      },
      {
        skipCount: true,
        includeBenchmarks: [
          getPreferredBenchmark(ctx.config?.userSettings, ProductType.Gpu),
        ],
      },
      ctx,
    );
    return (response.results?.[0] || null) as GpuProduct;
  }
}
