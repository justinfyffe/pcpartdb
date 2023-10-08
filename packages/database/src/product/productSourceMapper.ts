import { ProductSource } from '@pcpartdb/shared';
import { ProductSourceEntity } from '.';

export function mapToProductSourceDto(entity: ProductSourceEntity) {
  if (entity == null) {
    return null;
  }

  return {
    id: entity.id,
    productId: entity.productId,

    sourceKey: entity.sourceKey,
    sourceUrl: entity.sourceUrl,

    metadata: entity.metadata,

    scrapedAt: entity.scrapedAt?.getTime() || undefined,
  } as ProductSource;
}

export function mapToProductSourceDtos(entities: ProductSourceEntity[]) {
  return entities.map((entity) => mapToProductSourceDto(entity));
}

export function mapToProductSourceEntity(dto: ProductSource) {
  if (dto == null) {
    return null;
  }

  return {
    id: undefined,
    productId: undefined,

    sourceKey: dto.sourceKey,
    sourceUrl: dto.sourceUrl,

    metadata: dto.metadata,

    scrapedAt: dto.scrapedAt != null ? new Date(dto.scrapedAt) : undefined,
  } as ProductSourceEntity;
}
