import { Injectable } from '@nestjs/common';
import { GpuComparison, HomeViewModel, ListGpusSort } from '@pcpartdb/shared';
import { GpuService } from '../../gpu/gpu.service';
import { Context } from '../../shared/context';

@Injectable()
export class HomeViewModelService {
  constructor(private gpuService: GpuService) {}

  async viewModel(ctx: Context) {
    const nvidiaGpus = await this.getNvidiaGpus(ctx);
    const amdGpus = await this.getAmdGpus(ctx);

    const nvidiaVsAmdGpus = [
      [nvidiaGpus[0], amdGpus[0]],
      [nvidiaGpus[1], amdGpus[1]],
      [nvidiaGpus[2], amdGpus[2]],
    ].filter(([p1, p2]) => p1 != null && p2 != null) as GpuComparison[];

    return { nvidiaVsAmdGpus, nvidiaGpus, amdGpus } as HomeViewModel;
  }

  private async getNvidiaGpus(ctx: Context) {
    const bestPerformance =
      (
        await this.gpuService.list(
          {
            query: {
              filter: {
                performanceRated: true,
                company: ['nvidia'],
                isChipset: true,
              },
              orderBy: { sort: ListGpusSort.PerformanceRating },
              pagination: { limit: 1 },
            },
            includeImages: true,
          },
          ctx,
        )
      )[0] || null;

    const bestValueResults = await this.gpuService.list(
      {
        query: {
          filter: {
            performanceRated: true,
            company: ['nvidia'],
            isChipset: true,
          },
          orderBy: { sort: ListGpusSort.ValueRating },
          pagination: { limit: 3 },
        },
        includeImages: true,
      },
      ctx,
    );
    const bestValue1 = bestValueResults[0] || null;
    const bestValue3 = bestValueResults[2] || null;

    return [bestPerformance, bestValue1, bestValue3];
  }

  private async getAmdGpus(ctx: Context) {
    const bestPerformance =
      (
        await this.gpuService.list(
          {
            query: {
              filter: {
                performanceRated: true,
                company: ['amd'],
                isChipset: true,
              },
              orderBy: { sort: ListGpusSort.PerformanceRating },
              pagination: { limit: 1 },
            },
            includeImages: true,
          },
          ctx,
        )
      )[0] || null;

    const bestValueResults = await this.gpuService.list(
      {
        query: {
          filter: { performanceRated: true, company: ['amd'], isChipset: true },
          orderBy: { sort: ListGpusSort.ValueRating },
          pagination: { limit: 3 },
        },
        includeImages: true,
      },
      ctx,
    );
    const bestValue1 = bestValueResults[0] || null;
    const bestValue3 = bestValueResults[2] || null;

    return [bestPerformance, bestValue1, bestValue3];
  }
}
