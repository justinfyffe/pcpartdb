import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductSourceEntity } from './ProductSourceEntity';

interface FindByProductIdsOptions {
  productIds: number[];
}

export class ProductSourceRepository {
  constructor(protected db: DatabaseClient) {}

  async findByProductIds(
    options: FindByProductIdsOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    config?.queryCounter();
    const results: ProductSourceEntity[] = await db.productSource.findMany({
      where: { productId: { in: options.productIds } },
    });

    return results;
  }
}
