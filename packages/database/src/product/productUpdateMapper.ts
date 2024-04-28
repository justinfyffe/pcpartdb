import {
  ProductType,
  ProductUpdate,
  ProductUpdateMeta,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { gzipData, unzipData } from '../mappers/utils';
import { ProductUpdateEntity } from '.';

interface MapToDtoOptions {
  includeData?: boolean;
}

export async function mapToProductUpdateDto<TUpdateData = unknown>(
  entity: ProductUpdateEntity,
  options?: MapToDtoOptions,
) {
  if (entity == null) {
    return null;
  }

  const includeData = options?.includeData ?? true;

  let data: TUpdateData = null;
  if (includeData) {
    data = await unzipData(entity.data);
  }

  const dto: ProductUpdate = {
    id: entity.id,

    productType: entity.productType as ProductType,
    productName: entity.productName,

    description: entity.description,
    status: entity.status as ProductUpdateStatus,

    data,
    metadata: entity.metadata as ProductUpdateMeta,

    productId: entity.productId,

    startedAt: entity.startedAt?.getTime() || undefined,
    finishedAt: entity.finishedAt?.getTime() || undefined,
  };

  return dto as ProductUpdate;
}

export async function mapToProductUpdateDtos<TUpdateData = unknown>(
  entities: ProductUpdateEntity[],
  options?: MapToDtoOptions,
) {
  if (entities == null) {
    return null;
  }

  const ret: ProductUpdate[] = [];
  for (let i = 0; i < entities.length; ++i) {
    ret.push(await mapToProductUpdateDto<TUpdateData>(entities[i], options));
  }
  return ret;
}

export async function mapToProductUpdateEntity(dto: ProductUpdate) {
  if (dto == null) {
    return null;
  }

  const data = await gzipData(dto.data);

  return {
    id: undefined,

    productType: dto.productType,
    productName: dto.productName,

    description: dto.description,
    status: dto.status,

    data,
    metadata: dto.metadata,

    startedAt: dto.startedAt != null ? new Date(dto.startedAt) : undefined,
    finishedAt: dto.finishedAt != null ? new Date(dto.finishedAt) : undefined,

    createdAt: undefined,
    updatedAt: undefined,

    productId: dto.productId,
  } as ProductUpdateEntity;
}
