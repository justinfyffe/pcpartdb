import { Injectable } from '@nestjs/common';
import { CpuEntity, mapToCpuDtos } from '@pcpartdb/database';
import { Context } from '../../../shared/context';
import { CpuAutocompleteRepository } from './cpu-autocomplete.repository';

export enum CpuRank {
  Performance = 'PERFORMANCE',
  PerformanceCompany = 'PERFORMANCE_COMPANY',
  Value = 'VALUE',
}

@Injectable()
export class CpuAutocompleteService {
  constructor(private cpuAutocompleteRepository: CpuAutocompleteRepository) {}

  async autocomplete(query: string, ctx: Context) {
    const results = await this.cpuAutocompleteRepository.autocomplete(
      query,
      ctx,
    );
    return mapToCpuDtos(results, {
      fields: new Set([
        'company',
        'launchPrice',
        'marketSegment',
        'releaseDate',
      ]),
    });
  }

  async autocompleteField(
    key: keyof Omit<CpuEntity, 'images'>,
    query: string,
    ctx: Context,
  ) {
    return await this.cpuAutocompleteRepository.autocompleteData(
      key,
      query,
      ctx,
    );
  }
}
