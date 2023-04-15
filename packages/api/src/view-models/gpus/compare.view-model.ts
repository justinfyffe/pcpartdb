import { Injectable } from '@nestjs/common';
import {
  CompareGpusViewModel,
  Gpu,
  GpuComparison,
  GpuOrder,
  GpuSort,
  RelatedComparisons,
  RelatedGpus,
} from '@pcpartdb/shared';
import { GpuService } from '../../gpu/gpu.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_GPUS = 10;

@Injectable()
export class CompareGpusViewModelService {
  constructor(private gpuService: GpuService) {}

  async viewModel(slug: string, ctx: Context) {
    const comparison = await this.getComparison(slug, ctx);
    const contentData = await this.getContentData(comparison, ctx);

    const relatedGpus = await this.getRelatedGpus(
      3,
      contentData.relativePerformanceGpus,
      contentData.relativeValueGpus,
      comparison,
    );
    const relatedComparisons = await this.getRelatedComparisons(
      3,
      contentData.relativePerformanceGpus,
      contentData.relativeValueGpus,
      comparison,
    );

    return {
      comparison,
      contentData,
      relatedGpus,
      relatedComparisons,
    } as CompareGpusViewModel;
  }

  private async getComparison(slug: string, ctx: Context) {
    return await this.gpuService.getComparison(
      {
        slug,
        includeImages: true,
        includeRanks: ['performanceRank', 'valueRank'],
      },
      ctx,
    );
  }

  private async getContentData(comparison: GpuComparison, ctx: Context) {
    return {
      relativePerformanceGpus: await this.getRelativePerformanceGpus(
        comparison,
        ctx,
      ),
      relativeValueGpus: await this.getRelativeValueGpus(comparison, ctx),
    };
  }

  private async getRelativePerformanceGpus(
    comparison: GpuComparison,
    ctx: Context,
  ) {
    const [gpu1, gpu2] = comparison;
    const neighbors1 = await this.getPerformanceNeighbors(gpu1, ctx);
    const neighbors2 = await this.getPerformanceNeighbors(gpu2, ctx);

    // At least one GPU has no neighbors (missing rank)
    if (neighbors1.length === 0 && neighbors2.length === 0) {
      return [];
    }
    if (neighbors1.length === 0 || neighbors2.length === 0) {
      const neighbors = [...neighbors1, ...neighbors2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex((gpu) => gpu.id === gpu1.id || gpu.id === gpu2.id),
        TOTAL_COMPARED_GPUS,
      );
    }

    // Both GPUS have neighbors
    const hasGapBetweenNeighbors =
      Math.abs(gpu1.ranks?.performanceRank - gpu2.ranks?.performanceRank) >
      TOTAL_COMPARED_GPUS / 2;

    if (hasGapBetweenNeighbors) {
      return this.concatNeighbors(
        comparison,
        neighbors1,
        neighbors2,
        (g1, g2) => g1.ranks?.performanceRank - g2.ranks?.performanceRank,
      );
    } else {
      return this.mergeNeighbors(
        comparison,
        neighbors1,
        neighbors2,
        (g1, g2) => g1.ranks?.performanceRank - g2.ranks?.performanceRank,
      );
    }
  }

  private async getRelativeValueGpus(comparison: GpuComparison, ctx: Context) {
    const [gpu1, gpu2] = comparison;
    const neighbors1 = await this.getValueNeighbors(gpu1, ctx);
    const neighbors2 = await this.getValueNeighbors(gpu2, ctx);

    // At least one GPU has no neighbors (missing rank)
    if (neighbors1.length === 0 && neighbors2.length === 0) {
      return [];
    }
    if (neighbors1.length === 0 || neighbors2.length === 0) {
      const neighbors = [...neighbors1, ...neighbors2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex((gpu) => gpu.id === gpu1.id || gpu.id === gpu2.id),
        TOTAL_COMPARED_GPUS,
      );
    }

    // Both GPUs have neighbors. Need to combine them.
    const hasGapBetweenNeighbors =
      Math.abs(gpu1.ranks?.valueRank - gpu2.ranks?.valueRank) >
      TOTAL_COMPARED_GPUS / 2;

    if (hasGapBetweenNeighbors) {
      return this.concatNeighbors(
        comparison,
        neighbors1,
        neighbors2,
        (g1, g2) => g1.ranks?.valueRank - g2.ranks?.valueRank,
      );
    } else {
      return this.mergeNeighbors(
        comparison,
        neighbors1,
        neighbors2,
        (g1, g2) => g1.ranks?.valueRank - g2.ranks?.valueRank,
      );
    }
  }

  private async getPerformanceNeighbors(gpu: Gpu, ctx: Context) {
    // Missing value. Cannot have neighbors.
    if (gpu.performanceScore?.value == null) {
      return [];
    }

    const above = await this.gpuService.list(
      {
        query: {
          filter: {
            excludeIds: [gpu.id],
            minPerformanceScore: gpu.performanceScore?.value,
            performanceRated: true,
          },
          orderBy: { sort: GpuSort.PerformanceRating, order: GpuOrder.Asc },
          limit: TOTAL_COMPARED_GPUS,
        },
        fields: ['company', 'performanceScore'],
        includeRanks: ['performanceRank'],
      },
      ctx,
    );

    const below = await this.gpuService.list(
      {
        query: {
          filter: {
            excludeIds: [gpu.id],
            maxPerformanceScore: gpu.performanceScore?.value,
            performanceRated: true,
          },
          orderBy: { sort: GpuSort.PerformanceRating, order: GpuOrder.Desc },
          limit: TOTAL_COMPARED_GPUS,
        },
        fields: ['company', 'performanceScore'],
        includeRanks: ['performanceRank'],
      },
      ctx,
    );

    return [
      ...new Map([...above, gpu, ...below].map((n) => [n.id, n])).values(),
    ].sort(
      (gpu1, gpu2) =>
        gpu2.performanceScore?.value - gpu1.performanceScore?.value,
    );
  }

  private async getValueNeighbors(gpu: Gpu, ctx: Context) {
    // Missing value. Cannot have neighbors.
    if (gpu.valueScore?.value == null) {
      return [];
    }

    const above = await this.gpuService.list(
      {
        query: {
          filter: {
            excludeIds: [gpu.id],
            minValueScore: gpu.valueScore?.value,
            valueRated: true,
          },
          orderBy: { sort: GpuSort.ValueRating, order: GpuOrder.Asc },
          limit: TOTAL_COMPARED_GPUS,
        },
        fields: ['company', 'valueScore'],
        includeRanks: ['valueRank'],
      },
      ctx,
    );

    const below = await this.gpuService.list(
      {
        query: {
          filter: {
            excludeIds: [gpu.id],
            maxValueScore: gpu.valueScore?.value,
            valueRated: true,
          },
          orderBy: { sort: GpuSort.ValueRating, order: GpuOrder.Desc },
          limit: TOTAL_COMPARED_GPUS,
        },
        fields: ['company', 'valueScore'],
        includeRanks: ['valueRank'],
      },
      ctx,
    );

    return [
      ...new Map([...above, gpu, ...below].map((n) => [n.id, n])).values(),
    ].sort((gpu1, gpu2) => gpu2.valueScore?.value - gpu1.valueScore?.value);
  }

  private concatNeighbors(
    comparison: GpuComparison,
    neighbors1: Gpu[],
    neighbors2: Gpu[],
    compareFn: (gpu1: Gpu, gpu2: Gpu) => number,
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
    return [...surrounding1, ...surrounding2].sort(compareFn);
  }

  private mergeNeighbors(
    comparison: GpuComparison,
    neighbors1: Gpu[],
    neighbors2: Gpu[],
    compareFn: (gpu1: Gpu, gpu2: Gpu) => number,
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
    }, {} as Record<number, Gpu>);
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
    performanceGpus: Gpu[],
    valueGpus: Gpu[],
    excludeGpus: Gpu[],
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, Gpu>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    excludeGpus.forEach((gpu) => set.delete(gpu.id));

    const related: Gpu[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    return { gpus: related } as RelatedGpus;
  }

  private async getRelatedComparisons(
    total: number,
    performanceGpus: Gpu[],
    valueGpus: Gpu[],
    pageComparison: GpuComparison,
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, Gpu>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    pageComparison.forEach((gpu) => set.delete(gpu.id));

    const related: Gpu[] = [];
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

    return { comparisons } as RelatedComparisons;
  }
}
