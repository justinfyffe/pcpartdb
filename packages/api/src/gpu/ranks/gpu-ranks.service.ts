import { Injectable } from '@nestjs/common';
import { Gpu } from '@pcpartdb/shared';
import { Context } from '../../shared/context';
import { GpuRanksRepository } from './gpu-ranks.repository';

export enum GpuRank {
  Performance = 'PERFORMANCE',
  PerformanceCompany = 'PERFORMANCE_COMPANY',
  Value = 'VALUE',
}

@Injectable()
export class GpuRanksService {
  constructor(private gpuRanksRepository: GpuRanksRepository) {}

  async populateRanks(gpus: Gpu[], ranks: GpuRank[], ctx: Context) {
    if (gpus.length === 0) {
      return;
    }

    const enabledRanks = new Set(ranks);
    const ids = gpus.map((gpu) => gpu.id);
    const companies = [
      ...new Set(
        gpus
          .map((gpu) => gpu.company?.value)
          .filter((company) => company != null),
      ).values(),
    ];

    const performanceRanks = enabledRanks.has(GpuRank.Performance)
      ? await this.gpuRanksRepository.getPerformanceRanks(ids, null, ctx)
      : null;

    const performanceCompanyRank = enabledRanks.has(GpuRank.PerformanceCompany)
      ? await this.gpuRanksRepository.getPerformanceRanks(
          ids,
          { company: companies },
          ctx,
        )
      : null;

    const valueRanks = enabledRanks.has(GpuRank.Value)
      ? await this.gpuRanksRepository.getValueRanks(ids, null, ctx)
      : null;

    gpus.forEach((gpu, i) => {
      gpu.ranks = {
        ...gpu.ranks,
        performanceRank: performanceRanks?.[i],
        performanceCompanyRank: performanceCompanyRank?.[i],
        valueRank: valueRanks?.[i],
      };
    });
  }
}
