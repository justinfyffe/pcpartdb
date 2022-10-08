import { Injectable } from '@nestjs/common';
import { ProductSpecKey } from '../../../shared/product-spec';
import { RepositoryConfig } from '../../db/repository';
import { ProductSpecModel, ProductSpecModelPojo } from './product-spec.model';

@Injectable()
export class ProductSpecRepository {
  async saveOne(spec: ProductSpecModelPojo, config?: RepositoryConfig) {
    return await ProductSpecModel.query(config?.trx)
      .insert(spec)
      .onConflict(['productId', 'key'])
      .merge()
      .returning('*');
  }

  async saveMultiple(
    productId: number,
    specs: ProductSpecModelPojo[],
    config?: RepositoryConfig,
  ) {
    // Save the specs
    const specsToSave = specs.map((spec) => ({ ...spec, productId }));
    if (specsToSave.length > 0) {
      await ProductSpecModel.query(config?.trx)
        .insert(specsToSave)
        .onConflict(['product_id', 'key'])
        .merge()
        .returning('*');
    }

    // Remove specs that weren't in the list
    const usedKeys = specsToSave.map((review) => review.key!);
    await ProductSpecModel.query(config?.trx)
      .where('productId', productId)
      .whereNotIn('key', usedKeys)
      .delete();
  }

  async findSimilarValue(
    key: ProductSpecKey,
    value: string,
    config?: RepositoryConfig,
  ) {
    const results = await ProductSpecModel.query(config?.trx)
      .distinct('stringValue')
      .where('key', key)
      .andWhere('stringValue', 'ILIKE', `%${value}%`);

    return results.map((spec) => spec.stringValue);
  }
}
