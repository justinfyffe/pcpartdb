import { Injectable } from '@nestjs/common';
import { mapToDataUpdateDto, mapToDataUpdateDtos } from '@pcpartdb/database';
import { DataUpdate, DataUpdateStatus } from '@pcpartdb/shared';
import { GpuService } from '../gpu/gpu.service';
import { Context } from '../shared/context';
import { notFoundError } from '../shared/error';
import { DataUpdateRepository } from './data-update.repository';

interface GetPendingUpdatesOptions {
  limit?: number;
  offset?: number;
}

@Injectable()
export class DataUpdateService {
  constructor(
    private dataUpdateRepository: DataUpdateRepository,
    private gpuService: GpuService,
  ) {}

  async getPendingUpdates(options: GetPendingUpdatesOptions, ctx: Context) {
    const entities = await this.dataUpdateRepository.listPending(options, ctx);
    const dataUpdates: DataUpdate[] = mapToDataUpdateDtos(entities);
    return dataUpdates;
  }

  async approveUpdate(id: number, ctx: Context) {
    const entity = await this.dataUpdateRepository.findById(id, ctx);

    if (entity == null) {
      throw notFoundError({ dataUpdateId: id });
    }

    const dataUpdate = mapToDataUpdateDto(entity);
    if (dataUpdate.gpuId != null) {
      await this.gpuService.applyDataUpdate(dataUpdate, ctx);
    }

    entity.status = DataUpdateStatus.Approved;
    entity.decisionUserId = ctx.user?.id;
    entity.decisionMadeAt = new Date();

    const updatedEntity = await this.dataUpdateRepository.update(
      id,
      entity,
      ctx,
    );
    return mapToDataUpdateDto(updatedEntity);
  }

  async rejectUpdate(id: number, ctx: Context) {
    const entity = await this.dataUpdateRepository.findById(id, ctx);

    if (entity == null) {
      throw notFoundError({ dataUpdateId: id });
    }

    entity.status = DataUpdateStatus.Rejected;
    entity.decisionUserId = ctx.user?.id;
    entity.decisionMadeAt = new Date();

    const updatedEntity = await this.dataUpdateRepository.update(
      id,
      entity,
      ctx,
    );
    return mapToDataUpdateDto(updatedEntity);
  }
}
