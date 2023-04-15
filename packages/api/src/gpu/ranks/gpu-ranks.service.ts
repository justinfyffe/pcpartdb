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

    const performanceRankForArchitectureSegment = enabledRanks.has(
      'performanceRankForArchitectureSegment',
    )
      ? await this.gpuRanksRepository.getPerformanceRanks(
          ids,
          { architecture: filter.architecture, segment: filter.segment },
          ctx,
        )
      : null;

    const performanceRankForCompanySegment = enabledRanks.has(
      'performanceRankForCompanySegment',
    )
      ? await this.gpuRanksRepository.getPerformanceRanks(
          ids,
          { company: filter.company, segment: filter.segment },
          ctx,
        )
      : null;

    const performanceRankForSegmentYear = enabledRanks.has(
      'performanceRankForSegmentYear',
    )
      ? await this.gpuRanksRepository.getPerformanceRanks(
          ids,
          { year: filter.year, segment: filter.segment },
          ctx,
        )
      : null;

    const valueRanks = enabledRanks.has('valueRank')
      ? await this.gpuRanksRepository.getValueRanks(ids, null, ctx)
      : null;

    const valueRankForSegment = enabledRanks.has('valueRankForSegment')
      ? await this.gpuRanksRepository.getValueRanks(
          ids,
          { segment: filter.segment },
          ctx,
        )
      : null;

    gpus.forEach((gpu, i) => {
      gpu.ranks = {
        ...gpu.ranks,
        performanceRank: performanceRanks?.[i],
        performanceRankForArchitectureSegment:
          performanceRankForArchitectureSegment?.[i],
        performanceRankForCompanySegment: performanceRankForCompanySegment?.[i],
        performanceRankForSegmentYear: performanceRankForSegmentYear?.[i],
        valueRank: valueRanks?.[i],
        valueRankForSegment: valueRankForSegment?.[i],
      };
    });
  }

  private buildRanksFilter(gpus: Gpu[]): GpuRanksFilter {
    if (gpus.length === 0) {
      return {};
    }

    const architecture = [
      ...new Set(
        gpus
          .map((gpu) => gpu.architecture?.value)
          .filter((value) => value != null),
      ),
    ];

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

    const segment = [
      ...new Set(
        gpus
          .filter((value) => value != null)
          .map((gpu) => gpu.marketSegment?.value),
      ),
    ];

    return { architecture, company, year, segment };
  }
}
