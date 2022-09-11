import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '../../db/repository';
import {
  ProductBenchmarkModel,
  ProductBenchmarkModelPojo,
} from './product-benchmark.model';

@Injectable()
export class ProductBenchmarkRepository {
  async save(benchmark: ProductBenchmarkModelPojo, config?: RepositoryConfig) {
    return await ProductBenchmarkModel.query(config?.trx)
      .insert(benchmark)
      .onConflict(['product_id', 'key'])
      .merge()
      .returning('*');
  }

  async saveMultiple(
    productId: number,
    benchmarks: ProductBenchmarkModelPojo[],
    config?: RepositoryConfig,
  ) {
    // Save the benchmarks
    const benchmarksToSave = benchmarks.map((benchmark) => ({
      ...benchmark,
      productId,
    }));
    await ProductBenchmarkModel.query(config?.trx)
      .insert(benchmarksToSave)
      .onConflict(['product_id', 'key'])
      .merge()
      .returning('*');

    // Remove benchmarks that weren't in the list

    const usedKeys = benchmarksToSave.map((benchmark) => benchmark.key!);
    await ProductBenchmarkModel.query(config?.trx)
      .where('productId', productId)
      .whereNotIn('key', usedKeys)
      .delete();
  }
}
