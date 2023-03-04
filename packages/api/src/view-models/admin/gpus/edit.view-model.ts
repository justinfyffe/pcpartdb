import { Injectable } from '@nestjs/common';
import { AdminEditGpuViewModel } from '@pcpartdb/shared';
import { GpuService } from '../../../gpu/gpu.service';
import { Context } from '../../../shared/context';

@Injectable()
export class AdminEditGpuViewModelService {
  constructor(private gpuService: GpuService) {}

  async viewModel(gpuId: number, ctx: Context) {
    return { gpu: await this.getGpu(gpuId, ctx) } as AdminEditGpuViewModel;
  }

  private async getGpu(id: number, ctx: Context) {
    return await this.gpuService.getById(id, { includeImages: true }, ctx);
  }
}
