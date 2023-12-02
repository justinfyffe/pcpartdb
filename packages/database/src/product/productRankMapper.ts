import { ProductRank } from '@pcpartdb/shared';
import { ProductRankEntity } from './ProductRankEntity';

export function mapToProductRankDto(entity: ProductRankEntity) {
  if (entity == null) {
    return null;
  }

  return {
    id: entity.id,
    productId: entity.productId,
    rankKey: entity.rankKey,
    rank: entity.rank,
    totalRanked: entity.totalRanked,
    metadata: entity.metadata,
  } as ProductRank;
}

export function mapToProductRankDtos(entities: ProductRankEntity[]) {
  if (entities == null) {
    return null;
  }

  return entities.map((entity) => mapToProductRankDto(entity));
}

export function mapToProductRankEntity(dto: ProductRank) {
  if (dto == null) {
    return null;
  }

  return {
    id: undefined,
    productId: undefined,
    rankKey: dto.rankKey,
    rank: dto.rank,
    totalRanked: dto.totalRanked,
    metadata: dto.metadata,
  } as ProductRankEntity;
}
