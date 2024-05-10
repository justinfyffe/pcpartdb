import { Injectable } from '@nestjs/common';
import {
  AutomationStatus,
  ProductType,
  updateAutomationStatusSchema,
} from '@pcpartdb/shared';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { ProductUpdateRepository } from '../product/repositories';
import { Context } from '../shared/context';
import { badRequestError } from '../shared/error';
import { dataPath } from '../shared/utils';
import { validate } from '../shared/validation/validate';
import { AutomationSourceRepository } from './automation-source.repository';

const CONFIG_FILE = 'automation.json';

@Injectable()
export class AutomationService {
  constructor(
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

  private async getPendingSources(ctx: Context) {
    const pendingCpuSources =
      await this.automationSourceRepository.countPendingGroups(
        { query: { filter: { productType: ProductType.Cpu } } },
        ctx,
      );
    const pendingGpuSources =
      await this.automationSourceRepository.countPendingGroups(
        {
          query: {
            filter: { productType: ProductType.Gpu },
          },
        },
        ctx,
      );

    return {
      pendingCpuSources,
      pendingGpuSources,
    } as Partial<AutomationStatus>;
  }

  private async getPendingUpdates(ctx: Context) {
    const pendingCpuUpdates = await this.productUpdateRepository.countPending(
      { productType: ProductType.Cpu },
      ctx,
    );
    const pendingGpuUpdates = await this.productUpdateRepository.countPending(
      { productType: ProductType.Gpu },
      ctx,
    );

    return {
      pendingCpuUpdates,
      pendingGpuUpdates: pendingGpuUpdates,
    } as Partial<AutomationStatus>;
  }
}
