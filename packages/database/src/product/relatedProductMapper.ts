import {
  ProductFieldKey,
  RelatedProduct,
  RelatedProductType,
} from '@pcpartdb/shared';
import { mapToProductDto } from './productMapper';
import { RelatedProductEntity } from './RelatedProductEntity';

interface MapToDtoOptions {
  fields?: Set<ProductFieldKey>;
}

export async function mapToRelatedProductDto(
  entity: RelatedProductEntity,
  options?: MapToDtoOptions,
) {
  if (entity == null) {
    return null;
  }

  return {
    type: entity.type as RelatedProductType,
    productId: entity.productId,
    relatedProductId: entity.relatedProductId,

    relatedProduct: await mapToProductDto(entity.relatedProduct, {
      fields: options?.fields,
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
    type: dto.type,
    productId: undefined,
    relatedProductId: dto.relatedProductId,
  } as RelatedProductEntity;
}
