import { GpuRanksFilter } from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';

export class GpuRanksRepository {
  constructor(protected db: DatabaseClient) {}

  async getPerformanceRanks(
    ids: number[],
    filter?: GpuRanksFilter,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;

    const { where, parameters, nextParameterIndex } =
      this.generateWhere(filter);

    const idsAndRanks: { id: number; rank: number }[] =
      await trx.$queryRawUnsafe(
        `
          SELECT ranks.id, ranks.rank AS rank
          FROM (
            SELECT
              gpu.id,
              CAST(RANK() OVER ( ORDER BY gpu.performance_score DESC ) AS INTEGER) AS rank
            FROM gpus AS gpu
            WHERE gpu.performance_score IS NOT NULL ${where}
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

  async getValueRanks(
    ids: number[],
    filter?: GpuRanksFilter,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;

    const { where, parameters, nextParameterIndex } =
      this.generateWhere(filter);

    const idsAndRanks: { id: number; rank: number }[] =
      await trx.$queryRawUnsafe(
        `
          SELECT ranks.id, ranks.rank AS rank
          FROM (
            SELECT
              gpu.id,
              CAST(RANK() OVER ( ORDER BY gpu.value_score DESC ) AS INTEGER) AS rank
            FROM gpus AS gpu
            WHERE gpu.value_score IS NOT NULL ${where}
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

  private generateWhere(filter?: GpuRanksFilter) {
    const parameters: unknown[] = [];
    const where: string[] = [];
    let nextParameterIndex = 1;

    const isChipset = filter?.isChipset ?? false;
    const isRetailModel = filter?.isRetailModel ?? false;
    const architecture =
      filter?.architecture?.filter((value) => value != null) ?? [];
    const company = filter?.company?.filter((value) => value != null) ?? [];
    const year = filter?.year?.filter((value) => value != null) ?? [];
    const segment = filter?.segment?.filter((value) => value != null) ?? [];

    // Only include ranks for chipsets
    if (isChipset) {
      where.push('gpu.chipset_id IS NULL');
    }
    if (isRetailModel) {
      where.push('gpu.chipset_id IS NOT NULL');
    }

    if (architecture.length > 0) {
      where.push(`gpu.architecture = ANY ($${nextParameterIndex++})`);
      parameters.push(architecture);
    }
    if (company.length > 0) {
      where.push(`gpu.company = ANY ($${nextParameterIndex++})`);
      parameters.push(company);
    }
    if (year.length > 0) {
      where.push(
        `DATE_PART('year', gpu.release_date::date) = ANY ($${nextParameterIndex++})`,
      );
      parameters.push(year);
    }
    if (segment.length > 0) {
      where.push(`gpu.market_segment = ANY ($${nextParameterIndex++})`);
      parameters.push(segment);
    }

    return {
      where: where.length > 0 ? ` AND ${where.join(' AND ')}` : '',
      parameters,
      nextParameterIndex,
    };
  }
}
