import {
  ProductRankKey,
  ProductRanksFilter,
  ProductType,
} from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';

export class ProductRanksRepository {
  constructor(protected db: DatabaseClient) {}

  async getRanks(
    ids: number[],
    key: ProductRankKey,
    filter: ProductRanksFilter,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;

    const tableName = this.getTableName(filter.productType);
    const fieldName = this.getFieldName(key);
    const filterForRank = this.generateRankFilter(key, filter);

    const { where, parameters, nextParameterIndex } =
      this.generateWhere(filterForRank);

    const idsAndRanks: { id: number; rank: number }[] =
      await trx.$queryRawUnsafe(
        `
          SELECT ranks.id, ranks.rank AS rank
          FROM (
            SELECT
              p.id,
              CAST(RANK() OVER ( ORDER BY f.${fieldName} DESC ) AS INTEGER) AS rank
            FROM products p
            INNER JOIN ${tableName} AS f ON p.id = f.product_id
            WHERE p.parent_id IS NULL AND f.${fieldName} IS NOT NULL ${where}
          ) AS ranks
          WHERE ranks.id = ANY ($${nextParameterIndex})
        `,
        ...parameters,
        ids,
      );

    const ranksMap = idsAndRanks.reduce((acc, value) => {
      acc[value.id] = value.rank;
      return acc;
    }, {} as Record<number, number>);

    return ids.map((id) => ranksMap[id] ?? null);
  }

  private getTableName(productType: ProductType) {
    switch (productType) {
      case ProductType.Cpu:
        return 'cpu_fields';
      case ProductType.Gpu:
        return 'gpu_fields';
      default:
        throw new Error(
          `Invalid product type for fetching ranks: ${productType}`,
        );
    }
  }

  private getFieldName(key: ProductRankKey) {
    switch (key) {
      case 'performanceRating':
      case 'performanceRatingForMarketSegment':
      case 'performanceRatingForArchitectureAndMarketSegment':
        return 'performance_rating_value';
      case 'performancePerMsrp':
      case 'performancePerMsrpForMarketSegment':
        return 'performance_per_msrp_value';
      default:
        throw new Error(`Invalid rank key for fetching ranks: ${key}`);
    }
  }

  private generateRankFilter(
    key: ProductRankKey,
    filter: ProductRanksFilter,
  ): ProductRanksFilter {
    switch (key) {
      case 'performanceRating':
        return { productType: filter.productType };
      case 'performanceRatingForMarketSegment':
        return {
          productType: filter.productType,
          segment: filter.segment,
        };
      case 'performanceRatingForArchitectureAndMarketSegment':
        return {
          productType: filter.productType,
          architecture: filter.architecture,
          segment: filter.segment,
        };
      case 'performancePerMsrp':
        return { productType: filter.productType };
      case 'performancePerMsrpForMarketSegment':
        return { productType: filter.productType, segment: filter.segment };
      default:
        throw new Error(`Invalid rank key for fetching ranks: ${key}`);
    }
  }

  private generateWhere(filter: ProductRanksFilter) {
    switch (filter.productType) {
      case ProductType.Cpu:
        return this.generateCpuWhere(filter as ProductRanksFilter);
      case ProductType.Gpu:
        return this.generateGpuWhere(filter as ProductRanksFilter);
      default:
        throw new Error(
          `Invalid product type for fetching ranks: ${filter.productType}`,
        );
    }
  }

  private generateCpuWhere(filter: ProductRanksFilter) {
    const parameters: unknown[] = [];
    const where: string[] = [];
    let nextParameterIndex = 1;

    const segment = filter?.segment?.filter((value) => value != null) ?? [];

    if (segment.length > 0) {
      where.push(`f.market_segment_value = ANY ($${nextParameterIndex++})`);
      parameters.push(segment);
    }

    return {
      where: where.length > 0 ? ` AND ${where.join(' AND ')}` : '',
      parameters,
      nextParameterIndex,
    };
  }

  private generateGpuWhere(filter: ProductRanksFilter) {
    const parameters: unknown[] = [];
    const where: string[] = [];
    let nextParameterIndex = 1;

    const architecture =
      filter?.architecture?.filter((value) => value != null) ?? [];
    const segment = filter?.segment?.filter((value) => value != null) ?? [];

    if (architecture.length > 0) {
      where.push(`f.architecture_value = ANY ($${nextParameterIndex++})`);
      parameters.push(architecture);
    }
    if (segment.length > 0) {
      where.push(`f.market_segment_value = ANY ($${nextParameterIndex++})`);
      parameters.push(segment);
    }

    return {
      where: where.length > 0 ? ` AND ${where.join(' AND ')}` : '',
      parameters,
      nextParameterIndex,
    };
  }
}
