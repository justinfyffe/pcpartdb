import { Injectable } from '@nestjs/common';
import {
  buildRelatedProductKey,
  CpuContentData,
  CpuProduct,
  getPreferredBenchmark,
  ListOrder,
  ListSort,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  ProductType,
  RelatedProductType,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import * as uuid from 'uuid';
import { ProductService } from '../../product/product.service';
import { CacheService, CacheType } from '../../shared/cache/cache.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class ViewCpuViewModelService {
  constructor(
    private productService: ProductService,
    private cacheService: CacheService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    const timer = `ViewCpuViewModelService (${uuid.v4()})`;
    console.time(timer);

    const preferredBenchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
    );

    const viewModel = await this.cacheService.cache(
      async () => {
        const [cpu, bestPerformanceCpu, bestValueCpu] = await Promise.all([
          this.getCpu(slug, ctx),
          this.getBestPerformanceCpu(ctx),
          this.getBestValueCpu(ctx),
        ]);

        const relativePerformanceCpus = this.getRelativePerformanceCpus(
          cpu,
          ctx,
        );
        const relativeValueCpus = this.getRelativeValueCpus(cpu, ctx);

        const relatedCpus = this.getRelatedCpus(
          5,
          relativePerformanceCpus,
          relativeValueCpus,
          cpu,
        );
        const relatedComparisons = this.getRelatedComparisons(
          5,
          relativePerformanceCpus,
          relativeValueCpus,
          cpu,
        );

        const contentData: CpuContentData = {
          bestPerformanceCpu,
          bestValueCpu,
        };

        return {
          cpu,

          relativePerformanceCpus,
          relativeValueCpus,

          relatedCpus,
          relatedCpuComparisons: relatedComparisons,

          contentData,
        } as ViewCpuViewModel;
      },
      {
        type: CacheType.CpuProduct,
        key: `viewModel__${slug}__benchmark_${preferredBenchmark}`,
      },
    );
    console.timeEnd(timer);

    return viewModel;
  }

  private async getCpu(slug: string, ctx: Context) {
    const preferredBenchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
    );
    const cpu = await this.productService.getBySlug(
      {
        productType: ProductType.Cpu,
        slug,

        includeAutomation: false,
        includeImages: true,
        includeSources: false,
        includeUpdates: false,

        includeParent: false,

        includeRelated: true,

        includeBenchmarks: true,
        includeRelatedBenchmarks: [preferredBenchmark],

        includeRanks: [preferredBenchmark],
        includeRelatedRanks: [preferredBenchmark],

        relatedFields: [],
      },
      ctx,
    );
    return cpu as CpuProduct;
  }

  private getRelativePerformanceCpus(seed: CpuProduct, ctx: Context) {
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
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
        ) as Partial<CpuProduct>[]) ?? [];

    return getSurroundingValues(
      relative,
      relative.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    ).sort(
      (p1, p2) =>
        productBenchmarkValue(p2, benchmark) -
        productBenchmarkValue(p1, benchmark),
    );
  }

  private getRelativeValueCpus(seed: CpuProduct, ctx: Context) {
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
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
        ) as Partial<CpuProduct>[]) ?? [];

    return getSurroundingValues(
      relative,
      relative.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    ).sort(
      (p1, p2) =>
        productBenchmarkValuePerMsrp(p2, benchmark) -
        productBenchmarkValuePerMsrp(p1, benchmark),
    );
  }

  private getRelatedCpus(
    total: number,
    performanceCpus: Partial<CpuProduct>[],
    valueCpus: Partial<CpuProduct>[],
    excludeCpu: Partial<CpuProduct>,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Partial<CpuProduct>>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(excludeCpu.id);

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
    pageCpu: Partial<CpuProduct>,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Partial<CpuProduct>>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(pageCpu.id);

    const related: Partial<CpuProduct>[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedCpu) => [pageCpu, relatedCpu]);
    return comparisons;
  }

  private async getBestPerformanceCpu(ctx: Context) {
    const preferredBenchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
    );
    const bestPerformanceCacheKey = `bestPerformanceCpu__${preferredBenchmark}`;

    const result = this.cacheService.cache(
      async () => {
        const response = await this.productService.list(
          {
            query: {
              filter: { productType: ProductType.Cpu },
              orderBy: {
                sort: ListSort.PerformanceRating,
                order: ListOrder.Desc,
              },
              pagination: { limit: 1 },
            },
          },
          {
            skipCount: true,
            includeBenchmarks: [preferredBenchmark],
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
    const preferredBenchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
    );
    const bestValueCacheKey = `bestValueCpu__${preferredBenchmark}`;

    const result = this.cacheService.cache(
      async () => {
        const response = await this.productService.list(
          {
            query: {
              filter: { productType: ProductType.Cpu },
              orderBy: {
                sort: ListSort.PerformancePerMsrp,
                order: ListOrder.Desc,
              },
              pagination: { limit: 1 },
            },
          },
          {
            skipCount: true,
            includeBenchmarks: [preferredBenchmark],
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
