import {
  BaseProductUpdate,
  CpuUpdate,
  GpuProductType,
  GpuUpdate,
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

  const dto: BaseProductUpdate = {
    id: entity.id,

    productType: entity.productType as ProductType,
    productName: entity.productName,

    description: entity.description,
    status: entity.status as ProductUpdateStatus,

    data,
    metadata: entity.metadata as ProductUpdateMeta,
  };

  // Handle type-specific fields
  if (entity.productType === ProductType.Cpu) {
    (dto as CpuUpdate).cpuId = entity.cpuId;
  } else if (entity.productType === ProductType.Gpu) {
    (dto as GpuUpdate).gpuId = entity.gpuId;
    (dto as GpuUpdate).gpuProductType = entity.gpuProductType as GpuProductType;
  }

  return dto as ProductUpdate;
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

    description: dto.description,
    status: dto.status,

    data,
    metadata: dto.metadata,

    createdAt: undefined,
    updatedAt: undefined,

    // CPU specialized fields
    cpuId: dto.productType === ProductType.Cpu ? dto.cpuId : null,

    // GPU specialized fields
    gpuId: dto.productType === ProductType.Gpu ? dto.gpuId : null,
    gpuProductType:
      dto.productType === ProductType.Gpu
        ? (dto as GpuUpdate).gpuProductType
        : null,
  };
}
