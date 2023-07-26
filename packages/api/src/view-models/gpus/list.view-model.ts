import { Injectable } from '@nestjs/common';
import { ListGpusQuery, ListGpusResponse } from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { GpuService } from '../../product/gpu/gpu.service';
import { listGpusQueryValidator } from '../../product/gpu/gpu.validators';
import { Context } from '../../shared/context';
import { validate } from '../../shared/validation/validate';

@Injectable()
export class ListGpusViewModelService {
  constructor(private gpuService: GpuService) {}

  async viewModel(query: ListGpusQuery, ctx: Context) {
    validate(query, listGpusQueryValidator);

    const chipsetsQuery = deepmerge(
      { filter: { isChipset: true } } as ListGpusQuery,
      query,
    );

    const gpus = await this.getGpusForQuery(chipsetsQuery, ctx);
    const totalGpus = await this.getTotalGpusForQuery(chipsetsQuery, ctx);

    const retailModelCounts = await this.gpuService.countRetailModels(
      { chipsetIds: gpus.map((gpu) => gpu.id) },
      ctx,
    );

    return {
      query: chipsetsQuery,
      gpus,
      totalGpus,
      contentData: { retailModelCounts },
    } as ListGpusResponse;
  }

  private async getGpusForQuery(query: ListGpusQuery, ctx: Context) {
    return await this.getGpus(query, ctx);
  }

  private async getTotalGpusForQuery(query: ListGpusQuery, ctx: Context) {
    return await this.gpuService.count({ query }, ctx);
  }

  private async getGpus(query: ListGpusQuery, ctx: Context) {
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
