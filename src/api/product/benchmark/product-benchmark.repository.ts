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
      .onConflict(['productId', 'key'])
      .merge()
      .returning('*');
  }
}
