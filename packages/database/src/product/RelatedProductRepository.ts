import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { RelatedProductEntity } from './RelatedProductEntity';

interface FindByProductIdsOptions {
  productIds: number[];
}

export class RelatedProductRepository {
  constructor(protected db: DatabaseClient) {}

  async findByProductIds(
    options: FindByProductIdsOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    config?.queryCounter();
    const result: RelatedProductEntity[] = await db.relatedProduct.findMany({
      where: { productId: { in: options.productIds } },
    });
    return result.filter(
      (related) => related.productId !== related.relatedProductId,
    );
  }
}
