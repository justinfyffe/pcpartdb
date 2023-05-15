import { Injectable } from '@nestjs/common';
import {
  getChipset,
  Gpu,
  GpuOrder,
  GpuSort,
  RelatedComparisons,
  RelatedGpus,
  ViewGpuContentData,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { parseISO } from 'date-fns';
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
      {
        includeChipset: true,
        chipsetFields: [
          'company',
          'launchPrice',
          'performanceScore',
          'valueScore',
          'g3dMark',
          'g2dMark',
          'timespyGraphics',
        ],
        includeImages: true,
        includeRanks: [
          'performanceRank',
          'performanceRankForArchitectureSegment',
          'performanceRankForCompanySegment',
          'performanceRankForSegmentYear',
          'valueRank',
          'valueRankForSegment',
        ],
      },
      ctx,
    );
  }

  private async getContentData(gpu: Gpu, ctx: Context) {
    const year = parseISO(gpu.releaseDate?.value).getFullYear();
    const segment = gpu.marketSegment?.value;

    const totalPerformanceGpus = await this.gpuService.count(
      { query: { filter: { performanceRated: true } } },
      ctx,
    );
    const totalPerformanceSegmentYearGpus = await this.gpuService.count(
      {
        query: {
          filter: { year: [year], segment: [segment], performanceRated: true },
        },
      },
      ctx,
    );
    const relativePerformanceGpus = await this.getRelativePerformanceGpus(
      getChipset(gpu),
      ctx,
    );
    const relativeValueGpus = await this.getRelativeValueGpus(
      getChipset(gpu),
      ctx,
    );

    const bestPerformanceSegmentGpus = await this.gpuService.list(
      {
        query: {
          filter: { segment: [segment], performanceRated: true },
          orderBy: { sort: GpuSort.PerformanceRating },
          limit: 1,
        },
      },
      ctx,
    );

    const bestValueSegmentGpus = await this.gpuService.list(
      {
        query: {
          filter: { segment: [segment], valueRated: true },
          orderBy: { sort: GpuSort.ValueRating },
          limit: 1,
        },
      },
      ctx,
    );

    const retailModels = await this.gpuService.list(
      {
        query: {
          filter: { chipsetId: gpu.chipset?.id || gpu.id, isRetailModel: true },
          orderBy: { sort: GpuSort.Name },
        },
        fields: [
          'company',
          'coreClockSpeedBase',
          'coreClockSpeedBoost',
          'length',
          'slotWidth',
          'width',
          'height',
          'thermalDesignPower',
        ],
      },
      ctx,
    );

    return {
      totalPerformanceGpus,
      totalPerformanceSegmentYearGpus,
      relativePerformanceGpus,
      relativeValueGpus,
      bestPerformanceGpuForSegment: bestPerformanceSegmentGpus?.[0],
      bestValueGpuForSegment: bestValueSegmentGpus?.[0],
      retailModels,
    } as ViewGpuContentData;
  }

  private async getRelativePerformanceGpus(seed: Gpu, ctx: Context) {
    if (seed.performanceScore?.value == null) {
      return [];
    }

    const above = await this.gpuService.list(
      {
        query: {
          filter: {
            excludeIds: [seed.id],
            minPerformanceScore: seed.performanceScore?.value,
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
            excludeIds: [seed.id],
            maxPerformanceScore: seed.performanceScore?.value,
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

    const neighbors = [
      ...new Map([...above, seed, ...below].map((n) => [n.id, n])).values(),
    ].sort(
      (gpu1, gpu2) =>
        gpu2.performanceScore?.value - gpu1.performanceScore?.value,
    );

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((gpu) => gpu.id === seed.id),
      TOTAL_COMPARED_GPUS,
    );
  }

  private async getRelativeValueGpus(seed: Gpu, ctx: Context) {
    if (seed.valueScore?.value == null) {
      return [];
    }

    const above = await this.gpuService.list(
      {
        query: {
          filter: {
            excludeIds: [seed.id],
            minValueScore: seed.valueScore?.value,
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
            excludeIds: [seed.id],
            maxValueScore: seed.valueScore?.value,
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

    const neighbors = [
      ...new Map([...above, seed, ...below].map((n) => [n.id, n])).values(),
    ].sort((gpu1, gpu2) => gpu2.valueScore?.value - gpu1.valueScore?.value);

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
