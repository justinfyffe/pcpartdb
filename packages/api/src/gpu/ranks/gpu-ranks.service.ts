import { Injectable } from '@nestjs/common';
import { Gpu, GpuRank, GpuRanksFilter } from '@pcpartdb/shared';
import { parseISO } from 'date-fns';
import { Context } from '../../shared/context';
import { GpuRanksRepository } from './gpu-ranks.repository';

@Injectable()
export class GpuRanksService {
  constructor(private gpuRanksRepository: GpuRanksRepository) {}

  async populateRanks(types: GpuRank[], gpus: Gpu[], ctx: Context) {
    if (gpus.length === 0) {
      return;
    }

    const enabledRanks = new Set(types);
    const ids = gpus.map((gpu) => gpu.id);
    const filter = this.buildRanksFilter(gpus);

    const performanceRanks = enabledRanks.has('performanceRank')
      ? await this.gpuRanksRepository.getPerformanceRanks(ids, null, ctx)
      : null;

    const performanceCompanyRank = enabledRanks.has('performanceCompanyRank')
      ? await this.gpuRanksRepository.getPerformanceRanks(
          ids,
          { company: filter.company },
          ctx,
        )
      : null;

    const performanceYearRank = enabledRanks.has('performanceYearRank')
      ? await this.gpuRanksRepository.getPerformanceRanks(
          ids,
          { year: filter.year },
          ctx,
        )
      : null;

    const valueRanks = enabledRanks.has('valueRank')
      ? await this.gpuRanksRepository.getValueRanks(ids, null, ctx)
      : null;

    gpus.forEach((gpu, i) => {
      gpu.ranks = {
        ...gpu.ranks,
        performanceRank: performanceRanks?.[i],
        performanceCompanyRank: performanceCompanyRank?.[i],
        performanceYearRank: performanceYearRank?.[i],
        valueRank: valueRanks?.[i],
      };
    });
  }

  private buildRanksFilter(gpus: Gpu[]): GpuRanksFilter {
    if (gpus.length === 0) {
      return {};
    }

    const company = [
      ...new Set(
        gpus.map((gpu) => gpu.company?.value).filter((value) => value != null),
      ),
    ];

    const year = [
      ...new Set(
        gpus
          .filter((value) => value != null)
          .map((gpu) => parseISO(gpu.releaseDate?.value).getFullYear()),
      ),
    ];

    return { company, year };
  }
}
