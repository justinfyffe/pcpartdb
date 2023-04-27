import { Injectable } from '@nestjs/common';
import { mapToDataUpdateDto, mapToDataUpdateDtos } from '@pcpartdb/database';
import { DataUpdate, DataUpdateStatus, GpuDataUpdate } from '@pcpartdb/shared';
import { GpuService } from '../gpu/gpu.service';
import { Context } from '../shared/context';
import { badRequestError, notFoundError } from '../shared/error';
import { DataUpdateRepository } from './data-update.repository';

interface CountUpdatesOptions {
  gpuId?: number;
  status?: DataUpdateStatus;
}

interface GetUpdatesOptions {
  gpuId?: number;
  status?: DataUpdateStatus;
  limit?: number;
  offset?: number;
}

@Injectable()
export class DataUpdateService {
  constructor(
    private dataUpdateRepository: DataUpdateRepository,
    private gpuService: GpuService,
  ) {}

  async countUpdates(options: CountUpdatesOptions, ctx: Context) {
    return await this.dataUpdateRepository.count(options, ctx);
  }

  async getUpdates(options: GetUpdatesOptions, ctx: Context) {
    const entities = await this.dataUpdateRepository.list(options, ctx);
    const dataUpdates: DataUpdate[] = await mapToDataUpdateDtos(entities, {
      includeData: false,
    });
    return dataUpdates;
  }

  async getUpdate(id: number, ctx: Context) {
    const entity = await this.dataUpdateRepository.findById(id, ctx);

    if (entity == null) {
      throw notFoundError({ dataUpdateId: id });
    }

    return await mapToDataUpdateDto(entity);
  }

  async approveUpdate(id: number, ctx: Context) {
    const entity = await this.dataUpdateRepository.findById(id, ctx);

    if (entity == null) {
      throw notFoundError({ dataUpdateId: id });
    }
    if (entity.status !== DataUpdateStatus.Pending) {
      throw badRequestError();
    }

    const dataUpdate = await mapToDataUpdateDto(entity);

    // Update status
    entity.status = DataUpdateStatus.Approved;
    entity.decisionUserId = ctx.user?.id;
    entity.decisionMadeAt = new Date();
    const updatedEntity = await this.dataUpdateRepository.update(
      id,
      entity,
      ctx,
    );

    // Apply diff
    if (dataUpdate.gpuId != null) {
      await this.gpuService.applyDataUpdate(dataUpdate as GpuDataUpdate, ctx);
    }

    return await mapToDataUpdateDto(updatedEntity);
  }

  async rejectUpdate(id: number, ctx: Context) {
    const entity = await this.dataUpdateRepository.findById(id, ctx);

    if (entity == null || entity.status !== DataUpdateStatus.Pending) {
      throw notFoundError({ dataUpdateId: id });
    }

    // Update status
    entity.status = DataUpdateStatus.Rejected;
    entity.decisionUserId = ctx.user?.id;
    entity.decisionMadeAt = new Date();
    const updatedEntity = await this.dataUpdateRepository.update(
      id,
      entity,
      ctx,
    );

    return await mapToDataUpdateDto(updatedEntity);
  }
}
