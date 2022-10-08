import { Injectable } from '@nestjs/common';
import { ProductType } from '../../shared/product';
import { ProductImageType } from '../../shared/product-image';
import { RepositoryConfig } from '../db/repository';
import { ProductBenchmarkRepository } from './benchmark/product-benchmark.repository';
import { ProductImageRepository } from './image/product-image.repository';
import { ProductMetaRepository } from './meta/product-meta.repository';
import { ProductModel, ProductModelPojo } from './product.model';
import { ProductReviewRepository } from './review/product-review.repository';
import { ProductSpecRepository } from './spec/product-spec.repository';

@Injectable()
export class ProductRepository {
  constructor(
    private metaRepository: ProductMetaRepository,
    private specRepository: ProductSpecRepository,
    private benchmarkRepository: ProductBenchmarkRepository,
    private reviewRepository: ProductReviewRepository,
    private imageRepository: ProductImageRepository,
  ) {}

  async list(config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx).orderBy('id', 'DESC');
  }

  async save(product: ProductModelPojo, config?: RepositoryConfig) {
    const { meta, specs, benchmarks, reviews, images, ...rest } = product;

    const { id } = await ProductModel.query(config?.trx)
      .insert(rest)
      .onConflict('id')
      .merge()
      .returning('*');

    await this.metaRepository.saveMultiple(id, meta, config);
    await this.specRepository.saveMultiple(id, specs, config);
    await this.benchmarkRepository.saveMultiple(id, benchmarks, config);
    await this.reviewRepository.saveMultiple(id, reviews, config);
    await this.imageRepository.saveMultiple(id, images, config);

    return this.findById(id, config);
  }

  async findById(id: number, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx)
      .findById(id)
      .withGraphFetched('meta')
      .withGraphFetched('specs')
      .withGraphFetched('reviews')
      .withGraphFetched('benchmarks')
      .withGraphFetched('images.[image]');
  }

  async findBySlug(slug: string, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx)
      .findOne({ slug })
      .withGraphFetched('meta')
      .withGraphFetched('specs')
      .withGraphFetched('reviews')
      .withGraphFetched('benchmarks')
      .withGraphFetched('images.[image]');
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
      .andWhere('name', 'ILIKE', `%${query}%`)
      .withGraphFetched('meta(autocompleteMeta)')
      .withGraphFetched('specs(autocompleteSpecs)')
      .withGraphFetched('images(autocompleteImages).[image]')
      .modifiers({
        autocompleteMeta(_builder) {
          _builder.whereIn('key', []);
        },
        autocompleteSpecs(_builder) {
          _builder.whereIn('key', []);
        },
        autocompleteImages(builder) {
          builder.where('type', ProductImageType.Autocomplete);
        },
      });
  }
}
