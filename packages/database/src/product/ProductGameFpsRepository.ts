import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductGameFpsEntity } from './ProductGameFpsEntity';

interface FindByProductIdsOptions {
  productIds: number[];
}

export class ProductGameFpsRepository {
  constructor(protected db: DatabaseClient) {}

  async findByProductIds(
    options: FindByProductIdsOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    config?.queryCounter();
    const results: ProductGameFpsEntity[] = await db.productGameFps.findMany({
      where: { productId: { in: options.productIds } },
    });

    return results;
  }
}
