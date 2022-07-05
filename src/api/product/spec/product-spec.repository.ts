import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '../../db/repository';
import { ProductSpecModel, ProductSpecModelPojo } from './product-spec.model';

@Injectable()
export class ProductSpecRepository {
  async save(spec: ProductSpecModelPojo, config?: RepositoryConfig) {
    return await ProductSpecModel.query(config?.trx)
      .insert(spec)
      .onConflict(['productId', 'key'])
      .merge()
      .returning('*');
  }
}
