import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '@server/db/repository';
import { ProductMetaKey } from '@shared/product-meta';
import { ProductMetaModel, ProductMetaModelPojo } from './product-meta-model';

@Injectable()
export class ProductMetaRepository {
  async saveOne(meta: ProductMetaModelPojo, config?: RepositoryConfig) {
    return await ProductMetaModel.query(config?.trx)
      .insert(meta)
      .onConflict(['productId', 'key'])
      .merge()
      .returning('*');
  }

  async saveMultiple(
    productId: number,
    metas: ProductMetaModelPojo[],
    config?: RepositoryConfig,
  ) {
    // Save the metas
    const metasToSave = metas.map((meta) => ({ ...meta, productId }));
    if (metasToSave.length > 0) {
      await ProductMetaModel.query(config?.trx)
        .insert(metasToSave)
        .onConflict(['product_id', 'key'])
        .merge()
        .returning('*');
    }

    // Remove metas that weren't in the list
    const usedKeys = metasToSave.map((meta) => meta.key!);
    await ProductMetaModel.query(config?.trx)
      .where('productId', productId)
      .whereNotIn('key', usedKeys)
      .delete();
  }

  async findSimilarValue(
    key: ProductMetaKey,
    value: string,
    config?: RepositoryConfig,
  ) {
    const results = await ProductMetaModel.query(config?.trx)
      .distinct('stringValue')
      .where('key', key)
      .andWhere('stringValue', 'ILIKE', `%${value}%`);

    return results.map((meta) => meta.stringValue);
  }
}
