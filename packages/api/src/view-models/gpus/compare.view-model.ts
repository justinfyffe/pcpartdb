import { Injectable } from '@nestjs/common';
import {
  CompareGpusAdditionalData,
  CompareGpusViewModel,
  getGpuChipset,
  GpuProduct,
  GpuProductComparison,
  hasProductFieldRawValue,
  ListSort,
  ProductFieldKey,
  productFieldRawValue,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
  RelatedProductType,
} from '@pcpartdb/shared';
import * as uuid from 'uuid';
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
    const timer = `CompareGpusViewModelService (${uuid.v4()})`;
    console.time(timer);

    const viewModel = await this.cacheService.cache(
      async () => {
        const comparison = await this.getComparison(slug, ctx);
        const additionalData = await this.getAdditionalData(comparison, ctx);

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
    console.timeEnd(timer);

    return viewModel;
  }

  private async getComparison(slug: string, ctx: Context) {
    const comparison = await this.db.transaction(
      () =>
        this.productService.getComparison(
          {
            productType: ProductType.Gpu,
            slug,

            includeParent: true,
            includeChildren: false,
            includeBenchmarks: true,
            includeImages: true,
            includeAutomation: false,
            includeSources: false,
            includeUpdates: false,
            includeRanks: true,
            includeRelated: true,

            relatedFields: ['performanceRating', 'performancePerMsrp'],
          },
          ctx,
        ),
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
    );

    const relativeValueGpus = await this.getRelativeValueGpus(
      chipset1,
      chipset2,
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
  ) {
    const relative1 = seed1.relatedProducts
      ?.filter((rp) => rp.type === RelatedProductType.PerformanceRating)
      .map((r) => r.relatedProduct)
      .filter((p) => hasProductFieldRawValue(p?.fields?.performanceRating))
      .sort(
        (p1, p2) =>
          productFieldRawValue(p2?.fields?.performanceRating) -
          productFieldRawValue(p1?.fields?.performanceRating),
      ) as Partial<GpuProduct>[];
    const relative2 = seed2.relatedProducts
      ?.filter((rp) => rp.type === RelatedProductType.PerformanceRating)
      .map((r) => r.relatedProduct)
      .filter((p) => hasProductFieldRawValue(p?.fields?.performanceRating))
      .sort(
        (p1, p2) =>
          productFieldRawValue(p2?.fields?.performanceRating) -
          productFieldRawValue(p1?.fields?.performanceRating),
      ) as Partial<GpuProduct>[];

    // At least one GPU has no neighbors (missing rank)
    if (relative1.length === 0 && relative2.length === 0) {
      return [];
    }
    if (relative1.length === 0 || relative2.length === 0) {
      const neighbors = [...relative1, ...relative2];
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
      relative1.find((p) => p.id === seed2.id) ||
      relative2.find((p) => p.id === seed1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performanceRating) -
          productFieldRawValue(g1.fields?.performanceRating),
      );
    } else {
      return this.concatNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performanceRating) -
          productFieldRawValue(g1.fields?.performanceRating),
      );
    }
  }

  private async getRelativeValueGpus(seed1: GpuProduct, seed2: GpuProduct) {
    const relative1 = seed1.relatedProducts
      ?.filter((rp) => rp.type === RelatedProductType.PerformancePerMsrp)
      .map((r) => r.relatedProduct)
      .filter((p) => hasProductFieldRawValue(p?.fields?.performancePerMsrp))
      .sort(
        (p1, p2) =>
          productFieldRawValue(p2?.fields?.performancePerMsrp) -
          productFieldRawValue(p1?.fields?.performancePerMsrp),
      ) as Partial<GpuProduct>[];
    const relative2 = seed2.relatedProducts
      ?.filter((rp) => rp.type === RelatedProductType.PerformancePerMsrp)
      .map((r) => r.relatedProduct)
      .filter((p) => hasProductFieldRawValue(p?.fields?.performancePerMsrp))
      .sort(
        (p1, p2) =>
          productFieldRawValue(p2?.fields?.performancePerMsrp) -
          productFieldRawValue(p1?.fields?.performancePerMsrp),
      ) as Partial<GpuProduct>[];

    // At least one GPU has no neighbors (missing rank)
    if (relative1.length === 0 && relative2.length === 0) {
      return [];
    }
    if (relative1.length === 0 || relative2.length === 0) {
      const neighbors = [...relative1, ...relative2];
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
      relative1.find((p) => p.id === seed2.id) ||
      relative2.find((p) => p.id === seed1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performancePerMsrp) -
          productFieldRawValue(g1.fields?.performancePerMsrp),
      );
    } else {
      return this.concatNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (g1, g2) =>
          productFieldRawValue(g2.fields?.performancePerMsrp) -
          productFieldRawValue(g1.fields?.performancePerMsrp),
      );
    }
  }

  private concatNeighbors(
    comparison: GpuProductComparison,
    neighbors1: Partial<GpuProduct>[],
    neighbors2: Partial<GpuProduct>[],
    compareFn: (gpu1: Partial<GpuProduct>, gpu2: Partial<GpuProduct>) => number,
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
    }, {} as Record<number, Partial<GpuProduct>>);
    return Object.values(set).sort(compareFn);
  }

  private mergeNeighbors(
    comparison: GpuProductComparison,
    neighbors1: Partial<GpuProduct>[],
    neighbors2: Partial<GpuProduct>[],
    compareFn: (gpu1: Partial<GpuProduct>, gpu2: Partial<GpuProduct>) => number,
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
    }, {} as Record<number, Partial<GpuProduct>>);
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
