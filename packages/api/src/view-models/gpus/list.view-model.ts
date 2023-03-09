import { Injectable } from '@nestjs/common';
import {
  GpusQuery,
  ListGpusRequest,
  ListGpusViewModel,
} from '@pcpartdb/shared';
import { GpuService } from '../../gpu/gpu.service';
import { listGpusRequestValidator } from '../../gpu/gpu.validators';
import { Context } from '../../shared/context';
import { validate } from '../../shared/types/validate';

@Injectable()
export class ListGpusViewModelService {
  constructor(private gpuService: GpuService) {}

  async viewModel(request: ListGpusRequest, ctx: Context) {
    validate(request, listGpusRequestValidator);

    const { query } = request;

    const gpus = await this.getGpusForQuery(query, ctx);
    const totalGpus = await this.getTotalGpus(ctx);

    return { query, gpus, totalGpus } as ListGpusViewModel;
  }

  private async getGpusForQuery(query: GpusQuery, ctx: Context) {
    return await this.getGpus(query, ctx);
  }

  private async getGpus(query: GpusQuery, ctx: Context) {
    return await this.gpuService.list(
      { query, includeRanks: true, includeImages: false },
      ctx,
    );
  }

  private async getTotalGpus(ctx: Context) {
    return await this.gpuService.count({}, ctx);
  }
}
