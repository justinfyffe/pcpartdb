import { Injectable } from '@nestjs/common';
import { Cpu, CpuRank, CpuRanksFilter } from '@pcpartdb/shared';
import { Context } from '../../../shared/context';
import { CpuRanksRepository } from './cpu-ranks.repository';

@Injectable()
export class CpuRanksService {
  constructor(private cpuRanksRepository: CpuRanksRepository) {}

  async populateRanks(types: CpuRank[], cpus: Cpu[], ctx: Context) {
    const enabledRanks = new Set(types);
    const ids = cpus.map((cpu) => cpu.id);
    const filter = this.buildRanksFilter(cpus);

    const performanceRanks = enabledRanks.has('performanceRank')
      ? await this.cpuRanksRepository.getPerformanceRanks(ids, null, ctx)
      : null;

    const performanceRankForSegment = enabledRanks.has(
      'performanceRankForSegment',
    )
      ? await this.cpuRanksRepository.getPerformanceRanks(
          ids,
          { segment: filter.segment },
          ctx,
        )
      : null;

    const valueRanks = enabledRanks.has('valueRank')
      ? await this.cpuRanksRepository.getValueRanks(ids, null, ctx)
      : null;

    const valueRankForSegment = enabledRanks.has('valueRankForSegment')
      ? await this.cpuRanksRepository.getValueRanks(
          ids,
          { segment: filter.segment },
          ctx,
        )
      : null;

    cpus.forEach((cpu, i) => {
      cpu.ranks = {
        ...cpu.ranks,
        performanceRank: performanceRanks?.[i],
        performanceRankForSegment: performanceRankForSegment?.[i],
        valueRank: valueRanks?.[i],
        valueRankForSegment: valueRankForSegment?.[i],
      };
    });
  }

  private buildRanksFilter(cpus: Cpu[]): CpuRanksFilter {
    if (cpus.length === 0) {
      return {};
    }

    const flattenedSegments = cpus
      .map((cpu) => cpu.marketSegment?.value)
      .filter((value) => value != null);
    const segment = [...new Set(flattenedSegments)];

    return { segment };
  }
}
