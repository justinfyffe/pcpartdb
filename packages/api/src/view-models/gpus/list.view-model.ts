import { Injectable } from '@nestjs/common';
import {
  GpuSort,
  GpusQuery,
  LIST_PRESETS,
  ListGpusViewModel,
  ListPresetSlug,
} from '@pcpartdb/shared';
import { GpuService } from '../../gpu/gpu.service';
import { gpusQueryValidator } from '../../gpu/gpu.validators';
import { Context } from '../../shared/context';
import { validate } from '../../shared/types/validate';

@Injectable()
export class ListGpusViewModelService {
  constructor(private gpuService: GpuService) {}

  async viewModel(query: Record<string, string>, ctx: Context) {
    const gpusQuery = this.getQuery(query);

    const gpus = await this.getGpusForQuery(gpusQuery, ctx);
    const totalGpus = await this.getTotalGpus(ctx);

    return { query, gpus, totalGpus } as ListGpusViewModel;
  }

  private getQuery(query: Record<string, string>) {
    const company = (query.company as string)?.split(',');
    const sort = (query.sort as string) || GpuSort.PerformanceRating;
    const order = query.order as string;
    const preset = query.preset as ListPresetSlug;

    if (preset != null && LIST_PRESETS[preset] != null) {
      return LIST_PRESETS[preset];
    }

    const gpusQuery = {
      filter: { company },
      orderBy: { sort, order },
    } as GpusQuery;
    validate(gpusQuery, gpusQueryValidator);

    return gpusQuery as GpusQuery;
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
