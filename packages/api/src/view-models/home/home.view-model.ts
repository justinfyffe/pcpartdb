import { Injectable } from '@nestjs/common';
import {
  HomeViewModel,
  ListCpusFilter,
  ListCpusSort,
  ListGpusFilter,
  ListGpusSort,
  ProductComparison,
} from '@pcpartdb/shared';
import { CpuService } from '../../product/cpu/cpu.service';
import { GpuService } from '../../product/gpu/gpu.service';
import { Context } from '../../shared/context';

const RANDOMLY_CHOOSE_FROM_COMPARISON = 5;

const NVIDIA_GPU_FILTER: ListGpusFilter = { company: ['nvidia'] };
const AMD_GPU_FILTER: ListGpusFilter = { company: ['amd'] };

const INTEL_CPU_FILTER: ListCpusFilter = { company: ['intel'] };
const AMD_CPU_FILTER: ListCpusFilter = { company: ['amd'] };

@Injectable()
export class HomeViewModelService {
  constructor(private gpuService: GpuService, private cpuService: CpuService) {}

  async viewModel(ctx: Context) {
    const nvidiaVsAmdGpus = await this.getNvidiaVsAmdGpus(ctx);
    const popularGpus = await this.getPopularGpus(ctx);
    const intelVsAmdCpus = await this.getIntelVsAmdCpus(ctx);
    const popularCpus = await this.getPopularCpus(ctx);

    return {
      nvidiaVsAmdGpus,
      popularGpus,
      intelVsAmdCpus,
      popularCpus,
    } as HomeViewModel;
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
    const gpu1 = await this.getPerformanceGpu({}, 5, ctx);
    const gpu2 = await this.getValueGpu({ excludeIds: [gpu1.id] }, 5, ctx);
    const gpu3 = await this.getPerformanceGpu(
      { excludeIds: [gpu1.id, gpu2.id] },
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
    const cpu1 = await this.getPerformanceCpu({}, 5, ctx);
    const cpu2 = await this.getValueCpu({ excludeIds: [cpu1.id] }, 5, ctx);
    const cpu3 = await this.getPerformanceCpu(
      { excludeIds: [cpu1.id, cpu2.id] },
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
    const bestPerformance =
      (await this.gpuService.list(
        {
          query: {
            filter: {
              ...filter,
              performanceRated: true,
            },
            orderBy: { sort: ListGpusSort.PerformanceRating },
            pagination: { limit: chooseFrom },
          },
          includeImages: true,
        },
        ctx,
      )) || [];

    const idx = Math.floor(Math.random() * bestPerformance.length);
    return bestPerformance[idx];
  }

  private async getValueGpu(
    filter: ListGpusFilter,
    chooseFrom: number,
    ctx: Context,
  ) {
    const bestPerformance =
      (await this.gpuService.list(
        {
          query: {
            filter: {
              ...filter,
              valueRated: true,
            },
            orderBy: { sort: ListGpusSort.ValueRating },
            pagination: { limit: chooseFrom },
          },
          includeImages: true,
        },
        ctx,
      )) || [];

    const idx = Math.floor(Math.random() * bestPerformance.length);
    return bestPerformance[idx];
  }

  private async getPerformanceCpu(
    filter: ListCpusFilter,
    chooseFrom: number,
    ctx: Context,
  ) {
    const bestPerformance =
      (await this.cpuService.list(
        {
          query: {
            filter: {
              ...filter,
              performanceRated: true,
            },
            orderBy: { sort: ListCpusSort.PerformanceRating },
            pagination: { limit: chooseFrom },
          },
          includeImages: true,
        },
        ctx,
      )) || [];

    const idx = Math.floor(Math.random() * bestPerformance.length);
    return bestPerformance[idx];
  }

  private async getValueCpu(
    filter: ListCpusFilter,
    chooseFrom: number,
    ctx: Context,
  ) {
    const bestPerformance =
      (await this.cpuService.list(
        {
          query: {
            filter: {
              ...filter,
              valueRated: true,
            },
            orderBy: { sort: ListCpusSort.ValueRating },
            pagination: { limit: chooseFrom },
          },
          includeImages: true,
        },
        ctx,
      )) || [];

    const idx = Math.floor(Math.random() * bestPerformance.length);
    return bestPerformance[idx];
  }
}
