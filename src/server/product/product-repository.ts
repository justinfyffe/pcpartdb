import { RepositoryConfig } from '@server/db/repository';
import { imageRepository } from '@server/images/image-repository';
import { serialize } from '@server/shared/types/serialize';
import { Image } from '@shared/image';
import { ProductType } from '@shared/product';
import { ProductMetas } from '@shared/product-meta';
import { Specs } from '@shared/spec';
import { Model, raw, ref } from 'objection';
import { ProductModel, ProductModelPojo } from './product-model';

export class ProductRepository {
  async list(type: ProductType, config?: RepositoryConfig) {
    const products = await ProductModel.query(config?.trx)
      .where('type', type)
      .orderBy('id', 'DESC');

    await this.populateImages(products);

    return products;
  }

  async save(product: ProductModelPojo, config?: RepositoryConfig) {
    const { id } = await ProductModel.query(config?.trx)
      .insert(product)
      .onConflict('id')
      .merge()
      .returning('*');

    return this.findById(id, config);
  }

  async findById(id: number, config?: RepositoryConfig) {
    const product = await ProductModel.query(config?.trx).findById(id);
    await this.populateImages([product]);
    return product;
  }

  async findBySlug(slug: string, config?: RepositoryConfig) {
    const product = await ProductModel.query(config?.trx).findOne({ slug });
    await this.populateImages([product]);
    return product;
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

  async findSimilarSpecValue(
    key: keyof Specs,
    query: string,
    config?: RepositoryConfig,
  ) {
    const results = await ProductModel.query(config?.trx)
      .select(ref(`specs:${key}.value`).as('value'))
      .where(ref(`specs:${key}.value`).castText(), 'ILIKE', `%${query}%`);

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
      .where(ref(`metas:${key}.value`).castText(), 'ILIKE', `%${query}%`);

    return results.map(
      (result) => (result as unknown as { value: string }).value,
    );
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
