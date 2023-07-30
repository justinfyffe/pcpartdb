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
  ValidationErrorType,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { badRequestError, notFoundError } from '../shared/error';
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
    const entity = await this.repository.findById(id, ctx);
    if (entity == null) {
      throw notFoundError({ id });
    } else if (entity.status !== AutomationQueueStatus.Pending) {
      throw badRequestError({
        property: 'status',
        constraint: ValidationErrorType.InvalidStatus,
      });
    }

    await this.repository.update(
      id,
      { status: AutomationQueueStatus.Canceled },
      ctx,
    );
  }

  async markAsProcessing(id: number, ctx: Context) {
    const entity = await this.repository.findById(id, ctx);
    if (entity == null) {
      throw notFoundError({ id });
    } else if (entity.status !== AutomationQueueStatus.Pending) {
      throw badRequestError({
        property: 'status',
        constraint: ValidationErrorType.InvalidStatus,
      });
    }

    await this.repository.update(
      id,
      { status: AutomationQueueStatus.Processing },
      ctx,
    );
  }

  async markAsProcessed(id: number, ctx: Context) {
    const entity = await this.repository.findById(id, ctx);
    if (entity == null) {
      throw notFoundError({ id });
    } else if (entity.status !== AutomationQueueStatus.Processing) {
      throw badRequestError({
        property: 'status',
        constraint: ValidationErrorType.InvalidStatus,
      });
    }

    await this.repository.update(
      id,
      { status: AutomationQueueStatus.Processed },
      ctx,
    );
  }

  async markAsFailed(id: number, ctx: Context) {
    const entity = await this.repository.findById(id, ctx);
    if (entity == null) {
      throw notFoundError({ id });
    } else if (
      entity.status !== AutomationQueueStatus.Pending &&
      entity.status !== AutomationQueueStatus.Processing
    ) {
      throw badRequestError({
        property: 'status',
        constraint: ValidationErrorType.InvalidStatus,
      });
    }

    await this.repository.update(
      id,
      { status: AutomationQueueStatus.Failed },
      ctx,
    );
  }
}
