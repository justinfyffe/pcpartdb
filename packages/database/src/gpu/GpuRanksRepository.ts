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

    const idsAndRanks: { gpu_id: number; rank: number }[] =
      await trx.$queryRawUnsafe(
        `
          SELECT ranks.gpu_id, ranks.rank AS rank
          FROM (
            SELECT
              benchmark.gpu_id,
              CAST(RANK() OVER ( ORDER BY benchmark.performance_score DESC ) AS INTEGER) AS rank
            FROM gpu_benchmarks AS benchmark
            INNER JOIN gpus AS gpu ON benchmark.gpu_id = gpu.id
            INNER JOIN gpu_specs AS spec ON benchmark.gpu_id = spec.gpu_id
            WHERE benchmark.performance_score IS NOT NULL ${where}
          ) AS ranks
          WHERE ranks.gpu_id = ANY ($${nextParameterIndex})
        `,
        ...parameters,
        ids,
      );

    const ranksMap = idsAndRanks.reduce((acc, value) => {
      acc[value.gpu_id] = value.rank;
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

    const idsAndRanks: { gpu_id: number; rank: number }[] =
      await trx.$queryRawUnsafe(
        `
          SELECT ranks.gpu_id, ranks.rank AS rank
          FROM (
            SELECT
              benchmark.gpu_id,
              CAST(RANK() OVER ( ORDER BY benchmark.value_score DESC ) AS INTEGER) AS rank
            FROM gpu_benchmarks AS benchmark
            INNER JOIN gpus AS gpu ON benchmark.gpu_id = gpu.id
            INNER JOIN gpu_specs AS spec ON benchmark.gpu_id = spec.gpu_id
            WHERE benchmark.value_score IS NOT NULL ${where}
          ) AS ranks
          WHERE ranks.gpu_id = ANY ($${nextParameterIndex})
        `,
        ...parameters,
        ids,
      );

    const ranksMap = idsAndRanks.reduce((acc, value) => {
      acc[value.gpu_id] = value.rank;
      return acc;
    }, {} as Record<number, number>);

    return ids.map((id) => ranksMap[id] ?? null);
  }

  private generateWhere(filter?: GpuRanksFilter) {
    const parameters: unknown[] = [];
    const where: string[] = [];
    let nextParameterIndex = 1;

    if (filter?.architecture != null && filter.architecture.length > 0) {
      where.push(`spec.architecture = ANY ($${nextParameterIndex++})`);
      parameters.push(filter.architecture);
    }
    if (filter?.company != null && filter.company.length > 0) {
      where.push(`gpu.company = ANY ($${nextParameterIndex++})`);
      parameters.push(filter.company);
    }
    if (filter?.year != null) {
      where.push(
        `DATE_PART('year', gpu.release_date::date) = ANY ($${nextParameterIndex++})`,
      );
      parameters.push(filter.year);
    }
    if (filter?.segment != null) {
      where.push(`gpu.market_segment = ANY ($${nextParameterIndex++})`);
      parameters.push(filter.segment);
    }

    return {
      where: where.length > 0 ? ` AND ${where.join(' AND ')}` : '',
      parameters,
      nextParameterIndex,
    };
  }
}
