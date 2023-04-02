import { Injectable } from '@nestjs/common';
import { Database, RepositoryConfig } from '../../database';

interface GetRanksOptions {
  company?: string[];
}

@Injectable()
export class GpuRanksRepository {
  constructor(private db: Database) {}

  async getPerformanceRanks(
    ids: number[],
    options?: GetRanksOptions,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;

    const { where, parameters, nextParameterIndex } =
      this.generateWhere(options);

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
    options?: GetRanksOptions,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;

    const { where, parameters, nextParameterIndex } =
      this.generateWhere(options);

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

  private generateWhere(options?: GetRanksOptions) {
    const parameters: unknown[] = [];
    const where: string[] = [];
    let nextParameterIndex = 1;

    if (options?.company != null && options.company.length > 0) {
      where.push(`gpu.company = ANY ($${nextParameterIndex++})`);
      parameters.push(options.company);
    }

    return {
      where: where.length > 0 ? ` AND ${where.join('AND')}` : '',
      parameters,
      nextParameterIndex,
    };
  }
}
