import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '@server/db/repository';
import { ProductType } from '@shared/product';
import { ProductBenchmarkKey } from '@shared/product-benchmark';
import { ProductImageType } from '@shared/product-image';
import { Model, raw } from 'objection';
import { ProductBenchmarkRepository } from './benchmark/product-benchmark-repository';
import { ProductImageRepository } from './image/product-image-repository';
import { ProductMetaRepository } from './meta/product-meta-repository';
import { ProductModel, ProductModelPojo } from './product-model';
import { ProductReviewRepository } from './review/product-review-repository';
import { ProductSpecRepository } from './spec/product-spec-repository';

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
        autocompleteMeta(builder) {
          builder.whereIn('key', []);
        },
        autocompleteSpecs(builder) {
          builder.whereIn('key', []);
        },
        autocompleteImages(builder) {
          builder.where('type', ProductImageType.Autocomplete);
        },
      });
  }

  async getPerformanceRank(
    id: number,
    type: ProductType,
    config?: RepositoryConfig,
  ) {
    const ranksQuery = ProductModel.relatedQuery('benchmarks')
      .for(ProductModel.query().where('type', type))
      .where('key', ProductBenchmarkKey.PerformanceScore)
      .select(
        'productId',
        raw(
          'CAST(RANK() OVER ( ORDER BY float_value DESC ) AS INTEGER) AS rank',
        ),
      );

    const [{ rank }] = (await Model.query(config?.trx)
      .select('rank')
      .from(ranksQuery.as('ranks'))
      .where('productId', id)) as unknown as { rank: number }[];

    return rank;
  }

  async getValueRank(id: number, type: ProductType, config?: RepositoryConfig) {
    const ranksQuery = ProductModel.relatedQuery('benchmarks')
      .for(ProductModel.query().where('type', type))
      .where('key', ProductBenchmarkKey.ValueScore)
      .select(
        'productId',
        raw(
          'CAST(RANK() OVER ( ORDER BY float_value DESC ) AS INTEGER) AS rank',
        ),
      );

    const [{ rank }] = (await Model.query(config?.trx)
      .select('rank')
      .from(ranksQuery.as('ranks'))
      .where('productId', id)) as unknown as { rank: number }[];

    return rank;
  }
}
