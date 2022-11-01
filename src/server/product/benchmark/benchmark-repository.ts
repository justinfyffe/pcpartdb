import { RepositoryConfig } from '@server/db/repository';
import { BenchmarkModel, BenchmarkModelPojo } from './benchmark-model';

export class BenchmarkRepository {
  async saveOne(benchmark: BenchmarkModelPojo, config?: RepositoryConfig) {
    return await BenchmarkModel.query(config?.trx)
      .insert(benchmark)
      .onConflict(['product_id', 'key'])
      .merge()
      .returning('*');
  }

  async saveMultiple(
    productId: number,
    benchmarks: BenchmarkModelPojo[],
    config?: RepositoryConfig,
  ) {
    // Save the benchmarks
    const benchmarksToSave = benchmarks.map((benchmark) => ({
      ...benchmark,
      productId,
    }));
    if (benchmarksToSave.length > 0) {
      await BenchmarkModel.query(config?.trx)
        .insert(benchmarksToSave)
        .onConflict(['product_id', 'key'])
        .merge()
        .returning('*');
    }

    // Remove benchmarks that weren't in the list
    const usedKeys = benchmarksToSave.map((benchmark) => benchmark.key!);
    await BenchmarkModel.query(config?.trx)
      .where('productId', productId)
      .whereNotIn('key', usedKeys)
      .delete();
  }
}

export const benchmarkRepository = new BenchmarkRepository();
