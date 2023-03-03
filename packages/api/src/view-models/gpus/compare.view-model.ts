import { Injectable } from '@nestjs/common';
import {
  Gpu,
  GpuComparison,
  GpuSort,
  RelatedComparisons,
  RelatedGpus,
} from '@pcpartdb/shared/gpus';
import { CompareGpusViewModel } from '@pcpartdb/shared/view-models';
import { GpuService } from '../../gpu/gpu.service';
import { Context } from '../../shared/context';

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
      { slug, includeImages: true, includeRanks: true },
      ctx,
    );
  }

  private async getContentData(comparison: GpuComparison, ctx: Context) {
    const totalRatedGpus = await this.getTotalRatedGpus(ctx);

    return {
      totalPerformanceRatedGpus: totalRatedGpus,

      relativePerformanceGpus: await this.getPerformanceGpus(comparison, ctx),
      relativeValueGpus: await this.getValueGpus(comparison, ctx),
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

  private getSurroundingGpus(gpus: Gpu[], seed: Gpu, total: number) {
    const seedIndex = gpus.findIndex((gpu) => gpu.id === seed.id);
    let start = seedIndex;
    let end = seedIndex + 1;
    let counter = 0;
    while (end - start < total && (start > 0 || end < gpus.length)) {
      if (counter++ % 2 === 0) {
        if (start > 0) {
          --start;
        }
      } else {
        if (end < gpus.length) {
          ++end;
        }
      }
    }

    return gpus.slice(start, end);
  }

  private getSurroundingGpus2(gpus: Gpu[], seed: GpuComparison, total: number) {
    const seedIndex1 = gpus.findIndex((gpu) => gpu.id === seed[0].id);
    const seedIndex2 = gpus.findIndex((gpu) => gpu.id === seed[1].id);

    if (Math.abs(seedIndex2 - seedIndex1) > total) {
      const seeds =
        seedIndex1 < seedIndex2 ? [seed[0], seed[1]] : [seed[1], seed[0]];
      return [
        ...this.getSurroundingGpus(gpus, seeds[0], Math.floor(total / 2)),
        ...this.getSurroundingGpus(gpus, seeds[1], Math.floor(total / 2)),
      ];
    } else {
      const seedIndex = Math.floor((seedIndex1 + seedIndex2) / 2);
      let start = seedIndex;
      let end = seedIndex + 1;
      let counter = 0;
      while (end - start < total && (start > 0 || end < gpus.length)) {
        if (counter++ % 2 === 0) {
          if (start > 0) {
            --start;
          }
        } else {
          if (end < gpus.length) {
            ++end;
          }
        }
      }

      return gpus.slice(start, end);
    }
  }

  // TODO: clean up this logic
  private async getPerformanceGpus(seed: GpuComparison, ctx: Context) {
    const results = await this.gpuService.list(
      {
        query: {
          filter: { performanceRated: true },
          orderBy: { sort: GpuSort.PerformanceRating },
        },
        includeRanks: true,
      },
      ctx,
    );

    return await this.getSurroundingGpus2(results, seed, TOTAL_COMPARED_GPUS);
  }

  // TODO: clean up this logic
  private async getValueGpus(seed: GpuComparison, ctx: Context) {
    const results = await this.gpuService.list(
      {
        query: {
          filter: { valueRated: true },
          orderBy: { sort: GpuSort.ValueRating },
        },
        includeRanks: true,
      },
      ctx,
    );

    return await this.getSurroundingGpus2(results, seed, TOTAL_COMPARED_GPUS);
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
