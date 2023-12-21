import { Injectable } from '@nestjs/common';
import {
  buildRelatedProductKey,
  CpuContentData,
  CpuProduct,
  getPreferredBenchmark,
  ListOrder,
  ListSort,
  preferredBenchmarkOrDefault,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  ProductType,
  RelatedProductType,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import * as uuid from 'uuid';
import { Database } from '../../database';
import { ProductService } from '../../product/product.service';
import { CacheService, CacheType } from '../../shared/cache/cache.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class ViewCpuViewModelService {
  constructor(
    private db: Database,
    private productService: ProductService,
    private cacheService: CacheService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    const timer = `ViewCpuViewModelService (${uuid.v4()})`;
    console.time(timer);

    const preferredBenchmark = preferredBenchmarkOrDefault(
      ProductType.Cpu,
      ctx.config?.userSettings?.preferredBenchmarks?.[ProductType.Cpu],
    ).toLowerCase();

    const viewModel = await this.cacheService.cache(
      async () => {
        const [cpu, bestPerformanceCpu, bestValueCpu] = await Promise.all([
          this.getCpu(slug, ctx),
          this.getBestPerformanceCpu(ctx),
          this.getBestValueCpu(ctx),
        ]);

        const relativePerformanceCpus = await this.getRelativePerformanceCpus(
          cpu,
          ctx,
        );
        const relativeValueCpus = await this.getRelativeValueCpus(cpu, ctx);

        const relatedCpus = await this.getRelatedCpus(
          5,
          relativePerformanceCpus,
          relativeValueCpus,
          cpu,
        );
        const relatedComparisons = await this.getRelatedComparisons(
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
    const cpu = await this.db.transaction(
      () =>
        this.productService.getBySlug(
          {
            productType: ProductType.Cpu,
            slug,

            includeParent: false,
            includeChildren: false,
            includeAutomation: false,
            includeBenchmarks: true,
            includeImages: true,
            includeSources: false,
            includeUpdates: false,

            includeRanks: true,

            includeRelated: true,
            includeRelatedBenchmarks: [
              getPreferredBenchmark(ctx.config?.userSettings, ProductType.Cpu),
            ],
            includeRelatedRanks: true,
          },
          ctx,
        ),
      { ctx, isolationLevel: 'ReadCommitted' },
    );
    return cpu as CpuProduct;
  }

  private async getRelativePerformanceCpus(seed: CpuProduct, ctx: Context) {
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

  private async getRelativeValueCpus(seed: CpuProduct, ctx: Context) {
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

  private async getRelatedCpus(
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

  private async getRelatedComparisons(
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
    return await this.db.transaction(
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
            includeBenchmarks: [
              getPreferredBenchmark(ctx.config?.userSettings, ProductType.Cpu),
            ],
          },
          ctx,
        );
        return (response.results?.[0] || null) as CpuProduct;
      },
      { ctx, isolationLevel: 'ReadCommitted' },
    );
  }

  private async getBestValueCpu(ctx: Context) {
    return await this.db.transaction(
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
            includeBenchmarks: [
              getPreferredBenchmark(ctx.config?.userSettings, ProductType.Cpu),
            ],
          },
          ctx,
        );
        return (response.results?.[0] || null) as CpuProduct;
      },
      { ctx, isolationLevel: 'ReadCommitted' },
    );
  }
}
