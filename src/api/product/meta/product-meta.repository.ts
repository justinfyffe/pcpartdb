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

  async findSimilarValue(
    key: ProductMetaKey,
    value: number | string,
    config?: RepositoryConfig,
  ) {
    return await ProductMetaModel.query(config?.trx)
      .where('key', key)
      .andWhere('value', 'ILIKE', value);
  }
}
