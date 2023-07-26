import { Injectable } from '@nestjs/common';
import {
  AdminDataUpdatesViewModel,
  ListDataUpdatesRequest,
} from '@pcpartdb/shared';
import { DataUpdateService } from '../../../data-update/data-update.service';
import { listUpdatesRequestValidator } from '../../../data-update/data-update.validators';
import { Context } from '../../../shared/context';
import { validate } from '../../../shared/validation/validate';

@Injectable()
export class AdminDataUpdatesViewModelService {
  constructor(private dataUpdateService: DataUpdateService) {}

  async viewModel(request: ListDataUpdatesRequest, ctx: Context) {
    validate(request, listUpdatesRequestValidator);

    const status = request.status;
    const updates = await this.getUpdates(request, ctx);
    const totalUpdates = await this.getTotalUpdates(request, ctx);

    return {
      status,
      updates,
      totalUpdates,
    } as AdminDataUpdatesViewModel;
  }

  private async getTotalUpdates(request: ListDataUpdatesRequest, ctx: Context) {
    return await this.dataUpdateService.countUpdates(request, ctx);
  }

  private async getUpdates(request: ListDataUpdatesRequest, ctx: Context) {
    return await this.dataUpdateService.getUpdates(request, ctx);
  }
}
