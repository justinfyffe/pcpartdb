import { BenchmarkKey } from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductRanksEntity } from './ProductRankEntity';

interface FindByProductIdsOptions {
  productIds: number[];
}

interface FindBenchmarkRankOptions {
  benchmark: BenchmarkKey;
  value: number;
}

interface CountBenchmarkRanksOptions {
  benchmark: BenchmarkKey;
}

export class ProductRanksRepository {
  constructor(protected db: DatabaseClient) {}

  async findByProductIds(
    options: FindByProductIdsOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    const results: ProductRanksEntity[] = await db.productRanks.findMany({
      where: { productId: { in: options.productIds } },
    });

    return results;
  }

  async findBenchmarkPerformanceRank(
    options: FindBenchmarkRankOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    const result = await await db.productBenchmark.aggregate({
      _count: { productId: true },
      where: {
        benchmarkKey: options.benchmark,
        value: { gt: options.value },
      },
    });

    const rank = result?._count?.productId;
    return rank != null ? rank + 1 : null;
  }

  async countBenchmarkPerformanceRanks(
    options: CountBenchmarkRanksOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    const result = await await db.productBenchmark.aggregate({
      _count: { productId: true },
      where: { benchmarkKey: options.benchmark },
    });

    return result?._count?.productId ?? null;
  }

  async findBenchmarkPerformancePerMsrpRank(
    options: FindBenchmarkRankOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    const result = await await db.productBenchmark.aggregate({
      _count: { productId: true },
      where: {
        benchmarkKey: options.benchmark,
        valuePerMsrp: { gt: options.value },
      },
    });

    const rank = result?._count?.productId;
    return rank != null ? rank + 1 : null;
  }
}
