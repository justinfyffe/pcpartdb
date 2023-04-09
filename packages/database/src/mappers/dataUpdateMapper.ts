import {
  DataUpdate,
  DataUpdateDiff,
  DataUpdateMeta,
  DataUpdateSource,
  DataUpdateStatus,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DataUpdateEntity } from '../data-update';

export function mapToDataUpdateDto(entity: DataUpdateEntity): DataUpdate {
  return {
    id: entity.id,
    decisionUserId: entity.decisionUserId,
    gpuId: entity.gpuId,
    description: entity.description,
    status: entity.status as DataUpdateStatus,
    updateSource: entity.updateSource as DataUpdateSource,
    diff: entity.diff as unknown as DataUpdateDiff,
    metadata: entity.metadata as DataUpdateMeta,
    decisionMadeAt: entity.decisionMadeAt.getTime(),
  };
}

export function mapToDataUpdateDtos(entities: DataUpdateEntity[]) {
  return entities.map((entity) => mapToDataUpdateDto(entity));
}

export function mapToDataUpdateEntity(dto: DataUpdate): DataUpdateEntity {
  return {
    id: dto.id,
    decisionUserId: dto.decisionUserId,
    gpuId: dto.gpuId,
    description: dto.description,
    status: dto.status,
    updateSource: dto.updateSource,
    diff: dto.diff as unknown as Prisma.JsonValue,
    metadata: dto.metadata,
    decisionMadeAt: new Date(dto.decisionMadeAt),
    createdAt: undefined,
    updatedAt: undefined,
  };
}
