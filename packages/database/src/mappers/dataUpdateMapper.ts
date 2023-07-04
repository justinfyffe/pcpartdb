import {
  DataUpdate,
  DataUpdateMeta,
  DataUpdateSource,
  DataUpdateStatus,
} from '@pcpartdb/shared';
import * as zlib from 'zlib';
import { DataUpdateEntity } from '../data-update';

interface MapToDtoOptions {
  includeData?: boolean;
}

export async function mapToDataUpdateDto<TUpdateData = unknown>(
  entity: DataUpdateEntity,
  options?: MapToDtoOptions,
): Promise<DataUpdate> {
  const includeData = options?.includeData ?? true;

  let data: TUpdateData = null;
  if (includeData) {
    data = await new Promise<TUpdateData>((resolve, reject) => {
      zlib.gunzip(entity.data, (err, result) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(JSON.parse(result.toString('utf-8')) as TUpdateData);
        }
      });
    });
  }

  return {
    id: entity.id,
    decisionUserId: entity.decisionUserId,
    cpuId: entity.cpuId,
    gpuId: entity.gpuId,
    description: entity.description,
    status: entity.status as DataUpdateStatus,
    updateSource: entity.updateSource as DataUpdateSource,
    data,
    metadata: entity.metadata as DataUpdateMeta,
    decisionMadeAt: entity.decisionMadeAt?.getTime() || null,
  };
}

interface MapToDtoOptions {
  includeData?: boolean;
}

export async function mapToDataUpdateDtos<TUpdateData = unknown>(
  entities: DataUpdateEntity[],
  options?: MapToDtoOptions,
) {
  const ret: DataUpdate[] = [];
  for (let i = 0; i < entities.length; ++i) {
    ret.push(await mapToDataUpdateDto<TUpdateData>(entities[i], options));
  }
  return ret;
}

export async function mapToDataUpdateEntity(
  dto: DataUpdate,
): Promise<DataUpdateEntity> {
  const data = await new Promise<Buffer>((resolve, reject) => {
    zlib.gzip(Buffer.from(JSON.stringify(dto.data)), (err, result) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  return {
    id: dto.id,
    decisionUserId: dto.decisionUserId,
    cpuId: dto.cpuId,
    gpuId: dto.gpuId,
    description: dto.description,
    status: dto.status,
    updateSource: dto.updateSource,
    data,
    metadata: dto.metadata,
    decisionMadeAt:
      dto.decisionMadeAt != null ? new Date(dto.decisionMadeAt) : null,
    createdAt: undefined,
    updatedAt: undefined,
  };
}
