import { Injectable } from '@nestjs/common';
import { Context } from '../../shared/context';
import { GpuSpecsEntity } from '../gpu.entity';
import { mapToGpuDtos } from '../gpu.mapper';
import { GpuAutocompleteRepository } from './gpu-autocomplete.repository';

export enum GpuRank {
  Performance = 'PERFORMANCE',
  PerformanceCompany = 'PERFORMANCE_COMPANY',
  Value = 'VALUE',
}

@Injectable()
export class GpuAutocompleteService {
  constructor(private gpuAutocompleteRepository: GpuAutocompleteRepository) {}

  async autocomplete(query: string, ctx: Context) {
    const results = await this.gpuAutocompleteRepository.autocomplete(
      query,
      ctx,
    );
    return mapToGpuDtos(results);
  }

  async autocompleteSpec(
    key: keyof GpuSpecsEntity,
    query: string,
    ctx: Context,
  ) {
    return await this.gpuAutocompleteRepository.autocompleteSpec(
      key,
      query,
      ctx,
    );
  }
}
