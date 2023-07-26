import { Injectable } from '@nestjs/common';
import { mapToAutomationQueueItemEntity } from '@pcpartdb/database';
import {
  AutomationQueueStatus,
  EnqueueAutomationRequest,
  ListAutomationQueueRequest,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { validate } from '../shared/validation/validate';
import {
  enqueueAutomationRequestValidator,
  listAutomationQueueRequestValidator,
} from './automation.validators';
import { AutomationQueueRepository } from './automation-queue.repository';

@Injectable()
export class AutomationService {
  constructor(private repository: AutomationQueueRepository) {}

  async listQueue(request: ListAutomationQueueRequest, ctx: Context) {
    validate(request, listAutomationQueueRequestValidator);

    // Fetch queue
    // Count results
    // Return
  }

  async enqueue(request: EnqueueAutomationRequest, ctx: Context) {
    validate(request, enqueueAutomationRequestValidator);

    const entity = await mapToAutomationQueueItemEntity({
      ...request,
      status: AutomationQueueStatus.Pending,
    });
    await this.repository.create(entity, ctx);
  }
}
