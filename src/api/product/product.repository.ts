import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '../db/repository';
import { ProductModel, ProductModelPojo } from './product.model';

@Injectable()
export class ProductRepository {
  async save(product: ProductModelPojo, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx)
      .insert(product)
      .onConflict('slug')
      .merge()
      .returning('*');
  }

  async findBySlug(slug: string, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx)
      .findOne({ slug })
      .withGraphFetched('specs')
      .withGraphFetched('benchmarks');
  }
}
