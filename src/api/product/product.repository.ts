import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '../db/repository';
import { ProductModel, ProductModelPojo } from './product.model';

@Injectable()
export class ProductRepository {
  constructor() {}

  async list(config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx).orderBy('id', 'DESC');
  }

  async save(product: ProductModelPojo, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx).upsertGraphAndFetch(product, {
      insertMissing: true,
      noDelete: true,
    });
  }

  async findById(id: number, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx)
      .findById(id)
      .withGraphFetched('meta')
      .withGraphFetched('specs')
      .withGraphFetched('benchmarks');
  }

  async findBySlug(slug: string, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx)
      .findOne({ slug })
      .withGraphFetched('meta')
      .withGraphFetched('specs')
      .withGraphFetched('benchmarks');
  }
}
