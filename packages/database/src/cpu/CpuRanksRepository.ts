import { CpuRanksFilter } from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';

export class CpuRanksRepository {
  constructor(protected db: DatabaseClient) {}

  async getPerformanceRanks(
    ids: number[],
    filter?: CpuRanksFilter,
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
              cpu.id,
              CAST(RANK() OVER ( ORDER BY cpu.performance_score DESC ) AS INTEGER) AS rank
            FROM cpus AS cpu
            WHERE cpu.performance_score IS NOT NULL ${where}
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
    filter?: CpuRanksFilter,
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
              cpu.id,
              CAST(RANK() OVER ( ORDER BY cpu.value_score DESC ) AS INTEGER) AS rank
            FROM cpus AS cpu
            WHERE cpu.value_score IS NOT NULL ${where}
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

  private generateWhere(filter?: CpuRanksFilter) {
    const parameters: unknown[] = [];
    const where: string[] = [];
    let nextParameterIndex = 1;

    const segment = filter?.segment?.filter((value) => value != null) ?? [];

    if (segment.length > 0) {
      where.push(`cpu.market_segments && $${nextParameterIndex++}`);
      parameters.push(segment);
    }

    return {
      where: where.length > 0 ? ` AND ${where.join(' AND ')}` : '',
      parameters,
      nextParameterIndex,
    };
  }
}
