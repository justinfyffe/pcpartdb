import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductImageEntity } from './ProductImageEntity';

interface FindByProductIdsOptions {
  productIds: number[];
}

export class ProductImageRepository {
  constructor(protected db: DatabaseClient) {}

  async findByProductIds(
    options: FindByProductIdsOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    config?.queryCounter();
    const results: ProductImageEntity[] = await db.productImage.findMany({
      where: { productId: { in: options.productIds } },
      include: { image: true },
    });

    return results;
  }
}
