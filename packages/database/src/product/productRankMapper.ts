import { ProductRanks } from '@pcpartdb/shared';
import { ProductRankEntity } from './ProductRankEntity';

export function mapToProductRankDto(entity: ProductRankEntity) {
  if (entity == null) {
    return null;
  }

  return entity.ranks as ProductRanks;
}

export function mapToProductRankDtos(entities: ProductRankEntity[]) {
  if (entities == null) {
    return null;
  }

  return entities.map((entity) => mapToProductRankDto(entity));
}

export function mapToProductRankEntity(ranks: ProductRanks) {
  if (ranks == null) {
    return null;
  }

  return {
    productId: undefined,
    ranks,
  } as ProductRankEntity;
}
