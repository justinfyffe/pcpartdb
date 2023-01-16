import { RepositoryConfig } from '@server/db/repository';
import { imageRepository } from '@server/images/image-repository';
import { serialize } from '@server/shared/types/serialize';
import { Image } from '@shared/image';
import { PartsQuery, PartType } from '@shared/part';
import { PartMetas } from '@shared/part-meta';
import { Specs } from '@shared/spec';
import { Model, raw, ref } from 'objection';
import { PartModel, PartModelPojo } from './part-model';
import { filterParts, sortParts } from './part-utils';

export interface ListOptions {
  type?: PartType;
  query?: PartsQuery;

  includeRanks?: boolean;
  includeImages?: boolean;
}

export interface FindOptions {
  id?: number;
  slug?: string;

  includeImages?: boolean;
  includeRanks?: boolean;
}

export class PartRepository {
  async list(options: ListOptions, config?: RepositoryConfig) {
    const { type, query, includeImages, includeRanks } = options;

    let partsQuery = PartModel.query(config?.trx).orderBy('id', 'DESC');
    if (type != null) {
      partsQuery = partsQuery.where('type', type);
    }

    let parts = await partsQuery;

    if (query?.filter != null) {
      parts = filterParts(parts, query?.filter);
    }

    if (query?.orderBy != null) {
      parts = sortParts(parts, query.orderBy);
    }

    if (includeImages) {
      await this.populateImages(parts, config);
    }

    if (includeRanks) {
      await this.populateRanks(parts, config);
    }

    return parts;
  }

  async find(options: FindOptions, config?: RepositoryConfig) {
    const { id, slug, includeImages, includeRanks } = options;

    let part: PartModel;
    if (id != null) {
      part = await PartModel.query(config?.trx).findById(id);
    } else if (slug != null) {
      part = await PartModel.query(config?.trx).findOne({ slug });
    }

    if (part == null) {
      return null;
    }

    if (includeImages) {
      await this.populateImages([part], config);
    }

    if (includeRanks) {
      await this.populateRanks([part], config);
    }

    return part;
  }

  async findSimilarValue(
    type: PartType,
    query: string,
    config?: RepositoryConfig,
  ) {
    const tokens = query
      .split(' ')
      .map((value) => value.trim())
      .join('|');

    return await PartModel.query(config?.trx)
      .where('type', type)
      .andWhere('name', '~*', `(${tokens})`)
      .orWhere(ref('specs:company.value').castText(), '~*', `(${tokens})`)
      .orderBy(ref('specs:launchDate.value').castText(), 'DESC')
      .limit(5);
  }

  async findSimilarSpecValue(
    key: keyof Specs,
    query: string,
    config?: RepositoryConfig,
  ) {
    const results = await PartModel.query(config?.trx)
      .select(ref(`specs:${key}.value`).as('value'))
      .distinctOn('value')
      .where(ref(`specs:${key}.value`).castText(), 'ILIKE', `%${query}%`)
      .limit(5);

    return results.map(
      (result) => (result as unknown as { value: string }).value,
    );
  }

  async findSimilarMetaValue(
    key: keyof PartMetas,
    query: string,
    config?: RepositoryConfig,
  ) {
    const results = await PartModel.query(config?.trx)
      .select(ref(`metas:${key}.value`).as('value'))
      .distinctOn('value')
      .where(ref(`metas:${key}.value`).castText(), 'ILIKE', `%${query}%`)
      .limit(5);

    return results.map(
      (result) => (result as unknown as { value: string }).value,
    );
  }

  async save(part: PartModelPojo, config?: RepositoryConfig) {
    const { id } = await PartModel.query(config?.trx)
      .insert(part)
      .onConflict('id')
      .merge()
      .returning('*');

    return this.find({ id }, config);
  }

  async delete(id: number, config?: RepositoryConfig) {
    return await PartModel.query(config?.trx).deleteById(id);
  }

  async getPerformanceRanks(
    ids: number[],
    type: PartType,
    config?: RepositoryConfig,
  ) {
    const ranksQuery = PartModel.query(config?.trx)
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
    type: PartType,
    config?: RepositoryConfig,
  ) {
    const ranks = await this.getPerformanceRanks([id], type, config);
    return ranks[0] ?? null;
  }

  async getValueRanks(
    ids: number[],
    type: PartType,
    config?: RepositoryConfig,
  ) {
    const ranksQuery = PartModel.query(config?.trx)
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

  async getValueRank(id: number, type: PartType, config?: RepositoryConfig) {
    const ranks = await this.getValueRanks([id], type, config);
    return ranks[0] ?? null;
  }

  private async populateRanks(parts: PartModel[], config?: RepositoryConfig) {
    if (parts.length === 0) {
      return;
    }

    const type = parts[0].type;
    if (parts.some((part) => part.type !== type)) {
      throw new Error('Parts must be of the same type when applying ranks');
    }

    const ids = parts.map((part) => part.id);
    const performanceRanks = await this.getPerformanceRanks(ids, type, config);
    const valueRanks = await this.getValueRanks(ids, type, config);

    parts.forEach((part, i) => {
      part.metas = {
        ...part.metas,
        performanceRank: { value: performanceRanks[i] },
        valueRank: { value: valueRanks[i] },
      };
    });
  }

  private async populateImages(parts: PartModel[], config?: RepositoryConfig) {
    const imageIds = parts
      .reduce((acc, part) => {
        const images =
          part?.metas?.images?.value?.filter((image) => image != null) ?? [];
        images.forEach((image) => acc.push(image.id));
        return acc;
      }, [] as number[])
      .filter((id) => id != null);

    const images = await imageRepository.findByIds(imageIds, config);
    const imagesMap = images.reduce((acc, image) => {
      acc[image.id] = serialize(image);
      return acc;
    }, {} as Record<number, Image>);

    parts.forEach((part) => {
      const images =
        part?.metas?.images?.value?.filter((image) => image != null) ?? [];

      images.forEach((image) => {
        image.image = imagesMap[image.id];
      });
    });
  }
}

export const partRepository = new PartRepository();
