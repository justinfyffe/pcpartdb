import { Injectable } from '@nestjs/common';
import {
  Cpu,
  hasProductFieldValue,
  ListCpusOrder,
  ListCpusSort,
  RelatedCpuComparisons,
  RelatedCpus,
  ViewCpuContentData,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import { parseISO } from 'date-fns';
import { CpuService } from '../../product/cpu/cpu.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class ViewCpuViewModelService {
  constructor(private cpuService: CpuService) {}

  async viewModel(slug: string, ctx: Context) {
    const cpu = await this.getCpu(slug, ctx);
    const contentData = await this.getContentData(cpu, ctx);

    const relatedCpus = await this.getRelatedCpus(
      3,
      contentData.relativePerformanceCpus,
      contentData.relativeValueCpus,
      cpu,
    );
    const relatedComparisons = await this.getRelatedComparisons(
      3,
      contentData.relativePerformanceCpus,
      contentData.relativeValueCpus,
      cpu,
    );

    return {
      cpu,
      contentData,
      relatedCpus,
      relatedComparisons,
    } as ViewCpuViewModel;
  }

  private async getCpu(slug: string, ctx: Context): Promise<Cpu> {
    return await this.cpuService.getBySlug(
      slug,
      {
        includeImages: true,
        includeRanks: [
          'performanceRank',
          'performanceRankForSegment',
          'performanceRankForCodename',
          'performanceRankForGeneration',
          'valueRank',
          'valueRankForSegment',
        ],
      },
      ctx,
    );
  }

  private async getContentData(cpu: Cpu, ctx: Context) {
    const year = parseISO(cpu.releaseDate?.value).getFullYear();
    const segments = cpu.marketSegments?.value;

    const totalPerformanceCpus = await this.cpuService.count(
      { query: { filter: { performanceRated: true } } },
      ctx,
    );
    const totalPerformanceSegmentYearCpus = await this.cpuService.count(
      {
        query: {
          filter: { year: [year], segment: segments, performanceRated: true },
        },
      },
      ctx,
    );
    const relativePerformanceCpus = await this.getRelativePerformanceCpus(
      cpu,
      ctx,
    );
    const relativeValueCpus = await this.getRelativeValueCpus(cpu, ctx);

    const bestPerformanceCpus = await this.cpuService.list(
      {
        query: {
          filter: { performanceRated: true },
          orderBy: { sort: ListCpusSort.PerformanceRating },
          pagination: { limit: 1 },
        },
      },
      ctx,
    );

    const bestValueCpus = await this.cpuService.list(
      {
        query: {
          filter: { valueRated: true },
          orderBy: { sort: ListCpusSort.ValueRating },
          pagination: { limit: 1 },
        },
      },
      ctx,
    );

    return {
      totalPerformanceCpus: totalPerformanceCpus || [],
      totalPerformanceSegmentYearCpus: totalPerformanceSegmentYearCpus || [],
      relativePerformanceCpus: relativePerformanceCpus || [],
      relativeValueCpus: relativeValueCpus || [],
      bestPerformanceCpu: bestPerformanceCpus?.[0],
      bestValueCpu: bestValueCpus?.[0],
    } as ViewCpuContentData;
  }

  private async getRelativePerformanceCpus(seed: Cpu, ctx: Context) {
    if (!hasProductFieldValue(seed.performanceScore)) {
      return [];
    }

    const above = await this.cpuService.list(
      {
        query: {
          filter: {
            segment: seed.marketSegments?.value ?? [],
            excludeIds: [seed.id],
            minPerformanceScore: seed.performanceScore?.value,
            performanceRated: true,
          },
          orderBy: {
            sort: ListCpusSort.PerformanceRating,
            order: ListCpusOrder.Asc,
          },
          pagination: { limit: TOTAL_COMPARED_CPUS },
        },
        fields: ['company', 'performanceScore'],
        includeRanks: ['performanceRank'],
      },
      ctx,
    );

    const below = await this.cpuService.list(
      {
        query: {
          filter: {
            segment: seed.marketSegments?.value ?? [],
            excludeIds: [seed.id],
            maxPerformanceScore: seed.performanceScore?.value,
            performanceRated: true,
          },
          orderBy: {
            sort: ListCpusSort.PerformanceRating,
            order: ListCpusOrder.Desc,
          },
          pagination: { limit: TOTAL_COMPARED_CPUS },
        },
        fields: ['company', 'performanceScore'],
        includeRanks: ['performanceRank'],
      },
      ctx,
    );

    const neighbors = [
      ...new Map([...above, seed, ...below].map((n) => [n.id, n])).values(),
    ].sort(
      (cpu1, cpu2) =>
        cpu2.performanceScore?.value - cpu1.performanceScore?.value,
    );

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    );
  }

  private async getRelativeValueCpus(seed: Cpu, ctx: Context) {
    if (!hasProductFieldValue(seed.valueScore)) {
      return [];
    }

    const above = await this.cpuService.list(
      {
        query: {
          filter: {
            segment: seed.marketSegments?.value ?? [],
            excludeIds: [seed.id],
            minValueScore: seed.valueScore?.value,
            valueRated: true,
          },
          orderBy: { sort: ListCpusSort.ValueRating, order: ListCpusOrder.Asc },
          pagination: { limit: TOTAL_COMPARED_CPUS },
        },
        fields: ['company', 'valueScore'],
        includeRanks: ['valueRank'],
      },
      ctx,
    );

    const below = await this.cpuService.list(
      {
        query: {
          filter: {
            segment: seed.marketSegments?.value ?? [],
            excludeIds: [seed.id],
            maxValueScore: seed.valueScore?.value,
            valueRated: true,
          },
          orderBy: {
            sort: ListCpusSort.ValueRating,
            order: ListCpusOrder.Desc,
          },
          pagination: { limit: TOTAL_COMPARED_CPUS },
        },
        fields: ['company', 'valueScore'],
        includeRanks: ['valueRank'],
      },
      ctx,
    );

    const neighbors = [
      ...new Map([...above, seed, ...below].map((n) => [n.id, n])).values(),
    ].sort((cpu1, cpu2) => cpu2.valueScore?.value - cpu1.valueScore?.value);

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    );
  }

  private async getRelatedCpus(
    total: number,
    performanceCpus: Cpu[],
    valueCpus: Cpu[],
    excludeCpu: Cpu,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Cpu>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(excludeCpu.id);

    const related: Cpu[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    return { cpus: related } as RelatedCpus;
  }

  private async getRelatedComparisons(
    total: number,
    performanceCpus: Cpu[],
    valueCpus: Cpu[],
    pageCpu: Cpu,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Cpu>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(pageCpu.id);

    const related: Cpu[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedCpu) => [pageCpu, relatedCpu]);

    return { comparisons } as RelatedCpuComparisons;
  }
}
