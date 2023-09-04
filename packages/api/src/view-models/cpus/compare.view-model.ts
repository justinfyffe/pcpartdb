import { Injectable } from '@nestjs/common';
import {
  CompareCpusContentData,
  CompareCpusViewModel,
  Cpu,
  CpuComparison,
  hasProductFieldValue,
  ListCpusOrder,
  ListCpusSort,
  RelatedCpuComparisons,
  RelatedCpus,
} from '@pcpartdb/shared';
import { CpuService } from '../../product/cpu/cpu.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class CompareCpusViewModelService {
  constructor(private cpuService: CpuService) {}

  async viewModel(slug: string, ctx: Context) {
    const comparison = await this.getComparison(slug, ctx);
    const contentData = await this.getContentData(comparison, ctx);

    const relatedCpus = await this.getRelatedCpus(
      3,
      contentData.relativePerformanceCpus,
      contentData.relativeValueCpus,
      comparison,
    );
    const relatedComparisons = await this.getRelatedComparisons(
      3,
      contentData.relativePerformanceCpus,
      contentData.relativeValueCpus,
      comparison,
    );

    return {
      comparison,
      contentData,
      relatedCpus,
      relatedComparisons,
    } as CompareCpusViewModel;
  }

  private async getComparison(slug: string, ctx: Context) {
    return await this.cpuService.getComparison(
      {
        slug,
        includeImages: true,
        includeRanks: ['performanceRank', 'valueRank'],
      },
      ctx,
    );
  }

  private async getContentData(comparison: CpuComparison, ctx: Context) {
    return {
      relativePerformanceCpus: await this.getRelativePerformanceCpus(
        comparison,
        ctx,
      ),
      relativeValueCpus: await this.getRelativeValueCpus(comparison, ctx),
    } as CompareCpusContentData;
  }

  private async getRelativePerformanceCpus(
    comparison: CpuComparison,
    ctx: Context,
  ) {
    const [cpu1, cpu2] = comparison;
    const neighbors1 = await this.getPerformanceNeighbors(cpu1, ctx);
    const neighbors2 = await this.getPerformanceNeighbors(cpu2, ctx);

    // At least one CPU has no neighbors (missing rank)
    if (neighbors1.length === 0 && neighbors2.length === 0) {
      return [];
    }
    if (neighbors1.length === 0 || neighbors2.length === 0) {
      const neighbors = [...neighbors1, ...neighbors2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex((cpu) => cpu.id === cpu1.id || cpu.id === cpu2.id),
        TOTAL_COMPARED_CPUS,
      );
    }

    // Both CPUS have neighbors
    const hasGapBetweenNeighbors =
      Math.abs(cpu1.ranks?.performanceRank - cpu2.ranks?.performanceRank) >
      TOTAL_COMPARED_CPUS / 2 + 1;

    if (hasGapBetweenNeighbors) {
      return this.concatNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) => c1.ranks?.performanceRank - c2.ranks?.performanceRank,
      );
    } else {
      return this.mergeNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) => c1.ranks?.performanceRank - c2.ranks?.performanceRank,
      );
    }
  }

  private async getRelativeValueCpus(comparison: CpuComparison, ctx: Context) {
    const [cpu1, cpu2] = comparison;
    const neighbors1 = await this.getValueNeighbors(cpu1, ctx);
    const neighbors2 = await this.getValueNeighbors(cpu2, ctx);

    // At least one CPU has no neighbors (missing rank)
    if (neighbors1.length === 0 && neighbors2.length === 0) {
      return [];
    }
    if (neighbors1.length === 0 || neighbors2.length === 0) {
      const neighbors = [...neighbors1, ...neighbors2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex((cpu) => cpu.id === cpu1.id || cpu.id === cpu2.id),
        TOTAL_COMPARED_CPUS,
      );
    }

    // Both CPUs have neighbors. Need to combine them.
    const hasGapBetweenNeighbors =
      Math.abs(cpu1.ranks?.valueRank - cpu2.ranks?.valueRank) >
      TOTAL_COMPARED_CPUS / 2 + 1;

    if (hasGapBetweenNeighbors) {
      return this.concatNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) => c1.ranks?.valueRank - c2.ranks?.valueRank,
      );
    } else {
      return this.mergeNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) => c1.ranks?.valueRank - c2.ranks?.valueRank,
      );
    }
  }

  private async getPerformanceNeighbors(cpu: Cpu, ctx: Context) {
    // Missing value. Cannot have neighbors.
    if (!hasProductFieldValue(cpu.performanceScore)) {
      return [];
    }

    const above = await this.cpuService.list(
      {
        query: {
          filter: {
            segment: hasProductFieldValue(cpu.marketSegment)
              ? [cpu.marketSegment.value]
              : [],
            excludeIds: [cpu.id],
            minPerformanceScore: cpu.performanceScore?.value,
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
            segment: hasProductFieldValue(cpu.marketSegment)
              ? [cpu.marketSegment.value]
              : [],
            excludeIds: [cpu.id],
            maxPerformanceScore: cpu.performanceScore?.value,
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

    return [
      ...new Map([...above, cpu, ...below].map((n) => [n.id, n])).values(),
    ].sort(
      (cpu1, cpu2) =>
        cpu2.performanceScore?.value - cpu1.performanceScore?.value,
    );
  }

  private async getValueNeighbors(cpu: Cpu, ctx: Context) {
    // Missing value. Cannot have neighbors.
    if (!hasProductFieldValue(cpu.valueScore)) {
      return [];
    }

    const above = await this.cpuService.list(
      {
        query: {
          filter: {
            segment: hasProductFieldValue(cpu.marketSegment)
              ? [cpu.marketSegment.value]
              : [],
            excludeIds: [cpu.id],
            minValueScore: cpu.valueScore?.value,
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
            segment: hasProductFieldValue(cpu.marketSegment)
              ? [cpu.marketSegment.value]
              : [],
            excludeIds: [cpu.id],
            maxValueScore: cpu.valueScore?.value,
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

    return [
      ...new Map([...above, cpu, ...below].map((n) => [n.id, n])).values(),
    ].sort((cpu1, cpu2) => cpu2.valueScore?.value - cpu1.valueScore?.value);
  }

  private concatNeighbors(
    comparison: CpuComparison,
    neighbors1: Cpu[],
    neighbors2: Cpu[],
    compareFn: (cpu1: Cpu, cpu2: Cpu) => number,
  ) {
    const [cpu1, cpu2] = comparison;

    // Get the nearest neighbors for both CPUs
    const surrounding1 = getSurroundingValues(
      neighbors1,
      neighbors1.findIndex((cpu) => cpu.id === cpu1.id),
      TOTAL_COMPARED_CPUS / 2,
    );
    const surrounding2 = getSurroundingValues(
      neighbors2,
      neighbors2.findIndex((cpu) => cpu.id === cpu2.id),
      TOTAL_COMPARED_CPUS / 2,
    );

    // Combine them and sort.
    return [...surrounding1, ...surrounding2].sort(compareFn);
  }

  private mergeNeighbors(
    comparison: CpuComparison,
    neighbors1: Cpu[],
    neighbors2: Cpu[],
    compareFn: (cpu1: Cpu, cpu2: Cpu) => number,
  ) {
    const [cpu1, cpu2] = comparison;

    // Get the nearest neighbors for both CPUs
    const surrounding1 = getSurroundingValues(
      neighbors1,
      neighbors1.findIndex((cpu) => cpu.id === cpu1.id),
      TOTAL_COMPARED_CPUS,
    );
    const surrounding2 = getSurroundingValues(
      neighbors2,
      neighbors2.findIndex((cpu) => cpu.id === cpu2.id),
      TOTAL_COMPARED_CPUS,
    );

    // Combine the nearest neighbors. Factor in that they may overlap.
    const set = [...surrounding1, ...surrounding2].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Cpu>);
    const merged = Object.values(set).sort(compareFn);

    // Find the middle point between the two CPUs that are being compared.
    const idx1 = merged.findIndex((cpu) => cpu.id === cpu1.id);
    const idx2 = merged.findIndex((cpu) => cpu.id === cpu2.id);
    const pivot = Math.ceil((idx1 + idx2) / 2);

    // Find the CPUs surrounding the middle point.
    return getSurroundingValues(merged, pivot, TOTAL_COMPARED_CPUS);
  }

  private async getRelatedCpus(
    total: number,
    performanceCpus: Cpu[],
    valueCpus: Cpu[],
    excludeCpus: Cpu[],
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Cpu>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    excludeCpus.forEach((cpu) => set.delete(cpu.id));

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
    pageComparison: CpuComparison,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Cpu>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    pageComparison.forEach((cpu) => set.delete(cpu.id));

    const related: Cpu[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedCpu, i) => [
      pageComparison[i % 2],
      relatedCpu,
    ]);

    return { comparisons } as RelatedCpuComparisons;
  }
}
