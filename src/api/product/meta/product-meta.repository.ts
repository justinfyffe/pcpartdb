import { Injectable } from '@nestjs/common';
import { ProductMetaKey } from '../../../types/product-meta';
import { RepositoryConfig } from '../../db/repository';
import { ProductMetaModel, ProductMetaModelPojo } from './product-meta.model';

@Injectable()
export class ProductMetaRepository {
  async save(meta: ProductMetaModelPojo, config?: RepositoryConfig) {
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
    await ProductMetaModel.query(config?.trx)
      .insert(metasToSave)
      .onConflict(['product_id', 'key'])
      .merge()
      .returning('*');

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
      .distinct('value')
      .where('key', key)
      .andWhere('value', 'ILIKE', `%${value}%`);

    return results.map((meta) => meta.value);
  }
}
