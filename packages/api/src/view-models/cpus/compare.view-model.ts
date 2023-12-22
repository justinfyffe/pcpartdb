import { Injectable } from '@nestjs/common';
import {
  buildRelatedProductKey,
  CompareCpusViewModel,
  CpuContentData,
  CpuProduct,
  CpuProductComparison,
  getPreferredBenchmark,
  ListOrder,
  ListSort,
  preferredBenchmarkOrDefault,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  ProductType,
  RelatedProductType,
} from '@pcpartdb/shared';
import * as uuid from 'uuid';
import { Database } from '../../database';
import { ProductService } from '../../product/product.service';
import { CacheService, CacheType } from '../../shared/cache/cache.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class CompareCpusViewModelService {
  constructor(
    private db: Database,
    private productService: ProductService,
    private cacheService: CacheService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    const timer = `CompareCpusViewModelService (${uuid.v4()})`;
    console.time(timer);

    const preferredBenchmark = preferredBenchmarkOrDefault(
      ProductType.Cpu,
      ctx.config?.userSettings?.preferredBenchmarks?.[ProductType.Cpu],
    ).toLowerCase();

    const viewModel = await this.cacheService.cache(
      async () => {
        const [comparison, bestPerformanceCpu, bestValueCpu] =
          await Promise.all([
            this.getComparison(slug, ctx),
            this.getBestPerformanceCpu(ctx),
            this.getBestValueCpu(ctx),
          ]);

        const relativePerformanceCpus = this.getRelativePerformanceCpus(
          comparison[0],
          comparison[1],
          ctx,
        );

        const relativeValueCpus = this.getRelativeValueCpus(
          comparison[0],
          comparison[1],
          ctx,
        );

        const relatedCpus = this.getRelatedCpus(
          5,
          relativePerformanceCpus,
          relativeValueCpus,
          comparison,
        );
        const relatedComparisons = this.getRelatedComparisons(
          5,
          relativePerformanceCpus,
          relativeValueCpus,
          comparison,
        );

        const contentData: CpuContentData = {
          bestPerformanceCpu,
          bestValueCpu,
        };

        return {
          comparison,

          relativePerformanceCpus,
          relativeValueCpus,

          relatedCpus,
          relatedCpuComparisons: relatedComparisons,

          contentData,
        } as CompareCpusViewModel;
      },
      {
        type: CacheType.CpuComparison,
        key: `viewModel__${slug}__benchmark_${preferredBenchmark}`,
      },
    );
    console.timeEnd(timer);

    return viewModel;
  }

  private async getComparison(slug: string, ctx: Context) {
    const comparison = await this.productService.getComparison(
      {
        productType: ProductType.Cpu,
        slug,

        includeAutomation: false,
        includeBenchmarks: true,
        includeImages: true,
        includeRanks: true,
        includeSources: false,
        includeUpdates: false,

        includeParent: false,

        includeRelated: true,
        includeRelatedBenchmarks: [
          getPreferredBenchmark(ctx.config?.userSettings, ProductType.Cpu),
        ],
        includeRelatedRanks: true,

        relatedFields: [],
      },
      ctx,
    );
    return comparison as CpuProductComparison;
  }

  private getRelativePerformanceCpus(
    seed1: CpuProduct,
    seed2: CpuProduct,
    ctx: Context,
  ) {
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
    );

    const relatedProductKey = buildRelatedProductKey({
      type: RelatedProductType.Performance,
      benchmark,
    });
    const relative1 =
      (seed1.relatedProducts?.[relatedProductKey]
        ?.filter((p) => productBenchmarkValue(p, benchmark) != null)
        .sort(
          (p1, p2) =>
            productBenchmarkValue(p2, benchmark) -
            productBenchmarkValue(p1, benchmark),
        ) as Partial<CpuProduct>[]) ?? [];
    const relative2 =
      (seed2.relatedProducts?.[relatedProductKey]
        ?.filter((p) => productBenchmarkValue(p, benchmark) != null)
        .sort(
          (p1, p2) =>
            productBenchmarkValue(p2, benchmark) -
            productBenchmarkValue(p1, benchmark),
        ) as Partial<CpuProduct>[]) ?? [];

    // At least one cpu has no neighbors (missing rank)
    if (relative1.length === 0 && relative2.length === 0) {
      return [];
    }
    if (relative1.length === 0 || relative2.length === 0) {
      const neighbors = [...relative1, ...relative2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex(
          (cpu) => cpu.id === seed1.id || cpu.id === seed2.id,
        ),
        TOTAL_COMPARED_CPUS,
      );
    }

    // Both cpus have neighbors
    const hasNoGap =
      relative1.find((p) => p.id === seed2.id) ||
      relative2.find((p) => p.id === seed1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (p1, p2) =>
          productBenchmarkValue(p2, benchmark) -
          productBenchmarkValue(p1, benchmark),
      );
    } else {
      return this.concatNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (p1, p2) =>
          productBenchmarkValue(p2, benchmark) -
          productBenchmarkValue(p1, benchmark),
      );
    }
  }

  private getRelativeValueCpus(
    seed1: CpuProduct,
    seed2: CpuProduct,
    ctx: Context,
  ) {
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
    );

    const relatedProductKey = buildRelatedProductKey({
      type: RelatedProductType.Value,
      benchmark,
    });
    const relative1 =
      (seed1.relatedProducts?.[relatedProductKey]
        ?.filter((p) => productBenchmarkValuePerMsrp(p, benchmark) != null)
        .sort(
          (p1, p2) =>
            productBenchmarkValuePerMsrp(p2, benchmark) -
            productBenchmarkValuePerMsrp(p1, benchmark),
        ) as Partial<CpuProduct>[]) ?? [];
    const relative2 =
      (seed2.relatedProducts?.[relatedProductKey]
        ?.filter((p) => productBenchmarkValuePerMsrp(p, benchmark) != null)
        .sort(
          (p1, p2) =>
            productBenchmarkValuePerMsrp(p2, benchmark) -
            productBenchmarkValuePerMsrp(p1, benchmark),
        ) as Partial<CpuProduct>[]) ?? [];

    // At least one cpu has no neighbors (missing rank)
    if (relative1.length === 0 && relative2.length === 0) {
      return [];
    }
    if (relative1.length === 0 || relative2.length === 0) {
      const neighbors = [...relative1, ...relative2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex(
          (cpu) => cpu.id === seed1.id || cpu.id === seed2.id,
        ),
        TOTAL_COMPARED_CPUS,
      );
    }

    // Both cpus have neighbors
    const hasNoGap =
      relative1.find((p) => p.id === seed2.id) ||
      relative2.find((p) => p.id === seed1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (p1, p2) =>
          productBenchmarkValuePerMsrp(p2, benchmark) -
          productBenchmarkValuePerMsrp(p1, benchmark),
      );
    } else {
      return this.concatNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (p1, p2) =>
          productBenchmarkValuePerMsrp(p2, benchmark) -
          productBenchmarkValuePerMsrp(p1, benchmark),
      );
    }
  }

  private concatNeighbors(
    comparison: CpuProductComparison,
    neighbors1: Partial<CpuProduct>[],
    neighbors2: Partial<CpuProduct>[],
    compareFn: (cpu1: Partial<CpuProduct>, cpu2: Partial<CpuProduct>) => number,
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
    const set = [...surrounding1, ...surrounding2].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Partial<CpuProduct>>);
    return Object.values(set).sort(compareFn);
  }

  private mergeNeighbors(
    comparison: CpuProductComparison,
    neighbors1: Partial<CpuProduct>[],
    neighbors2: Partial<CpuProduct>[],
    compareFn: (cpu1: Partial<CpuProduct>, cpu2: Partial<CpuProduct>) => number,
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
    }, {} as Record<number, Partial<CpuProduct>>);
    const merged = Object.values(set).sort(compareFn);

    // Find the middle point between the two CPUs that are being compared.
    const idx1 = merged.findIndex((cpu) => cpu.id === cpu1.id);
    const idx2 = merged.findIndex((cpu) => cpu.id === cpu2.id);
    const pivot = Math.ceil((idx1 + idx2) / 2);

    // Find the CPUs surrounding the middle point.
    return getSurroundingValues(merged, pivot, TOTAL_COMPARED_CPUS);
  }

  private getRelatedCpus(
    total: number,
    performanceCpus: Partial<CpuProduct>[],
    valueCpus: Partial<CpuProduct>[],
    excludeCpus: Partial<CpuProduct>[],
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Partial<CpuProduct>>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    excludeCpus.forEach((cpu) => set.delete(cpu.id));

    const related: Partial<CpuProduct>[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    return related;
  }

  private getRelatedComparisons(
    total: number,
    performanceCpus: Partial<CpuProduct>[],
    valueCpus: Partial<CpuProduct>[],
    pageComparison: CpuProductComparison,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Partial<CpuProduct>>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    pageComparison.forEach((cpu) => set.delete(cpu.id));

    const related: Partial<CpuProduct>[] = [];
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

    return comparisons;
  }

  private async getBestPerformanceCpu(ctx: Context) {
    const preferredBenchmark = preferredBenchmarkOrDefault(
      ProductType.Cpu,
      ctx.config?.userSettings?.preferredBenchmarks?.[ProductType.Cpu],
    ).toLowerCase();
    const bestPerformanceCacheKey = `bestPerformanceCpu__${preferredBenchmark}`;

    const result = this.cacheService.cache(
      async () => {
        const response = await this.productService.list(
          {
            productType: ProductType.Cpu,
            query: {
              filter: {},
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
              getPreferredBenchmark(ctx.config?.userSettings, ProductType.Cpu),
            ],
            fields: [],
          },
          ctx,
        );
        return (response.results?.[0] || null) as CpuProduct;
      },
      {
        type: CacheType.BestCpuProduct,
        key: bestPerformanceCacheKey,
        excludeFromMaxItems: true,
      },
    );
    return result;
  }

  private async getBestValueCpu(ctx: Context) {
    const preferredBenchmark = preferredBenchmarkOrDefault(
      ProductType.Cpu,
      ctx.config?.userSettings?.preferredBenchmarks?.[ProductType.Cpu],
    ).toLowerCase();
    const bestValueCacheKey = `bestValueCpu__${preferredBenchmark}`;

    const result = this.cacheService.cache(
      async () => {
        const response = await this.productService.list(
          {
            productType: ProductType.Cpu,
            query: {
              filter: {},
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
              getPreferredBenchmark(ctx.config?.userSettings, ProductType.Cpu),
            ],
            fields: [],
          },
          ctx,
        );
        return (response.results?.[0] || null) as CpuProduct;
      },
      {
        type: CacheType.BestCpuProduct,
        key: bestValueCacheKey,
        excludeFromMaxItems: true,
      },
    );
    return result;
  }
}
