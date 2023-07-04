import { Injectable } from '@nestjs/common';
import {
  getGpuChipset,
  Gpu,
  GpuRank,
  GpuRanksFilter,
  hasProductFieldValue,
} from '@pcpartdb/shared';
import { parseISO } from 'date-fns';
import { Context } from '../../../shared/context';
import { GpuRanksRepository } from './gpu-ranks.repository';

@Injectable()
export class GpuRanksService {
  constructor(private gpuRanksRepository: GpuRanksRepository) {}

  async populateRanks(types: GpuRank[], gpus: Gpu[], ctx: Context) {
    const filteredGpus = gpus.filter((gpu) => getGpuChipset(gpu) != null);

    if (filteredGpus.length === 0) {
      return;
    }

    const enabledRanks = new Set(types);
    const ids = filteredGpus.map((gpu) => getGpuChipset(gpu).id);
    const filter = this.buildRanksFilter(filteredGpus);

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

    const performanceRankForSegment = enabledRanks.has(
      'performanceRankForSegment',
    )
      ? await this.gpuRanksRepository.getPerformanceRanks(
          ids,
          { segment: filter.segment },
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

    filteredGpus.forEach((gpu, i) => {
      gpu.ranks = {
        ...gpu.ranks,
        performanceRank: performanceRanks?.[i],
        performanceRankForArchitectureSegment:
          performanceRankForArchitectureSegment?.[i],
        performanceRankForCompanySegment: performanceRankForCompanySegment?.[i],
        performanceRankForSegment: performanceRankForSegment?.[i],
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
          .filter((gpu) => hasProductFieldValue(gpu?.releaseDate))
          .map((gpu) => parseISO(gpu.releaseDate.value).getFullYear()),
      ),
    ];

    const segment = [
      ...new Set(
        gpus
          .map((gpu) => gpu.marketSegment?.value)
          .filter((value) => value != null),
      ),
    ];

    return { architecture, company, year, segment };
  }
}
