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
  GpuProductType,
  ListAutomationActionsRequest,
  ListAutomationActionsResponse,
  ProductType,
  UpdateCpuActionData,
  UpdateGpuActionData,
  ValidationErrorType,
} from '@pcpartdb/shared';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { CpuRepository } from '../product/cpu/cpu.repository';
import { GpuRepository } from '../product/gpu/gpu.repository';
import { ProductSourceRepository } from '../product/product-source.repository';
import { ProductUpdateRepository } from '../product/product-update.repository';
import { Context } from '../shared/context';
import {
  badRequestError,
  internalServerError,
  notFoundError,
} from '../shared/error';
import { configPath } from '../shared/utils';
import { validate } from '../shared/validation/validate';
import { AutomationRepository } from './automation.repository';
import {
  createAutomationActionRequestValidator,
  listAutomationActionsRequestValidator,
  updateAutomationStatusValidaor,
} from './automation.validators';

const CONFIG_FILE = 'automation.json';

@Injectable()
export class AutomationService {
  constructor(
    private repository: AutomationRepository,
    private cpuRepository: CpuRepository,
    private gpuRepository: GpuRepository,
    private productSourceRepository: ProductSourceRepository,
    private productUpdateRepository: ProductUpdateRepository,
  ) {}

  async getStatus(ctx: Context) {
    const statusJson = fs.existsSync(configPath(CONFIG_FILE))
      ? await fsPromises.readFile(configPath(CONFIG_FILE), 'utf-8')
      : '{}';

    const status: AutomationStatus = {
      enabled: false,
      ...(JSON.parse(statusJson) || {}),
      ...this.getPendingSources(ctx),
    };

    return status;
  }

  async updateStatus(status: Partial<AutomationStatus>, _ctx: Context) {
    validate(status, updateAutomationStatusValidaor);

    if (status.enabled == null) {
      throw badRequestError();
    }

    const statusToSave = {
      enabled: status.enabled,
    };

    await fsPromises.writeFile(
      configPath(CONFIG_FILE),
      JSON.stringify(statusToSave, undefined, 2),
      'utf-8',
    );
  }

  async listPending(request: ListAutomationActionsRequest, ctx: Context) {
    validate(request, listAutomationActionsRequestValidator);
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
    validate(request, createAutomationActionRequestValidator);

    const entity = await mapToAutomationActionEntity({
      ...request,
      status: AutomationActionStatus.Pending,
    });
    await this.repository.create(entity, ctx);
  }

  async cancel(id: number, ctx: Context) {
    const entity = await this.repository.findById(id, ctx);
    if (entity == null) {
      throw notFoundError({ id });
    } else if (entity.status !== AutomationActionStatus.Pending) {
      throw badRequestError({
        property: 'status',
        constraint: ValidationErrorType.InvalidStatus,
      });
    }

    await this.repository.update(
      id,
      { status: AutomationActionStatus.Canceled },
      ctx,
    );
  }

  async markAsProcessing(id: number, ctx: Context) {
    const entity = await this.repository.findById(id, ctx);
    if (entity == null) {
      throw notFoundError({ id });
    } else if (entity.status !== AutomationActionStatus.Pending) {
      throw badRequestError({
        property: 'status',
        constraint: ValidationErrorType.InvalidStatus,
      });
    }

    await this.repository.update(
      id,
      { status: AutomationActionStatus.Processing },
      ctx,
    );
  }

  async markAsProcessed(id: number, ctx: Context) {
    const entity = await this.repository.findById(id, ctx);
    if (entity == null) {
      throw notFoundError({ id });
    } else if (entity.status !== AutomationActionStatus.Processing) {
      throw badRequestError({
        property: 'status',
        constraint: ValidationErrorType.InvalidStatus,
      });
    }

    await this.repository.update(
      id,
      { status: AutomationActionStatus.Processed },
      ctx,
    );
  }

  async markAsFailed(id: number, ctx: Context) {
    const entity = await this.repository.findById(id, ctx);
    if (entity == null) {
      throw notFoundError({ id });
    } else if (
      entity.status !== AutomationActionStatus.Pending &&
      entity.status !== AutomationActionStatus.Processing
    ) {
      throw badRequestError({
        property: 'status',
        constraint: ValidationErrorType.InvalidStatus,
      });
    }

    await this.repository.update(
      id,
      { status: AutomationActionStatus.Failed },
      ctx,
    );
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
    // Find next products to update
    const nextCpuToUpdate = await this.cpuRepository.findNextToBeUpdated(ctx);
    const nextGpuToUpdate = await this.gpuRepository.findNextToBeUpdated(ctx);
    const nextProductsToUpdate = [
      { type: ProductType.Cpu, product: nextCpuToUpdate },
      { type: ProductType.Gpu, product: nextGpuToUpdate },
    ];

    // Compare automation timestamps, choose earliest one.
    const { type: typeToUpdate, product: productToUpdate } =
      nextProductsToUpdate.sort(
        (a, b) =>
          a.product.automationTimestamp.getTime() -
          b.product.automationTimestamp.getTime(),
      )[0];

    // Get action details, and update product's automation timestamp
    let actionType: AutomationActionType;
    let payload: UpdateCpuActionData | UpdateGpuActionData;
    productToUpdate.automationTimestamp = new Date();
    if (typeToUpdate === ProductType.Cpu) {
      actionType = AutomationActionType.UpdateCpu;
      payload = { cpuId: productToUpdate.id };
      await this.cpuRepository.update(productToUpdate.id, productToUpdate, ctx);
    } else if (typeToUpdate === ProductType.Gpu) {
      actionType = AutomationActionType.UpdateGpu;
      payload = { gpuId: productToUpdate.id };
      await this.gpuRepository.update(productToUpdate.id, productToUpdate, ctx);
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
      await this.productSourceRepository.countPendingGroups(
        {
          query: { filter: { productType: ProductType.Cpu } },
        },
        ctx,
      );
    const pendingGpuChipsetSources =
      await this.productSourceRepository.countPendingGroups(
        {
          query: {
            filter: {
              productType: ProductType.Gpu,
              gpuProductType: GpuProductType.Chipset,
            },
          },
        },
        ctx,
      );
    const pendingGpuRetailModelSources =
      await this.productSourceRepository.countPendingGroups(
        {
          query: {
            filter: {
              productType: ProductType.Gpu,
              gpuProductType: GpuProductType.RetailModel,
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
          gpuProductType: GpuProductType.Chipset,
        },
        ctx,
      );
    const pendingGpuRetailModelUpdates =
      await this.productUpdateRepository.countPending(
        {
          productType: ProductType.Gpu,
          gpuProductType: GpuProductType.RetailModel,
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
