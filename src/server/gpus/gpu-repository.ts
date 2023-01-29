import { RepositoryConfig } from '@server/db/repository';
import {
  CreateGpuRequest,
  FindGpuRequest,
  GpuOrder,
  GpusFilter,
  GpusOrderBy,
  GpuSort,
  GpuSpecKey,
  GpusQuery,
  UpdateGpuRequest,
} from '@shared/gpus';
import Objection, { Model, raw, ref } from 'objection';
import { GpuBenchmarksModel } from './gpu-benchmarks-model';
import { GpuModel } from './gpu-model';

export interface ListOptions {
  query?: GpusQuery;

  includeRanks?: boolean;
  includeImages?: boolean;
}

export interface FindOptions {
  id?: number;
  slug?: string;

  includeImages?: boolean;
  includeRanks?: boolean;
}

export class GpuRepository {
  async list(options: ListOptions, config?: RepositoryConfig) {
    const { includeImages } = options;
    const { filter, orderBy } = options.query ?? {};

    let query = GpuModel.query(config?.trx)
      .withGraphJoined('specs')
      .withGraphJoined('benchmarks');

    if (filter != null) {
      query = this.filterGpus(query, filter);
    }

    if (orderBy != null) {
      query = this.orderGpus(query, orderBy);
    }

    if (includeImages) {
      query = query.withGraphFetched('images');
    }

    const gpus = await query;

    return gpus;
  }

  async find(options: FindGpuRequest, config?: RepositoryConfig) {
    const { id, slug, includeImages } = options;

    let query: Objection.QueryBuilder<GpuModel, unknown> = GpuModel.query(
      config?.trx,
    );

    if (id != null) {
      query = query.findById(id);
    } else if (slug != null) {
      query = query.findOne({ slug });
    }

    query = query.withGraphJoined('specs').withGraphJoined('benchmarks');

    if (includeImages) {
      query = query.withGraphFetched('images');
    }

    return (await query) as GpuModel;
  }

  async findSimilarValue(query: string, config?: RepositoryConfig) {
    const tokens = query
      .split(' ')
      .map((value) => value.trim())
      .join('|');

    return await GpuModel.query(config?.trx)
      .withGraphJoined('specs')
      .andWhere('name', '~*', `(${tokens})`)
      .orWhere(ref('specs.company:value').castText(), '~*', `(${tokens})`)
      .orderBy(ref('specs.releaseDate:value').castText(), 'DESC')
      .limit(5);
  }

  async findSimilarSpecValue(
    key: GpuSpecKey,
    query: string,
    config?: RepositoryConfig,
  ) {
    const results = await GpuModel.query(config?.trx)
      .withGraphJoined('specs')
      .select(ref(`${key}:value`).from('specs').as('value'))
      .distinctOn('value')
      .where(
        ref(`${key}:value`).from('specs').castText(),
        'ILIKE',
        `%${query}%`,
      )
      .limit(5);

    return results.map(
      (result) => (result as unknown as { value: string }).value,
    );
  }

  async create(data: CreateGpuRequest, config?: RepositoryConfig) {
    const { parent: _parent, specs, benchmarks, images, ...gpu } = data;
    const inserted = await GpuModel.query(config?.trx).insert(gpu);

    await inserted.$relatedQuery('specs', config?.trx).insert(specs ?? {});
    await inserted
      .$relatedQuery('benchmarks', config?.trx)
      .insert(benchmarks ?? {});
    if (images?.length > 0) {
      await inserted
        .$relatedQuery('images', config?.trx)
        .relate(images?.map((image) => image.id));
    }

    return this.find({ id: inserted.id }, config);
  }

  async update(id: number, data: UpdateGpuRequest, config?: RepositoryConfig) {
    const { parent: _parent, specs, benchmarks, images, ...gpu } = data;
    const updated = await GpuModel.query(config?.trx).updateAndFetchById(
      id,
      gpu,
    );

    await updated.$relatedQuery('specs', config?.trx).update(specs);
    await updated.$relatedQuery('benchmarks', config?.trx).update(benchmarks);
    await updated.$relatedQuery('images', config?.trx).unrelate();
    if (images?.length > 0) {
      await updated
        .$relatedQuery('images', config?.trx)
        .relate(images?.map((image) => image.id));
    }

    return this.find({ id: updated.id }, config);
  }

  async delete(id: number, config?: RepositoryConfig) {
    return await GpuModel.query(config?.trx).deleteById(id);
  }

  async getPerformanceRanks(ids: number[], config?: RepositoryConfig) {
    const ranksQuery = GpuBenchmarksModel.query(config?.trx)
      .whereNotNull(ref('performanceScore:value'))
      .select(
        'gpuId',
        raw(
          "CAST(RANK() OVER ( ORDER BY (performance_score->>'value')::float DESC ) AS INTEGER) AS rank",
        ),
      );

    const ranks = (await Model.query(config?.trx)
      .select('gpuId', 'rank')
      .from(ranksQuery.as('ranks'))
      .whereIn('gpuId', ids)) as unknown as {
      gpuId: number;
      rank: number;
    }[];
    const ranksMap = ranks.reduce((acc, value) => {
      acc[value.gpuId] = value.rank;
      return acc;
    }, {} as Record<number, number>);

    return ids.map((id) => ranksMap[id] ?? null);
  }

  async getPerformanceRank(id: number, config?: RepositoryConfig) {
    const ranks = await this.getPerformanceRanks([id], config);
    return ranks[0] ?? null;
  }

  async getValueRanks(ids: number[], config?: RepositoryConfig) {
    const ranksQuery = GpuBenchmarksModel.query(config?.trx)
      .whereNotNull(ref('valueScore:value'))
      .select(
        'gpuId',
        raw(
          "CAST(RANK() OVER ( ORDER BY (value_score->>'value')::float DESC ) AS INTEGER) AS rank",
        ),
      );

    const ranks = (await Model.query(config?.trx)
      .select('gpuId', 'rank')
      .from(ranksQuery.as('ranks'))
      .whereIn('gpuId', ids)) as unknown as {
      gpuId: number;
      rank: number;
    }[];
    const ranksMap = ranks.reduce((acc, value) => {
      acc[value.gpuId] = value.rank;
      return acc;
    }, {} as Record<number, number>);

    return ids.map((id) => ranksMap[id] ?? null);
  }

  async getValueRank(id: number, config?: RepositoryConfig) {
    const ranks = await this.getValueRanks([id], config);
    return ranks[0] ?? null;
  }

  private filterGpus(
    query: Objection.QueryBuilder<GpuModel, GpuModel[]>,
    filter: GpusFilter,
  ) {
    const performanceRated = filter?.performanceRated;
    const valueRated = filter?.valueRated;
    const companies =
      filter?.company?.map((company) => company.toLowerCase()) ?? [];

    let filterQuery = query;

    if (performanceRated === true) {
      filterQuery = filterQuery.whereNotNull(
        ref('benchmarks.performanceScore:value'),
      );
    }

    if (valueRated === true) {
      filterQuery = filterQuery.whereNotNull(
        ref('benchmarks.valueScore:value'),
      );
    }

    if (companies?.length > 0) {
      filterQuery = filterQuery.whereIn(
        raw('LOWER(??)', [ref('specs.company:value').castText()]),
        companies,
      );
    }

    return filterQuery;
  }

  private orderGpus(
    query: Objection.QueryBuilder<GpuModel, GpuModel[]>,
    orderBy: GpusOrderBy,
  ) {
    const { sort } = orderBy;

    let orderQuery = query;
    if (sort === GpuSort.Id) {
      // Default ASC
      const order = orderBy?.order ?? GpuOrder.Asc;
      orderQuery = orderQuery.orderBy('id', order);
    } else if (sort === GpuSort.Name) {
      // Default ASC
      const order = orderBy?.order ?? GpuOrder.Asc;
      orderQuery = orderQuery.orderBy('name', order);
    } else if (sort === GpuSort.ReleaseDate) {
      // Default DESC
      const order = orderBy?.order ?? GpuOrder.Desc;
      orderQuery = orderQuery.orderBy(ref('specs.releaseDate:value'), order);
    } else if (sort === GpuSort.PerformanceRating) {
      // Default DESC
      const order = orderBy?.order ?? GpuOrder.Desc;
      orderQuery = orderQuery
        .whereNotNull(ref('benchmarks.performanceScore:value'))
        .orderBy(ref('benchmarks.performanceScore:value'), order);
    } else if (sort === GpuSort.ValueRating) {
      // Default DESC
      const order = orderBy?.order ?? GpuOrder.Desc;
      orderQuery = orderQuery
        .whereNotNull(ref('benchmarks.valueScore:value'))
        .orderBy(ref('benchmarks.valueScore:value'), order);
    }

    return orderQuery;
  }
}

export const gpuRepository = new GpuRepository();
