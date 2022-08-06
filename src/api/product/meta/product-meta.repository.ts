import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '../../db/repository';
import { ProductMetaModel, ProductMetaModelPojo } from './product-meta.model';

@Injectable()
export class ProductMetaRepository {
  async save(spec: ProductMetaModelPojo, config?: RepositoryConfig) {
    return await ProductMetaModel.query(config?.trx)
      .insert(spec)
      .onConflict(['productId', 'key'])
      .merge()
      .returning('*');
  }
}
