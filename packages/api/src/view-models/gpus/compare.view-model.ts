import { Injectable } from '@nestjs/common';
import {
  CompareGpusAdditionalData,
  CompareGpusViewModel,
  getGpuChipset,
  GpuProduct,
  GpuProductComparison,
  hasProductFieldRawValue,
  ListOrder,
  ListSort,
  productFieldRawValue,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
} from '@pcpartdb/shared';
import { ProductService } from '../../product/product.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_GPUS = 10;

@Injectable()
export class CompareGpusViewModelService {
  constructor(private productService: ProductService) {}

  async viewModel(slug: string, ctx: Context) {
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
  }

  private async getComparison(slug: string, ctx: Context) {
    const comparison = await this.productService.getComparison(
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

        includeRanks: ['performanceRating', 'performancePerMsrp'],
      },
      ctx,
    );
    return comparison as GpuProductComparison;
  }

  private async getAdditionalData(
    comparison: GpuProductComparison,
    ctx: Context,
  ) {
    const chipset1 = getGpuChipset(comparison[0]);
    const chipset2 = getGpuChipset(comparison[1]);

    const retailModelsResponse1 = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: { chipsetId: chipset1.id },
          orderBy: { sort: ListSort.Name },
        },
      },
      {},
      ctx,
    );
    const retailModels1 = retailModelsResponse1.results;

    const retailModelsResponse2 = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: { chipsetId: chipset2.id },
          orderBy: { sort: ListSort.Name },
        },
      },
      {},
      ctx,
    );
    const retailModels2 = retailModelsResponse2.results;

    return {
      relativePerformanceGpus: await this.getRelativePerformanceGpus(
        comparison,
        ctx,
      ),
      relativeValueGpus: await this.getRelativeValueGpus(comparison, ctx),
      retailModels1,
      retailModels2,
    } as CompareGpusAdditionalData;
  }

  private async getRelativePerformanceGpus(
    comparison: GpuProductComparison,
    ctx: Context,
  ) {
    const [gpu1, gpu2] = comparison;
    const chipset1 = getGpuChipset(gpu1);
    const chipset2 = getGpuChipset(gpu2);
    const neighbors1 = await this.getPerformanceNeighbors(chipset1, ctx);
    const neighbors2 = await this.getPerformanceNeighbors(chipset2, ctx);

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
    const hasGapBetweenNeighbors =
      Math.abs(
        chipset1.ranks?.performanceRating - chipset2.ranks?.performanceRating,
      ) >
      TOTAL_COMPARED_GPUS / 2 + 1;

    if (hasGapBetweenNeighbors) {
      return this.concatNeighbors(
        [chipset1, chipset2],
        neighbors1,
        neighbors2,
        (g1, g2) => g1.ranks?.performanceRating - g2.ranks?.performanceRating,
      );
    } else {
      return this.mergeNeighbors(
        [chipset1, chipset2],
        neighbors1,
        neighbors2,
        (g1, g2) => g1.ranks?.performanceRating - g2.ranks?.performanceRating,
      );
    }
  }

  private async getRelativeValueGpus(
    comparison: GpuProductComparison,
    ctx: Context,
  ) {
    const [gpu1, gpu2] = comparison;
    const chipset1 = getGpuChipset(gpu1);
    const chipset2 = getGpuChipset(gpu2);
    const neighbors1 = await this.getValueNeighbors(chipset1, ctx);
    const neighbors2 = await this.getValueNeighbors(chipset2, ctx);

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
    const hasGapBetweenNeighbors =
      Math.abs(
        chipset1.ranks?.performancePerMsrp - chipset2.ranks?.performancePerMsrp,
      ) >
      TOTAL_COMPARED_GPUS / 2 + 1;

    if (hasGapBetweenNeighbors) {
      return this.concatNeighbors(
        [chipset1, chipset2],
        neighbors1,
        neighbors2,
        (g1, g2) => g1.ranks?.performancePerMsrp - g2.ranks?.performancePerMsrp,
      );
    } else {
      return this.mergeNeighbors(
        [chipset1, chipset2],
        neighbors1,
        neighbors2,
        (g1, g2) => g1.ranks?.performancePerMsrp - g2.ranks?.performancePerMsrp,
      );
    }
  }

  private async getPerformanceNeighbors(gpu: GpuProduct, ctx: Context) {
    // Missing value. Cannot have neighbors.
    if (!hasProductFieldRawValue(gpu.fields?.performanceRating)) {
      return [];
    }

    const aboveResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            segment: hasProductFieldRawValue(gpu.fields?.marketSegment)
              ? [productFieldRawValue(gpu.fields?.marketSegment)]
              : [],
            excludeIds: [gpu.id],
            minPerformanceScore: productFieldRawValue(
              gpu.fields?.performanceRating,
            ),
            performanceRated: true,
          },
          orderBy: {
            sort: ListSort.PerformanceRating,
            order: ListOrder.Asc,
          },
          pagination: { limit: TOTAL_COMPARED_GPUS },
        },
      },
      {
        fields: ['performanceRating'],
        includeRanks: ['performanceRating'],
      },
      ctx,
    );
    const aboveGpus = aboveResponse.results;

    const belowResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            segment: hasProductFieldRawValue(gpu.fields?.marketSegment)
              ? [productFieldRawValue(gpu.fields?.marketSegment)]
              : [],
            excludeIds: [gpu.id],
            maxPerformanceScore: productFieldRawValue(
              gpu.fields?.performanceRating,
            ),
            performanceRated: true,
          },
          orderBy: {
            sort: ListSort.PerformanceRating,
            order: ListOrder.Desc,
          },
          pagination: { limit: TOTAL_COMPARED_GPUS },
        },
      },
      {
        fields: ['performanceRating'],
        includeRanks: ['performanceRating'],
      },
      ctx,
    );
    const belowGpus = belowResponse.results;

    return [
      ...new Map(
        [...aboveGpus, gpu, ...belowGpus].map((n) => [n.id, n]),
      ).values(),
    ].sort(
      (gpu1, gpu2) =>
        productFieldRawValue(gpu2.fields?.performanceRating) -
        productFieldRawValue(gpu1.fields?.performanceRating),
    ) as GpuProduct[];
  }

  private async getValueNeighbors(gpu: GpuProduct, ctx: Context) {
    // Missing value. Cannot have neighbors.
    if (!hasProductFieldRawValue(gpu.fields?.performancePerMsrp)) {
      return [];
    }

    const aboveResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            segment: hasProductFieldRawValue(gpu.fields?.marketSegment)
              ? [productFieldRawValue(gpu.fields?.marketSegment)]
              : [],
            excludeIds: [gpu.id],
            minValueScore: productFieldRawValue(gpu.fields?.performancePerMsrp),
            valueRated: true,
          },
          orderBy: {
            sort: ListSort.PerformancePerMsrp,
            order: ListOrder.Asc,
          },
          pagination: { limit: TOTAL_COMPARED_GPUS },
        },
      },
      {
        fields: ['performancePerMsrp'],
        includeRanks: ['performancePerMsrp'],
      },
      ctx,
    );
    const aboveGpus = aboveResponse.results;

    const belowResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            segment: hasProductFieldRawValue(gpu.fields?.marketSegment)
              ? [productFieldRawValue(gpu.fields?.marketSegment)]
              : [],
            excludeIds: [gpu.id],
            maxValueScore: productFieldRawValue(gpu.fields?.performancePerMsrp),
            valueRated: true,
          },
          orderBy: {
            sort: ListSort.PerformancePerMsrp,
            order: ListOrder.Desc,
          },
          pagination: { limit: TOTAL_COMPARED_GPUS },
        },
      },
      {
        fields: ['performancePerMsrp'],
        includeRanks: ['performancePerMsrp'],
      },
      ctx,
    );
    const belowGpus = belowResponse.results;

    return [
      ...new Map(
        [...aboveGpus, gpu, ...belowGpus].map((n) => [n.id, n]),
      ).values(),
    ].sort(
      (gpu1, gpu2) =>
        productFieldRawValue(gpu2.fields?.performancePerMsrp) -
        productFieldRawValue(gpu1.fields?.performancePerMsrp),
    ) as GpuProduct[];
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
