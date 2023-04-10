import { Injectable } from '@nestjs/common';
import {
  AdminPendingUpdatesViewModel,
  ListPendingUpdatesRequest,
} from '@pcpartdb/shared';
import { DataUpdateService } from '../../../data-update/data-update.service';
import { listPendingUpdatesRequestValidator } from '../../../data-update/data-update.validators';
import { Context } from '../../../shared/context';
import { validate } from '../../../shared/types/validate';

@Injectable()
export class AdminPendingUpdatesViewModelService {
  constructor(private dataUpdateService: DataUpdateService) {}

  async viewModel(request: ListPendingUpdatesRequest, ctx: Context) {
    validate(request, listPendingUpdatesRequestValidator);

    const pendingUpdates = await this.getPendingUpdates(request, ctx);
    const totalResults = await this.getTotalPendingUpdates(ctx);

    return { pendingUpdates, totalResults } as AdminPendingUpdatesViewModel;
  }

  private async getTotalPendingUpdates(ctx: Context) {
    return await this.dataUpdateService.countPendingUpdates(ctx);
  }

  private async getPendingUpdates(
    request: ListPendingUpdatesRequest,
    ctx: Context,
  ) {
    return await this.dataUpdateService.getPendingUpdates(request, ctx);
  }
}
