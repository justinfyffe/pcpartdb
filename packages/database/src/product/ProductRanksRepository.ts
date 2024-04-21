import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductRanksEntity } from './ProductRankEntity';

interface FindByProductIdsOptions {
  productIds: number[];
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
}
