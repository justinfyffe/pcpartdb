import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductBenchmarkEntity } from './ProductBenchmarkEntity';

interface FindByProductIdsOptions {
  productIds: number[];
}

export class ProductBenchmarkRepository {
  constructor(protected db: DatabaseClient) {}

  async findByProductIds(
    options: FindByProductIdsOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    const results: ProductBenchmarkEntity[] =
      await db.productBenchmark.findMany({
        where: { productId: { in: options.productIds } },
      });

    return results;
  }
}
