import {
  BenchmarkKey,
  buildProductRankKey,
  ProductRank,
  ProductRanks,
  RankType,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { ProductRanksEntity } from './ProductRankEntity';

interface MapToDtoOptions {
  includeRanks?: boolean | BenchmarkKey[];
}

export function mapToProductRanksDto(
  entity: ProductRanksEntity,
  options?: MapToDtoOptions,
) {
  if (entity == null || !options?.includeRanks) {
    return null;
  }

  // If the `includeRanks` is an array, we should filter for just
  // those ranks
  if (Array.isArray(options.includeRanks)) {
    if (options.includeRanks.length === 0) {
      return null;
    }

    return options.includeRanks.reduce((acc, benchmark) => {
      const perfRankKey = buildProductRankKey({
        type: RankType.Performance,
        benchmark,
      });
      const perfPerDollarRankKey = buildProductRankKey({
        type: RankType.PerformancePerDollar,
        benchmark,
      });

      acc[perfRankKey] = (entity.ranks as Prisma.JsonObject)?.[
        perfRankKey
      ] as ProductRank;
      acc[perfPerDollarRankKey] = (entity.ranks as Prisma.JsonObject)?.[
        perfPerDollarRankKey
      ] as ProductRank;
      return acc;
    }, {} as ProductRanks);
  }

  return entity.ranks as ProductRanks;
}

export function mapToProductRanksEntity(ranks: ProductRanks) {
  if (ranks == null) {
    return null;
  }

  return {
    productId: undefined,
    ranks,
  } as ProductRanksEntity;
}
