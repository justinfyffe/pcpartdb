import {
  BaseProductSource,
  GpuProductSource,
  ProductSource,
  ProductSourceKey,
  ProductType,
} from '@pcpartdb/shared';
import { ProductSourceEntity } from '../product';
import { mapToGpuDto } from './gpuMapper';

export function mapToProductSourceDto(row: ProductSourceEntity): ProductSource {
  if (row == null) {
    return null;
  }

  const dto: BaseProductSource = {
    id: row.id,
    groupKey: row.groupKey,
    productType: row.productType as ProductType,
    sourceKey: row.sourceKey as ProductSourceKey,
    externalKey: row.externalKey,
    sourceName: row.sourceName,
    sourceUrl: row.sourceUrl,
    archived: row.archived,
  };

  // Handle type-specific fields
  if (row.productType === ProductType.Cpu) {
    // Nothing specific to CPUs
  } else if (row.productType === ProductType.Gpu) {
    (dto as GpuProductSource).gpuChipsetId = row.gpuChipsetId;
    (dto as GpuProductSource).gpuChipset =
      row.gpuChipset != null ? mapToGpuDto(row.gpuChipset) : undefined;
  }

  return dto;
}

export function mapToProductSourceDtos(entities: ProductSourceEntity[]) {
  const ret: ProductSource[] = [];
  for (let i = 0; i < entities.length; ++i) {
    ret.push(mapToProductSourceDto(entities[i]));
  }
  return ret;
}

export function mapToProductSourceEntity(
  productSource: Partial<ProductSource>,
): ProductSourceEntity {
  if (productSource == null) {
    return null;
  }

  return {
    id: undefined,
    groupKey: productSource.groupKey,
    productType: productSource.productType,
    sourceKey: productSource.sourceKey,
    externalKey: productSource.externalKey,
    sourceName: productSource.sourceName,
    sourceUrl: productSource.sourceUrl,
    archived: productSource.archived,
    createdAt: undefined,
    updatedAt: undefined,

    // GPU-only fields
    gpuChipsetId:
      productSource.productType === ProductType.Gpu
        ? (productSource as GpuProductSource).gpuChipsetId
        : null,
  };
}
