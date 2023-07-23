import {
  ProductType,
  ProductUpdate,
  ProductUpdateMeta,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { ProductUpdateEntity } from '../product';
import { gzipData, unzipData } from './utils';

interface MapToDtoOptions {
  includeData?: boolean;
}

export async function mapToProductUpdateDto<TUpdateData = unknown>(
  entity: ProductUpdateEntity,
  options?: MapToDtoOptions,
): Promise<ProductUpdate> {
  const includeData = options?.includeData ?? true;

  let data: TUpdateData = null;
  if (includeData) {
    data = await unzipData(entity.data);
  }

  return {
    id: entity.id,

    productType: entity.productType as ProductType,
    productName: entity.productName,
    productCompany: entity.productCompany,

    description: entity.description,
    status: entity.status as ProductUpdateStatus,

    data,
    metadata: entity.metadata as ProductUpdateMeta,

    cpuId: entity.cpuId,
    gpuId: entity.gpuId,

    statusUpdatedAt: entity.statusUpdatedAt?.getTime() || null,
  };
}

interface MapToDtoOptions {
  includeData?: boolean;
}

export async function mapToProductUpdateDtos<TUpdateData = unknown>(
  entities: ProductUpdateEntity[],
  options?: MapToDtoOptions,
) {
  const ret: ProductUpdate[] = [];
  for (let i = 0; i < entities.length; ++i) {
    ret.push(await mapToProductUpdateDto<TUpdateData>(entities[i], options));
  }
  return ret;
}

export async function mapToProductUpdateEntity(
  dto: ProductUpdate,
): Promise<ProductUpdateEntity> {
  const data = await gzipData(dto.data);

  return {
    id: dto.id,

    productType: dto.productType,
    productName: dto.productName,
    productCompany: dto.productCompany,

    description: dto.description,
    status: dto.status,

    data,
    metadata: dto.metadata,

    cpuId: dto.cpuId,
    gpuId: dto.gpuId,

    statusUpdatedAt:
      dto.statusUpdatedAt != null ? new Date(dto.statusUpdatedAt) : null,
    createdAt: undefined,
    updatedAt: undefined,
  };
}
