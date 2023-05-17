import { Injectable } from '@nestjs/common';
import { GpusQuery, ListGpusRequest, ListGpusResponse } from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { GpuService } from '../../gpu/gpu.service';
import { listGpusRequestValidator } from '../../gpu/gpu.validators';
import { Context } from '../../shared/context';
import { validate } from '../../shared/types/validate';

@Injectable()
export class ListGpusViewModelService {
  constructor(private gpuService: GpuService) {}

  async viewModel(request: ListGpusRequest, ctx: Context) {
    validate(request, listGpusRequestValidator);

    const query = deepmerge(
      { filter: { isChipset: true } } as GpusQuery,
      request.query,
    );

    const gpus = await this.getGpusForQuery(query, ctx);
    const totalGpus = await this.getTotalGpusForQuery(query, ctx);

    const retailModelCounts = await this.gpuService.countRetailModels(
      { chipsetIds: gpus.map((gpu) => gpu.id) },
      ctx,
    );

    return {
      query,
      gpus,
      totalGpus,
      contentData: { retailModelCounts },
    } as ListGpusResponse;
  }

  private async getGpusForQuery(query: GpusQuery, ctx: Context) {
    return await this.getGpus(query, ctx);
  }

  private async getTotalGpusForQuery(query: GpusQuery, ctx: Context) {
    return await this.gpuService.count({ query }, ctx);
  }

  private async getGpus(query: GpusQuery, ctx: Context) {
    return await this.gpuService.list(
      {
        query,
        fields: ['company', 'performanceScore', 'valueScore', 'releaseDate'],
        includeRanks: ['performanceRank', 'valueRank'],
        includeImages: false,
      },
      ctx,
    );
  }
}
