import { Injectable } from '@nestjs/common';
import { mapToAutomationQueueItemEntity } from '@pcpartdb/database';
import { EnqueueAutomationRequest } from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { AutomationQueueRepository } from './automation-queue.repository';

@Injectable()
export class AutomationService {
  constructor(private repository: AutomationQueueRepository) {}

  async enqueue(request: EnqueueAutomationRequest, ctx: Context) {
    const entity = await mapToAutomationQueueItemEntity(request);
    await this.repository.create(entity, ctx);
  }
}
