import { ProductFieldKey, RelatedProduct } from '@pcpartdb/shared';
import { mapToProductDto } from './productMapper';
import { RelatedProductEntity } from './RelatedProductEntity';

interface MapToDtoOptions {
  fields?: ProductFieldKey[];
  includeBenchmarks?: boolean;
}

export async function mapToRelatedProductDto(
  entity: RelatedProductEntity,
  options?: MapToDtoOptions,
) {
  if (entity == null) {
    return null;
  }

  return {
    productId: entity.productId,
    relatedProductId: entity.relatedProductId,
    relatedProductKey: entity.relatedProductKey,

    relatedProduct: await mapToProductDto(entity.relatedProduct, {
      fields: options?.fields,
      includeBenchmarks: options?.includeBenchmarks,
    }),
  } as RelatedProduct;
}

export async function mapToRelatedProductDtos(
  entities: RelatedProductEntity[],
  options?: MapToDtoOptions,
) {
  if (entities == null) {
    return null;
  }

  const ret: RelatedProduct[] = [];
  for (let i = 0; i < entities.length; ++i) {
    ret.push(await mapToRelatedProductDto(entities[i], options));
  }
  return ret;
}

export function mapToRelatedProductEntity(dto: RelatedProduct) {
  if (dto == null) {
    return null;
  }

  return {
    productId: undefined,
    relatedProductId: dto.relatedProductId,
    relatedProductKey: dto.relatedProductKey,
  } as RelatedProductEntity;
}

export function mapToRelatedProductEntities(dtos: RelatedProduct[]) {
  return dtos
    .map((dto) => mapToRelatedProductEntity(dto))
    .filter((e) => e != null);
}
