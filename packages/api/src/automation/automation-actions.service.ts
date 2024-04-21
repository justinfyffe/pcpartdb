import { Injectable } from '@nestjs/common';
import {
  mapToAutomationActionDto,
  mapToAutomationActionDtos,
  mapToAutomationActionEntity,
} from '@pcpartdb/database';
import {
  AutomationAction,
  AutomationActionStatus,
  AutomationActionType,
  CreateAutomationActionRequest,
  createAutomationActionRequestSchema,
  ListAutomationActionsRequest,
  listAutomationActionsRequestSchema,
  ListAutomationActionsResponse,
  ProductType,
  UpdateCpuActionData,
  UpdateGpuActionData,
} from '@pcpartdb/shared';
import { Database } from '../database';
import { ProductRepository } from '../product/repositories';
import { Context } from '../shared/context';
import { internalServerError, notFoundError } from '../shared/error';
import { validate } from '../shared/validation/validate';
import { AutomationRepository } from './automation.repository';

@Injectable()
export class AutomationActionsService {
  constructor(
    private repository: AutomationRepository,
    private productRepository: ProductRepository,
    private db: Database,
  ) {}

  async listPending(request: ListAutomationActionsRequest, ctx: Context) {
    validate(request, listAutomationActionsRequestSchema);
    const { query } = request;

    return await this.db.transaction(
      async () => {
        const { results, total } = await this.repository.listPending(
          { query },
          ctx,
        );

        return {
          query,
          results: await mapToAutomationActionDtos(results, {
            includeData: true,
          }),
          total,
        } as ListAutomationActionsResponse;
      },
      { ctx },
    );
  }

  async create(request: CreateAutomationActionRequest, ctx: Context) {
    validate(request, createAutomationActionRequestSchema);

    return await this.db.transaction(
      async () => {
        const entity = await mapToAutomationActionEntity({
          ...request,
          status: AutomationActionStatus.Pending,
        });
        await this.repository.create(entity, ctx);
      },
      { ctx },
    );
  }

  async updateActionStatus(
    id: number,
    status: AutomationActionStatus,
    ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        const entity = await this.repository.findById(id, ctx);
        if (entity == null) {
          throw notFoundError({ id });
        }

        await this.repository.update(id, { status }, ctx);
      },
      { ctx },
    );
  }

  /**
   * Gets the next pending queued/prioritized automation task to do.
   */
  async getNextPending(ctx: Context) {
    return await this.db.transaction(
      async () => {
        const entity = await this.repository.findNextPending(ctx);
        if (entity == null) {
          return null;
        }

        return mapToAutomationActionDto(entity);
      },
      { ctx },
    );
  }

  /**
   * Gets the next general automation task to do. These are not stored in the
   * database and should be done after all queued tasks are done.
   */
  async getNextBacklog(ctx: Context) {
    return await this.db.transaction(
      async () => {
        // Find next id to update
        const { id: nextId, productType: nextProductType } =
          await this.productRepository.popNextIdToBeUpdated(ctx);

        // Get action details, and update product's automation timestamp
        let actionType: AutomationActionType;
        let payload: UpdateCpuActionData | UpdateGpuActionData;
        if (nextProductType === ProductType.Cpu) {
          actionType = AutomationActionType.UpdateCpu;
          payload = { cpuId: nextId };
        } else if (nextProductType === ProductType.Gpu) {
          actionType = AutomationActionType.UpdateGpu;
          payload = { gpuId: nextId };
        } else {
          throw internalServerError();
        }

        // Create and return action.
        return {
          type: actionType,
          status: AutomationActionStatus.Pending,
          data: payload,
        } as AutomationAction;
      },
      { ctx },
    );
  }
}
