import { Injectable } from '@nestjs/common';
import { ProductSpecKey } from '../../../types/product-spec';
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

  async findSimilarValue(
    key: ProductSpecKey,
    value: string,
    config?: RepositoryConfig,
  ) {
    const results = await ProductSpecModel.query(config?.trx)
      .distinct('value')
      .where('key', key)
      .andWhere('value', 'ILIKE', `%${value}%`);

    return results.map((spec) => spec.value);
  }
}
