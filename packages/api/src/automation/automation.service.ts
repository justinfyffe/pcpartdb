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
  AutomationStatus,
  CreateAutomationActionRequest,
  createAutomationActionRequestSchema,
  ListAutomationActionsRequest,
  listAutomationActionsRequestSchema,
  ListAutomationActionsResponse,
  ProductType,
  SubProductType,
  updateAutomationStatusSchema,
  UpdateCpuActionData,
  UpdateGpuActionData,
} from '@pcpartdb/shared';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { AutomationSourceRepository } from '../product/automation-source.repository';
import { ProductRepository } from '../product/product.repository';
import { ProductUpdateRepository } from '../product/product-update.repository';
import { Context } from '../shared/context';
import {
  badRequestError,
  internalServerError,
  notFoundError,
} from '../shared/error';
import { dataPath } from '../shared/utils';
import { validate } from '../shared/validation/validate';
import { AutomationRepository } from './automation.repository';

const CONFIG_FILE = 'automation.json';

@Injectable()
export class AutomationService {
  constructor(
    private repository: AutomationRepository,
    private productRepository: ProductRepository,
    private automationSourceRepository: AutomationSourceRepository,
    private productUpdateRepository: ProductUpdateRepository,
  ) {}

  async getStatus(ctx: Context) {
    const statusJson = fs.existsSync(dataPath(CONFIG_FILE))
      ? await fsPromises.readFile(dataPath(CONFIG_FILE), 'utf-8')
      : '{}';

    const status: AutomationStatus = {
      enabled: false,
      ...(JSON.parse(statusJson) || {}),
      ...(await this.getPendingSources(ctx)),
      ...(await this.getPendingUpdates(ctx)),
    };

    return status;
  }

  async updateStatus(status: Partial<AutomationStatus>, _ctx: Context) {
    validate(status, updateAutomationStatusSchema);

    if (status.enabled == null) {
      throw badRequestError();
    }

    const statusToSave = {
      enabled: status.enabled,
    };

    await fsPromises.writeFile(
      dataPath(CONFIG_FILE),
      JSON.stringify(statusToSave, undefined, 2),
      'utf-8',
    );
  }

  async listPending(request: ListAutomationActionsRequest, ctx: Context) {
    validate(request, listAutomationActionsRequestSchema);
    const { query } = request;

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
  }

  async create(request: CreateAutomationActionRequest, ctx: Context) {
    validate(request, createAutomationActionRequestSchema);

    const entity = await mapToAutomationActionEntity({
      ...request,
      status: AutomationActionStatus.Pending,
    });
    await this.repository.create(entity, ctx);
  }

  async updateActionStatus(
    id: number,
    status: AutomationActionStatus,
    ctx: Context,
  ) {
    const entity = await this.repository.findById(id, ctx);
    if (entity == null) {
      throw notFoundError({ id });
    }

    await this.repository.update(id, { status }, ctx);
  }

  /**
   * Gets the next pending queued/prioritized automation task to do.
   */
  async getNextPending(ctx: Context) {
    const entity = await this.repository.findNextPending(ctx);
    if (entity == null) {
      return null;
    }

    return mapToAutomationActionDto(entity);
  }

  /**
   * Gets the next general automation task to do. These are not stored in the
   * database and should be done after all queued tasks are done.
   */
  async getNextBacklog(ctx: Context) {
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
  }

  private async getPendingSources(ctx: Context) {
    const pendingCpuSources =
      await this.automationSourceRepository.countPendingGroups(
        { query: { filter: { productType: ProductType.Cpu } } },
        ctx,
      );
    const pendingGpuChipsetSources =
      await this.automationSourceRepository.countPendingGroups(
        {
          query: {
            filter: {
              productType: ProductType.Gpu,
              isParent: true,
            },
          },
        },
        ctx,
      );
    const pendingGpuRetailModelSources =
      await this.automationSourceRepository.countPendingGroups(
        {
          query: {
            filter: {
              productType: ProductType.Gpu,
              isChild: true,
            },
          },
        },
        ctx,
      );

    return {
      pendingCpuSources,
      pendingGpuChipsetSources,
      pendingGpuRetailModelSources,
    } as Partial<AutomationStatus>;
  }

  private async getPendingUpdates(ctx: Context) {
    const pendingCpuUpdates = await this.productUpdateRepository.countPending(
      { productType: ProductType.Cpu },
      ctx,
    );
    const pendingGpuChipsetUpdates =
      await this.productUpdateRepository.countPending(
        {
          productType: ProductType.Gpu,
          subProductType: SubProductType.GpuChipset,
        },
        ctx,
      );
    const pendingGpuRetailModelUpdates =
      await this.productUpdateRepository.countPending(
        {
          productType: ProductType.Gpu,
          subProductType: SubProductType.GpuRetailModel,
        },
        ctx,
      );

    return {
      pendingCpuUpdates,
      pendingGpuChipsetUpdates,
      pendingGpuRetailModelUpdates,
    } as Partial<AutomationStatus>;
  }
}
