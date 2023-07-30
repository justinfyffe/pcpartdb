import { Injectable } from '@nestjs/common';
import {
  mapToAutomationQueueItemDto,
  mapToAutomationQueueItemDtos,
  mapToAutomationQueueItemEntity,
} from '@pcpartdb/database';
import {
  AutomationQueueStatus,
  EnqueueAutomationRequest,
  ListAutomationQueueRequest,
  ListAutomationQueueResponse,
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

  async getNextPending(ctx: Context) {
    const entity = await this.repository.findNextPending(ctx);
    if (entity == null) {
      return null;
    }

    return mapToAutomationQueueItemDto(entity);
  }

  async listPending(request: ListAutomationQueueRequest, ctx: Context) {
    validate(request, listAutomationQueueRequestValidator);
    const { query } = request;

    const { results, total } = await this.repository.listPending(
      { query },
      ctx,
    );

    return {
      query,
      results: await mapToAutomationQueueItemDtos(results, {
        includeData: true,
      }),
      total,
    } as ListAutomationQueueResponse;
  }

  async enqueue(request: EnqueueAutomationRequest, ctx: Context) {
    validate(request, enqueueAutomationRequestValidator);

    const entity = await mapToAutomationQueueItemEntity({
      ...request,
      status: AutomationQueueStatus.Pending,
    });
    await this.repository.create(entity, ctx);
  }

  async cancel(id: number, ctx: Context) {
    await this.repository.updateStatus(id, AutomationQueueStatus.Canceled, ctx);
  }

  async markAsProcessing(id: number, ctx: Context) {
    await this.repository.updateStatus(
      id,
      AutomationQueueStatus.Processing,
      ctx,
    );
  }

  async markAsProcessed(id: number, ctx: Context) {
    await this.repository.updateStatus(
      id,
      AutomationQueueStatus.Processed,
      ctx,
    );
  }

  async markAsFailed(id: number, ctx: Context) {
    await this.repository.updateStatus(id, AutomationQueueStatus.Failed, ctx);
  }
}
