import { Injectable } from '@nestjs/common';
import {
  HomeViewModel,
  ListCpusFilter,
  ListGpusFilter,
  ListSort,
  MarketSegment,
  ProductComparison,
  ProductType,
} from '@pcpartdb/shared';
import { Database } from '../../database';
import { ProductService } from '../../product/product.service';
import { CacheService, CacheType } from '../../shared/cache/cache.service';
import { Context } from '../../shared/context';

const RANDOMLY_CHOOSE_FROM_COMPARISON = 5;

const NVIDIA_GPU_FILTER: ListGpusFilter = {
  company: ['nvidia'],
  segment: [MarketSegment.Desktop],
  isChipset: true,
};
const AMD_GPU_FILTER: ListGpusFilter = {
  company: ['amd'],
  segment: [MarketSegment.Desktop],
  isChipset: true,
};

const INTEL_CPU_FILTER: ListCpusFilter = {
  company: ['intel'],
  segment: [MarketSegment.Desktop],
};
const AMD_CPU_FILTER: ListCpusFilter = {
  company: ['amd'],
  segment: [MarketSegment.Desktop],
};

@Injectable()
export class HomeViewModelService {
  constructor(
    private db: Database,
    private productService: ProductService,
    private cacheService: CacheService,
  ) {}

  async viewModel(ctx: Context) {
    return await this.cacheService.cache(
      async () => {
        console.time('HomeViewModelService');
        console.time('HomeViewModelService.getNvidiaVsAmdGpus');
        const nvidiaVsAmdGpus = await this.getNvidiaVsAmdGpus(ctx);
        console.timeEnd('HomeViewModelService.getNvidiaVsAmdGpus');
        console.time('HomeViewModelService.getPopularGpus');
        const popularGpus = await this.getPopularGpus(ctx);
        console.timeEnd('HomeViewModelService.getPopularGpus');
        console.time('HomeViewModelService.getIntelVsAmdCpus');
        const intelVsAmdCpus = await this.getIntelVsAmdCpus(ctx);
        console.timeEnd('HomeViewModelService.getIntelVsAmdCpus');
        console.time('HomeViewModelService.getPopularCpus');
        const popularCpus = await this.getPopularCpus(ctx);
        console.timeEnd('HomeViewModelService.getPopularCpus');
        console.timeEnd('HomeViewModelService');

        return {
          nvidiaVsAmdGpus,
          popularGpus,
          intelVsAmdCpus,
          popularCpus,
        } as HomeViewModel;
      },
      { type: CacheType.Home, key: {} },
    );
  }

  private async getNvidiaVsAmdGpus(ctx: Context) {
    const performanceNvidia = await this.getPerformanceGpu(
      NVIDIA_GPU_FILTER,
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const performanceAmd = await this.getPerformanceGpu(
      AMD_GPU_FILTER,
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const performanceComp: ProductComparison = [
      performanceNvidia,
      performanceAmd,
    ];

    const valueNvidia = await this.getValueGpu(
      NVIDIA_GPU_FILTER,
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const valueAmd = await this.getValueGpu(
      AMD_GPU_FILTER,
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const valueComp: ProductComparison = [valueNvidia, valueAmd];

    const randomNvidia = await this.getPerformanceGpu(
      {
        ...NVIDIA_GPU_FILTER,
        excludeIds: [performanceNvidia.id, valueNvidia.id],
      },
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const randomAmd = await this.getPerformanceGpu(
      { ...AMD_GPU_FILTER, excludeIds: [performanceAmd.id, valueAmd.id] },
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const randomComp: ProductComparison = [randomNvidia, randomAmd];

    return [performanceComp, valueComp, randomComp].filter(
      ([gpu1, gpu2]) => gpu1 != null && gpu2 != null,
    );
  }

  private async getPopularGpus(ctx: Context) {
    const gpu1 = await this.getPerformanceGpu(
      { segment: [MarketSegment.Desktop] },
      5,
      ctx,
    );
    const gpu2 = await this.getValueGpu(
      { segment: [MarketSegment.Desktop], excludeIds: [gpu1.id] },
      5,
      ctx,
    );
    const gpu3 = await this.getPerformanceGpu(
      {
        segment: [MarketSegment.Desktop],
        excludeIds: [gpu1.id, gpu2.id],
      },
      5,
      ctx,
    );

    return [gpu1, gpu2, gpu3].filter((gpu) => gpu != null);
  }

  private async getIntelVsAmdCpus(ctx: Context): Promise<ProductComparison[]> {
    const performanceIntel = await this.getPerformanceCpu(
      INTEL_CPU_FILTER,
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const performanceAmd = await this.getPerformanceCpu(
      AMD_CPU_FILTER,
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const performanceComp: ProductComparison = [
      performanceIntel,
      performanceAmd,
    ];

    const valueIntel = await this.getValueCpu(
      INTEL_CPU_FILTER,
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const valueAmd = await this.getValueCpu(
      AMD_CPU_FILTER,
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const valueComp: ProductComparison = [valueIntel, valueAmd];

    const randomIntel = await this.getPerformanceCpu(
      { ...INTEL_CPU_FILTER, excludeIds: [performanceIntel.id, valueIntel.id] },
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const randomAmd = await this.getPerformanceCpu(
      { ...AMD_CPU_FILTER, excludeIds: [performanceAmd.id, valueAmd.id] },
      RANDOMLY_CHOOSE_FROM_COMPARISON,
      ctx,
    );
    const randomComp: ProductComparison = [randomIntel, randomAmd];

    return [performanceComp, valueComp, randomComp].filter(
      ([cpu1, cpu2]) => cpu1 != null && cpu2 != null,
    );
  }

  private async getPopularCpus(ctx: Context) {
    const cpu1 = await this.getPerformanceCpu(
      { segment: [MarketSegment.Desktop] },
      5,
      ctx,
    );
    const cpu2 = await this.getValueCpu(
      { segment: [MarketSegment.Desktop], excludeIds: [cpu1.id] },
      5,
      ctx,
    );
    const cpu3 = await this.getPerformanceCpu(
      {
        segment: [MarketSegment.Desktop],
        excludeIds: [cpu1.id, cpu2.id],
      },
      5,
      ctx,
    );

    return [cpu1, cpu2, cpu3].filter((cpu) => cpu != null);
  }

  private async getPerformanceGpu(
    filter: ListGpusFilter,
    chooseFrom: number,
    ctx: Context,
  ) {
    const response = await this.db.transaction(
      () =>
        this.productService.list(
          {
            productType: ProductType.Gpu,
            query: {
              filter: {
                ...filter,
                performanceRated: true,
              },
              orderBy: { sort: ListSort.PerformanceRating },
              pagination: { limit: chooseFrom },
            },
          },
          {},
          ctx,
        ),
      { ctx, isolationLevel: 'ReadUncommitted' },
    );
    const results = response.results;

    const idx = Math.floor(Math.random() * results.length);
    return results[idx];
  }

  private async getValueGpu(
    filter: ListGpusFilter,
    chooseFrom: number,
    ctx: Context,
  ) {
    const response = await this.db.transaction(
      () =>
        this.productService.list(
          {
            productType: ProductType.Gpu,
            query: {
              filter: {
                ...filter,
                valueRated: true,
              },
              orderBy: { sort: ListSort.PerformancePerMsrp },
              pagination: { limit: chooseFrom },
            },
          },
          {},
          ctx,
        ),
      { ctx, isolationLevel: 'ReadUncommitted' },
    );
    const results = response.results;

    const idx = Math.floor(Math.random() * results.length);
    return results[idx];
  }

  private async getPerformanceCpu(
    filter: ListCpusFilter,
    chooseFrom: number,
    ctx: Context,
  ) {
    const response = await this.db.transaction(
      () =>
        this.productService.list(
          {
            productType: ProductType.Cpu,
            query: {
              filter: {
                ...filter,
                performanceRated: true,
              },
              orderBy: { sort: ListSort.PerformanceRating },
              pagination: { limit: chooseFrom },
            },
          },
          {},
          ctx,
        ),
      { ctx, isolationLevel: 'ReadUncommitted' },
    );
    const results = response.results;

    const idx = Math.floor(Math.random() * results.length);
    return results[idx];
  }

  private async getValueCpu(
    filter: ListCpusFilter,
    chooseFrom: number,
    ctx: Context,
  ) {
    const response = await this.db.transaction(
      () =>
        this.productService.list(
          {
            productType: ProductType.Cpu,
            query: {
              filter: {
                ...filter,
                valueRated: true,
              },
              orderBy: { sort: ListSort.PerformancePerMsrp },
              pagination: { limit: chooseFrom },
            },
          },
          {},
          ctx,
        ),
      { ctx, isolationLevel: 'ReadUncommitted' },
    );
    const results = response.results;

    const idx = Math.floor(Math.random() * results.length);
    return results[idx];
  }
}
