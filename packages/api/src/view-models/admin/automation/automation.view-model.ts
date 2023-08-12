import { Injectable } from '@nestjs/common';
import { AdminAutomationViewModel } from '@pcpartdb/shared';
import { AutomationService } from 'packages/api/src/automation/automation.service';
import { Context } from '../../../shared/context';

@Injectable()
export class AdminAutomationViewModelService {
  constructor(private automationService: AutomationService) {}

  async viewModel(ctx: Context) {
    const status = await this.automationService.getStatus(ctx);

    return {
      status,
    } as AdminAutomationViewModel;
  }
}
