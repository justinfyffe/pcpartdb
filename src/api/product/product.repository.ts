import { Injectable } from '@nestjs/common';
import { ProductType } from '../../types/product';
import { RepositoryConfig } from '../db/repository';
import { ProductBenchmarkRepository } from './benchmark/product-benchmark.repository';
import { ProductMetaRepository } from './meta/product-meta.repository';
import { ProductModel, ProductModelPojo } from './product.model';
import { ProductReviewRepository } from './review/product-review.repository';
import { ProductSpecRepository } from './spec/product-spec.repository';

@Injectable()
export class ProductRepository {
  constructor(
    private metaRepoistory: ProductMetaRepository,
    private specRepository: ProductSpecRepository,
    private benchmarkRepository: ProductBenchmarkRepository,
    private reviewRepository: ProductReviewRepository,
  ) {}

  async list(config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx).orderBy('id', 'DESC');
  }

  async save(product: ProductModelPojo, config?: RepositoryConfig) {
    const { meta, specs, benchmarks, reviews, ...rest } = product;

    const { id } = await ProductModel.query(config?.trx)
      .insert(rest)
      .onConflict('id')
      .merge()
      .returning('*');

    for (const value of meta) {
      await this.metaRepoistory.save({ ...value, productId: id }, config);
    }

    for (const value of specs) {
      await this.specRepository.save({ ...value, productId: id }, config);
    }

    await this.benchmarkRepository.saveMultiple(id, benchmarks, config);
    await this.reviewRepository.saveMultiple(id, reviews, config);

    return this.findById(id, config);
  }

  async findById(id: number, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx)
      .findById(id)
      .withGraphFetched('meta')
      .withGraphFetched('specs')
      .withGraphFetched('reviews')
      .withGraphFetched('benchmarks');
  }

  async findBySlug(slug: string, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx)
      .findOne({ slug })
      .withGraphFetched('meta')
      .withGraphFetched('specs')
      .withGraphFetched('reviews')
      .withGraphFetched('benchmarks');
  }

  async delete(id: number, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx).deleteById(id);
  }

  async findSimilarValue(
    type: ProductType,
    query: string,
    config?: RepositoryConfig,
  ) {
    return await ProductModel.query(config?.trx)
      .where('type', type)
      .andWhere('name', 'ILIKE', `%${query}%`);
  }
}
