import { RepositoryConfig } from '@server/db/repository';
import { BenchmarkKey } from '@shared/benchmark';
import { ProductType } from '@shared/product';
import { ProductImageType } from '@shared/product-image';
import { Model, raw } from 'objection';
import { benchmarkRepository } from './benchmark/benchmark-repository';
import { productImageRepository } from './image/product-image-repository';
import { productMetaRepository } from './meta/product-meta-repository';
import { ProductModel, ProductModelPojo } from './product-model';
import { reviewRepository } from './review/review-repository';
import { specRepository } from './spec/spec-repository';

export class ProductRepository {
  async list(type: ProductType, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx)
      .where('type', type)
      .orderBy('id', 'DESC')
      .withGraphFetched('specs')
      .withGraphFetched('benchmarks')
      .withGraphFetched('meta');
  }

  async save(product: ProductModelPojo, config?: RepositoryConfig) {
    const { meta, specs, benchmarks, reviews, images, ...rest } = product;

    const { id } = await ProductModel.query(config?.trx)
      .insert(rest)
      .onConflict('id')
      .merge()
      .returning('*');

    await specRepository.saveMultiple(id, specs, config);
    await benchmarkRepository.saveMultiple(id, benchmarks, config);
    await reviewRepository.saveMultiple(id, reviews, config);

    await productMetaRepository.saveMultiple(id, meta, config);
    await productImageRepository.saveMultiple(id, images, config);

    return this.findById(id, config);
  }

  async findById(id: number, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx)
      .findById(id)
      .withGraphFetched('specs')
      .withGraphFetched('reviews')
      .withGraphFetched('benchmarks')
      .withGraphFetched('meta')
      .withGraphFetched('images.[image]');
  }

  async findBySlug(slug: string, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx)
      .findOne({ slug })
      .withGraphFetched('specs')
      .withGraphFetched('reviews')
      .withGraphFetched('benchmarks')
      .withGraphFetched('meta')
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
      .withGraphFetched('specs(autocompleteSpecs)')
      .withGraphFetched('meta(autocompleteMeta)')
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

  async getPerformanceRanks(
    ids: number[],
    type: ProductType,
    config?: RepositoryConfig,
  ) {
    const ranksQuery = ProductModel.relatedQuery('benchmarks')
      .for(ProductModel.query().where('type', type))
      .where('key', BenchmarkKey.PerformanceScore)
      .select(
        'productId',
        raw(
          'CAST(RANK() OVER ( ORDER BY float_value DESC ) AS INTEGER) AS rank',
        ),
      );

    const ranks = (await Model.query(config?.trx)
      .select('productId', 'rank')
      .from(ranksQuery.as('ranks'))
      .whereIn('productId', ids)) as unknown as {
      productId: number;
      rank: number;
    }[];
    const ranksMap = ranks.reduce((acc, value) => {
      acc[value.productId] = value.rank;
      return acc;
    }, {} as Record<number, number>);

    return ids.map((id) => ranksMap[id] ?? null);
  }

  async getPerformanceRank(
    id: number,
    type: ProductType,
    config?: RepositoryConfig,
  ) {
    const ranks = await this.getPerformanceRanks([id], type, config);
    return ranks[0] ?? null;
  }

  async getValueRanks(
    ids: number[],
    type: ProductType,
    config?: RepositoryConfig,
  ) {
    const ranksQuery = ProductModel.relatedQuery('benchmarks')
      .for(ProductModel.query().where('type', type))
      .where('key', BenchmarkKey.ValueScore)
      .select(
        'productId',
        raw(
          'CAST(RANK() OVER ( ORDER BY float_value DESC ) AS INTEGER) AS rank',
        ),
      );

    const ranks = (await Model.query(config?.trx)
      .select('productId', 'rank')
      .from(ranksQuery.as('ranks'))
      .whereIn('productId', ids)) as unknown as {
      productId: number;
      rank: number;
    }[];
    const ranksMap = ranks.reduce((acc, value) => {
      acc[value.productId] = value.rank;
      return acc;
    }, {} as Record<number, number>);

    return ids.map((id) => ranksMap[id] ?? null);
  }

  async getValueRank(id: number, type: ProductType, config?: RepositoryConfig) {
    const ranks = await this.getValueRanks([id], type, config);
    return ranks[0] ?? null;
  }
}

export const productRepository = new ProductRepository();
