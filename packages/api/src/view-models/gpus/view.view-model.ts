import { Injectable } from '@nestjs/common';
import {
  Gpu,
  GpuOrder,
  GpuSort,
  RelatedComparisons,
  RelatedGpus,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { GpuService } from '../../gpu/gpu.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_GPUS = 10;

@Injectable()
export class ViewGpuViewModelService {
  constructor(private gpuService: GpuService) {}

  async viewModel(slug: string, ctx: Context) {
    const gpu = await this.getGpu(slug, ctx);
    const contentData = await this.getContentData(gpu, ctx);

    const relatedGpus = await this.getRelatedGpus(
      3,
      contentData.relativePerformanceGpus,
      contentData.relativeValueGpus,
      gpu,
    );
    const relatedComparisons = await this.getRelatedComparisons(
      3,
      contentData.relativePerformanceGpus,
      contentData.relativeValueGpus,
      gpu,
    );

    return {
      gpu,
      contentData,
      relatedGpus,
      relatedComparisons,
    } as ViewGpuViewModel;
  }

  private async getGpu(slug: string, ctx: Context): Promise<Gpu> {
    return await this.gpuService.getBySlug(
      slug,
      { includeImages: true, includeRanks: true },
      ctx,
    );
  }

  private async getContentData(gpu: Gpu, ctx: Context) {
    const totalRatedGpus = await this.getTotalRatedGpus(ctx);

    const relativePerformanceGpus = await this.getRelativePerformanceGpus(
      gpu,
      ctx,
    );
    const relativeValueGpus = await this.getRelativeValueGpus(gpu, ctx);

    return {
      totalPerformanceRatedGpus: totalRatedGpus,
      relativePerformanceGpus,
      relativeValueGpus,
    };
  }

  private async getTotalRatedGpus(ctx: Context) {
    const results = await this.gpuService.list(
      {
        query: { filter: { performanceRated: true } },
      },
      ctx,
    );
    return results.length;
  }

  private async getRelativePerformanceGpus(seed: Gpu, ctx: Context) {
    if (seed.benchmarks?.performanceScore?.value == null) {
      return [];
    }

    const above = await this.gpuService.list(
      {
        query: {
          filter: {
            excludeIds: [seed.id],
            minPerformanceScore: seed.benchmarks?.performanceScore?.value,
            performanceRated: true,
          },
          orderBy: { sort: GpuSort.PerformanceRating, order: GpuOrder.Asc },
          limit: TOTAL_COMPARED_GPUS,
        },
        includeRanks: true,
      },
      ctx,
    );

    const below = await this.gpuService.list(
      {
        query: {
          filter: {
            excludeIds: [seed.id],
            maxPerformanceScore: seed.benchmarks?.performanceScore?.value,
            performanceRated: true,
          },
          orderBy: { sort: GpuSort.PerformanceRating, order: GpuOrder.Desc },
          limit: TOTAL_COMPARED_GPUS,
        },
        includeRanks: true,
      },
      ctx,
    );

    const neighbors = [
      ...new Map([...above, seed, ...below].map((n) => [n.id, n])).values(),
    ].sort(
      (gpu1, gpu2) =>
        gpu2.benchmarks?.performanceScore?.value -
        gpu1.benchmarks?.performanceScore?.value,
    );

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((gpu) => gpu.id === seed.id),
      TOTAL_COMPARED_GPUS,
    );
  }

  private async getRelativeValueGpus(seed: Gpu, ctx: Context) {
    if (seed.benchmarks?.valueScore?.value == null) {
      return [];
    }

    const above = await this.gpuService.list(
      {
        query: {
          filter: {
            excludeIds: [seed.id],
            minValueScore: seed.benchmarks?.valueScore?.value,
            valueRated: true,
          },
          orderBy: { sort: GpuSort.ValueRating, order: GpuOrder.Asc },
          limit: TOTAL_COMPARED_GPUS,
        },
        includeRanks: true,
      },
      ctx,
    );

    const below = await this.gpuService.list(
      {
        query: {
          filter: {
            excludeIds: [seed.id],
            maxValueScore: seed.benchmarks?.valueScore?.value,
            valueRated: true,
          },
          orderBy: { sort: GpuSort.ValueRating, order: GpuOrder.Desc },
          limit: TOTAL_COMPARED_GPUS,
        },
        includeRanks: true,
      },
      ctx,
    );

    const neighbors = [
      ...new Map([...above, seed, ...below].map((n) => [n.id, n])).values(),
    ].sort(
      (gpu1, gpu2) =>
        gpu2.benchmarks?.valueScore?.value - gpu1.benchmarks?.valueScore?.value,
    );

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((gpu) => gpu.id === seed.id),
      TOTAL_COMPARED_GPUS,
    );
  }

  private async getRelatedGpus(
    total: number,
    performanceGpus: Gpu[],
    valueGpus: Gpu[],
    excludeGpu: Gpu,
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, Gpu>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(excludeGpu.id);

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
    pageGpu: Gpu,
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, Gpu>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(pageGpu.id);

    const related: Gpu[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedGpu) => [pageGpu, relatedGpu]);

    return { comparisons } as RelatedComparisons;
  }
}
