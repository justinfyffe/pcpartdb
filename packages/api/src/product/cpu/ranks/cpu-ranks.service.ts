import { Injectable } from '@nestjs/common';
import {
  Cpu,
  CpuRank,
  CpuRanksFilter,
  hasProductFieldValue,
} from '@pcpartdb/shared';
import { parseISO } from 'date-fns';
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

    const performanceRankForCodename = enabledRanks.has(
      'performanceRankForCodename',
    )
      ? await this.cpuRanksRepository.getPerformanceRanks(
          ids,
          { codename: filter.codename },
          ctx,
        )
      : null;

    const performanceRankForCompanySegment = enabledRanks.has(
      'performanceRankForCompanySegment',
    )
      ? await this.cpuRanksRepository.getPerformanceRanks(
          ids,
          { company: filter.company, segment: filter.segment },
          ctx,
        )
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

    const performanceRankForGeneration = enabledRanks.has(
      'performanceRankForGeneration',
    )
      ? await this.cpuRanksRepository.getPerformanceRanks(
          ids,
          { generation: filter.generation },
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
        performanceRankForCodename: performanceRankForCodename?.[i],
        performanceRankForCompanySegment: performanceRankForCompanySegment?.[i],
        performanceRankForSegment: performanceRankForSegment?.[i],
        performanceRankForGeneration: performanceRankForGeneration?.[i],
        valueRank: valueRanks?.[i],
        valueRankForSegment: valueRankForSegment?.[i],
      };
    });
  }

  private buildRanksFilter(cpus: Cpu[]): CpuRanksFilter {
    if (cpus.length === 0) {
      return {};
    }

    const company = [
      ...new Set(
        cpus.map((cpu) => cpu.company?.value).filter((value) => value != null),
      ),
    ];

    const year = [
      ...new Set(
        cpus
          .filter((cpu) => hasProductFieldValue(cpu?.releaseDate))
          .map((cpu) => parseISO(cpu.releaseDate?.value).getFullYear()),
      ),
    ];

    const flattenedSegments = cpus
      .flatMap((cpu) => cpu.marketSegments?.value)
      .filter((value) => value != null);
    const segment = [...new Set(flattenedSegments)];

    const codename = [
      ...new Set(
        cpus.map((cpu) => cpu.codename?.value).filter((value) => value != null),
      ),
    ];

    const generation = [
      ...new Set(
        cpus
          .map((cpu) => cpu.generation?.value)
          .filter((value) => value != null),
      ),
    ];

    return { company, year, segment, codename, generation };
  }
}
