import { Injectable } from '@nestjs/common';
import { AdminListGpusViewModel } from '@pcpartdb/shared';
import { GpuService } from '../../../gpu/gpu.service';
import { Context } from '../../../shared/context';

@Injectable()
export class AdminListGpusViewModelService {
  constructor(private gpuService: GpuService) {}

  async viewModel(ctx: Context) {
    return { gpus: await this.getGpus(ctx) } as AdminListGpusViewModel;
  }

  private async getGpus(ctx: Context) {
    return await this.gpuService.list({}, ctx);
  }
}
