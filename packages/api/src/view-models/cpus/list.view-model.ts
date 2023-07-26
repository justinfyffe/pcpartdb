import { Injectable } from '@nestjs/common';
import { ListCpusQuery, ListCpusResponse } from '@pcpartdb/shared';
import { CpuService } from '../../product/cpu/cpu.service';
import { listCpusQueryValidator } from '../../product/cpu/cpu.validators';
import { Context } from '../../shared/context';
import { validate } from '../../shared/validation/validate';

@Injectable()
export class ListCpusViewModelService {
  constructor(private cpuService: CpuService) {}

  async viewModel(query: ListCpusQuery, ctx: Context) {
    validate(query, listCpusQueryValidator);

    const cpus = await this.getCpusForQuery(query, ctx);
    const totalCpus = await this.getTotalCpusForQuery(query, ctx);

    return {
      query,
      cpus,
      totalCpus,
      contentData: {},
    } as ListCpusResponse;
  }

  private async getCpusForQuery(query: ListCpusQuery, ctx: Context) {
    return await this.getCpus(query, ctx);
  }

  private async getTotalCpusForQuery(query: ListCpusQuery, ctx: Context) {
    return await this.cpuService.count({ query }, ctx);
  }

  private async getCpus(query: ListCpusQuery, ctx: Context) {
    return await this.cpuService.list(
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
