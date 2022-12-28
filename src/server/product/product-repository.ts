import { RepositoryConfig } from '@server/db/repository';
import { imageRepository } from '@server/images/image-repository';
import { serialize } from '@server/shared/types/serialize';
import { Image } from '@shared/image';
import {
  filterProducts,
  ListProductsRequest,
  ProductType,
  sortProducts,
} from '@shared/product';
import { ProductMetas } from '@shared/product-meta';
import { Specs } from '@shared/spec';
import { Model, raw, ref } from 'objection';
import { ProductModel, ProductModelPojo } from './product-model';

type ListOptions = ListProductsRequest;

interface FindOptions {
  id?: number;
  slug?: string;

  includeImages?: boolean;
  includeRanks?: boolean;
}

export class ProductRepository {
  async list(options: ListOptions, config?: RepositoryConfig) {
    const { type, query, includeImages, includeRanks } = options;

    let products = await ProductModel.query(config?.trx)
      .where('type', type)
      .orderBy('id', 'DESC');

    if (query?.filter != null) {
      products = filterProducts(products, query?.filter);
    }

    if (query?.orderBy != null) {
      products = sortProducts(products, query.orderBy);
    }

    if (includeImages) {
      await this.populateImages(products, config);
    }

    if (includeRanks) {
      await this.populateRanks(products, config);
    }

    return products;
  }

  async find(options: FindOptions, config?: RepositoryConfig) {
    const { id, slug, includeImages, includeRanks } = options;

    let product: ProductModel;
    if (id != null) {
      product = await ProductModel.query(config?.trx).findById(id);
    } else if (slug != null) {
      product = await ProductModel.query(config?.trx).findOne({ slug });
    }

    if (product == null) {
      return null;
    }

    if (includeImages) {
      await this.populateImages([product], config);
    }

    if (includeRanks) {
      await this.populateRanks([product], config);
    }

    return product;
  }

  async findSimilarValue(
    type: ProductType,
    query: string,
    config?: RepositoryConfig,
  ) {
    return await ProductModel.query(config?.trx)
      .where('type', type)
      .andWhere('name', 'ILIKE', `%${query}%`)
      .limit(5);
  }

  async findSimilarSpecValue(
    key: keyof Specs,
    query: string,
    config?: RepositoryConfig,
  ) {
    const results = await ProductModel.query(config?.trx)
      .select(ref(`specs:${key}.value`).as('value'))
      .where(ref(`specs:${key}.value`).castText(), 'ILIKE', `%${query}%`)
      .limit(5);

    return results.map(
      (result) => (result as unknown as { value: string }).value,
    );
  }

  async findSimilarMetaValue(
    key: keyof ProductMetas,
    query: string,
    config?: RepositoryConfig,
  ) {
    const results = await ProductModel.query(config?.trx)
      .select(ref(`metas:${key}.value`).as('value'))
      .where(ref(`metas:${key}.value`).castText(), 'ILIKE', `%${query}%`)
      .limit(5);

    return results.map(
      (result) => (result as unknown as { value: string }).value,
    );
  }

  async save(product: ProductModelPojo, config?: RepositoryConfig) {
    const { id } = await ProductModel.query(config?.trx)
      .insert(product)
      .onConflict('id')
      .merge()
      .returning('*');

    return this.find({ id }, config);
  }

  async delete(id: number, config?: RepositoryConfig) {
    return await ProductModel.query(config?.trx).deleteById(id);
  }

  async getPerformanceRanks(
    ids: number[],
    type: ProductType,
    config?: RepositoryConfig,
  ) {
    const ranksQuery = ProductModel.query(config?.trx)
      .where('type', type)
      .whereNotNull(ref('benchmarks:performanceScore.value'))
      .select(
        'id',
        raw(
          "CAST(RANK() OVER ( ORDER BY (benchmarks->'performanceScore'->>'value')::float DESC ) AS INTEGER) AS rank",
        ),
      );

    const ranks = (await Model.query(config?.trx)
      .select('id', 'rank')
      .from(ranksQuery.as('ranks'))
      .whereIn('id', ids)) as unknown as {
      id: number;
      rank: number;
    }[];
    const ranksMap = ranks.reduce((acc, value) => {
      acc[value.id] = value.rank;
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
    const ranksQuery = ProductModel.query(config?.trx)
      .where('type', type)
      .whereNotNull(ref('benchmarks:valueScore.value'))
      .select(
        'id',
        raw(
          "CAST(RANK() OVER ( ORDER BY (benchmarks->'valueScore'->>'value')::float DESC ) AS INTEGER) AS rank",
        ),
      );

    const ranks = (await Model.query(config?.trx)
      .select('id', 'rank')
      .from(ranksQuery.as('ranks'))
      .whereIn('id', ids)) as unknown as {
      id: number;
      rank: number;
    }[];
    const ranksMap = ranks.reduce((acc, value) => {
      acc[value.id] = value.rank;
      return acc;
    }, {} as Record<number, number>);

    return ids.map((id) => ranksMap[id] ?? null);
  }

  async getValueRank(id: number, type: ProductType, config?: RepositoryConfig) {
    const ranks = await this.getValueRanks([id], type, config);
    return ranks[0] ?? null;
  }

  private async populateRanks(
    products: ProductModel[],
    config?: RepositoryConfig,
  ) {
    if (products.length === 0) {
      return;
    }

    const type = products[0].type;
    if (products.some((product) => product.type !== type)) {
      throw new Error('Products must be of the same type when applying ranks');
    }

    const ids = products.map((product) => product.id);
    const performanceRanks = await this.getPerformanceRanks(ids, type, config);
    const valueRanks = await this.getValueRanks(ids, type, config);

    products.forEach((product, i) => {
      product.metas = {
        ...product.metas,
        performanceRank: { value: performanceRanks[i] },
        valueRank: { value: valueRanks[i] },
      };
    });
  }

  private async populateImages(
    products: ProductModel[],
    config?: RepositoryConfig,
  ) {
    const imageIds = products
      .reduce((acc, product) => {
        acc.push(product.images?.autocomplete?.imageId);
        acc.push(product.images?.thumbnail?.imageId);
        product?.images?.details?.forEach((image) => acc.push(image.imageId));
        return acc;
      }, [] as number[])
      .filter((id) => id != null);

    const images = await imageRepository.findByIds(imageIds, config);
    const imagesMap = images.reduce((acc, image) => {
      acc[image.id] = serialize(image);
      return acc;
    }, {} as Record<number, Image>);

    products.forEach((product) => {
      const thumbnail = product?.images?.thumbnail;
      if (thumbnail != null) {
        thumbnail.image = imagesMap[thumbnail.imageId];
      }

      const autocomplete = product?.images?.autocomplete;
      if (autocomplete != null) {
        autocomplete.image = imagesMap[autocomplete.imageId];
      }

      product?.images?.details.forEach((detailImage) => {
        detailImage.image = imagesMap[detailImage.imageId];
      });
    });
  }
}

export const productRepository = new ProductRepository();
