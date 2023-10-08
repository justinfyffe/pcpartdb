import { ProductImage } from '@pcpartdb/shared';
import { mapToImageDto } from '../mappers';
import { ProductImageEntity } from '.';

export function mapToProductImageDto(entity: ProductImageEntity) {
  if (entity == null) {
    return null;
  }

  return {
    productId: entity.productId,
    imageId: entity.imageId,
    image: entity.image != null ? mapToImageDto(entity.image) : undefined,
  } as ProductImage;
}

export function mapToProductImageDtos(entities: ProductImageEntity[]) {
  const ret = [];
  for (let i = 0; i < entities.length; ++i) {
    ret.push(mapToProductImageDto(entities[i]));
  }
  return ret;
}

export function mapToProductImageEntity(dto: ProductImage) {
  return {
    productId: undefined,
    imageId: dto.imageId,
  } as ProductImageEntity;
}
