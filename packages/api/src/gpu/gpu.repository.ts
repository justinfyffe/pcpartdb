import { Injectable } from '@nestjs/common';
import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  DEFAULT_LIST_GPUS_SORT,
  GpuOrder,
  GpusFilter,
  GpusOrderBy,
  GpuSort,
  GpusQuery,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { Database, RepositoryConfig } from '../database';
import { deepMergeObjects } from '../shared/utils';
import { GpuEntity, GpuSpecsEntity } from './gpu.entity';

export interface CountOptions {
  query?: GpusQuery;

  includeImages?: boolean;
  includeRanks?: boolean;
}

export interface ListOptions {
  query?: GpusQuery;

  includeImages?: boolean;
  includeRanks?: boolean;
}

export interface FindOptions {
  includeImages?: boolean;
  includeRanks?: boolean;
}

export interface FindSurroundingOptions {
  surrounding: GpuSort;
  limitPerSide: number;

  filter?: GpusFilter;
}

@Injectable()
export class GpuRepository {
  constructor(private db: Database) {}

  async count(options: CountOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;
    const { filter, orderBy } = options.query ?? {};

    return await db.gpu.findMany({
      where: this.generateWhere(filter),
      orderBy: this.generateOrderBy(orderBy),
    });
  }

  async list(
    options: ListOptions,
    config?: RepositoryConfig,
  ): Promise<GpuEntity[]> {
    const db = config?.trx ?? this.db;

    const includeImages = options?.includeImages ?? false;
    const { filter, orderBy, limit, offset } = options.query ?? {};

    return await db.gpu.findMany({
      where: this.generateWhere(filter),
      orderBy: this.generateOrderBy(
        orderBy ?? { sort: DEFAULT_LIST_GPUS_SORT },
      ),
      include: {
        specs: true,
        benchmarks: true,
        images: includeImages ? { include: { image: true } } : false,
      },
      skip: offset ?? DEFAULT_LIST_GPUS_OFFSET,
      take: limit ?? DEFAULT_LIST_GPUS_LIMIT,
    });
  }

  async findById(
    id: number,
    options: FindOptions,
    config?: RepositoryConfig,
  ): Promise<GpuEntity> {
    const trx = config?.trx ?? this.db;
    const { includeImages } = options;

    return await trx.gpu.findUnique({
      where: { id },
      include: {
        specs: true,
        benchmarks: true,
        images: includeImages ? { include: { image: true } } : false,
      },
    });
  }

  async findBySlug(
    slug: string,
    options: FindOptions,
    config?: RepositoryConfig,
  ): Promise<GpuEntity> {
    const trx = config?.trx ?? this.db;
    const { includeImages } = options;

    return await trx.gpu.findUnique({
      where: { slug },
      include: {
        specs: true,
        benchmarks: true,
        images: includeImages ? { include: { image: true } } : false,
      },
    });
  }

  async findByName(name: string, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    return await trx.gpu.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  async findSurrounding(
    id: number,
    options: FindSurroundingOptions,
    config?: RepositoryConfig,
  ) {
    const { filter, surrounding, limitPerSide } = options;

    const gpu = await this.findById(id, {}, config);
    const db = config?.trx ?? this.db;

    let belowWhere: Prisma.GpuWhereInput = null;
    let aboveWhere: Prisma.GpuWhereInput = null;
    if (surrounding === GpuSort.PerformanceRating) {
      belowWhere = deepMergeObjects(
        this.generateWhere({ ...filter, performanceRated: true }),
        {
          id: { not: id },
          benchmarks: {
            performanceScore: { lt: gpu.benchmarks?.performanceScore },
          },
        },
      );
      aboveWhere = deepMergeObjects(
        this.generateWhere({ ...filter, performanceRated: true }),
        {
          id: { not: id },
          benchmarks: {
            performanceScore: { gt: gpu.benchmarks?.performanceScore },
          },
        },
      );
    } else if (surrounding === GpuSort.ValueRating) {
      belowWhere = deepMergeObjects(
        this.generateWhere({ ...filter, valueRated: true }),
        {
          id: { not: id },
          benchmarks: { valueScore: { lte: gpu.benchmarks?.valueScore } },
        },
      );
      aboveWhere = deepMergeObjects(
        this.generateWhere({ ...filter, valueRated: true }),
        {
          id: { not: id },
          benchmarks: { valueScore: { gte: gpu.benchmarks?.valueScore } },
        },
      );
    }

    const belowResults = await db.gpu.findMany({
      where: belowWhere,
      orderBy: this.generateOrderBy({
        sort: surrounding,
        order: GpuOrder.Desc,
      }),
      include: { specs: true, benchmarks: true },
      take: limitPerSide,
    });

    const aboveResults = await db.gpu.findMany({
      where: aboveWhere,
      orderBy: this.generateOrderBy({ sort: surrounding, order: GpuOrder.Asc }),
      include: { specs: true, benchmarks: true },
      take: limitPerSide,
    });

    console.log(
      belowResults.map(
        (value) => `${value.id}: ${value.benchmarks?.performanceScore}`,
      ),
    );
    console.log(
      aboveResults.map(
        (value) => `${value.id}: ${value.benchmarks?.performanceScore}`,
      ),
    );
  }

  async autocomplete(
    query: string,
    config?: RepositoryConfig,
  ): Promise<GpuEntity[]> {
    const db = config?.trx ?? this.db;

    const tokens = query
      .split(' ')
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 1)
      .join('|');

    // Get results based on search relevancy.
    const priorityResults = await db.gpu.findMany({
      where: {
        OR: [
          { name: { search: tokens, mode: 'insensitive' } },
          { company: { search: tokens, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        _relevance: {
          fields: ['name', 'company'],
          search: tokens,
          sort: 'desc',
        },
      },
      take: 6,
    });

    // Get results based on pattern matching.
    const fillerResultIds: { id: number }[] = await db.$queryRaw`
      SELECT id FROM gpus
      WHERE name ~* (${tokens}) OR company ~* (${tokens})
      ORDER BY release_date DESC
      LIMIT 6
    `;
    const fillerResults = await db.gpu.findMany({
      where: { id: { in: fillerResultIds.map((json) => json.id) } },
      orderBy: { releaseDate: 'desc' },
    });

    // Return top results.
    return [
      ...new Map(
        [...priorityResults, ...fillerResults].map((v) => [v.id, v]),
      ).values(),
    ].slice(0, 6);
  }

  async autocompleteSpec(
    key: keyof GpuSpecsEntity,
    query: string,
    config?: RepositoryConfig,
  ): Promise<string[]> {
    const trx = config?.trx ?? this.db;
    const results = await trx.gpuSpecs.findMany({
      select: { [key]: true },
      distinct: key,
      where: {
        [key]: { contains: query, mode: 'insensitive' },
      },
    });

    return results.map((result) => result[key]);
  }

  async create(data: Omit<GpuEntity, 'id'>, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const {
      parent: _parent,
      specs: specsData,
      benchmarks: benchmarksData,
      images,
      ...gpuData
    } = data;

    const imagesData =
      images?.map((image) => ({ imageId: image.imageId })) ?? [];

    return await trx.gpu.create({
      data: {
        ...gpuData,
        specs: { create: specsData },
        benchmarks: { create: benchmarksData },
        images: { createMany: { data: imagesData, skipDuplicates: true } },
      },
    });
  }

  async update(
    id: number,
    data: Partial<GpuEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;

    const {
      parent: _parent,
      specs: specsData,
      benchmarks: benchmarksData,
      images,
      ...gpuData
    } = data;

    const imagesData =
      images?.map((image) => ({ imageId: image.imageId })) ?? [];

    await trx.gpuImage.deleteMany({ where: { gpuId: id } });
    return await trx.gpu.update({
      where: { id },
      data: {
        ...gpuData,
        specs: { update: specsData },
        benchmarks: { update: benchmarksData },
        images: { createMany: { data: imagesData, skipDuplicates: true } },
      },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.gpu.delete({ where: { id } });
  }

  async getPerformanceRanks(ids: number[], config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    const idsAndRanks: { gpu_id: number; rank: number }[] = await trx.$queryRaw`
      SELECT ranks.gpu_id, ranks.rank AS rank
      FROM (
        SELECT
          gpu_id,
          CAST(RANK() OVER ( ORDER BY performance_score DESC ) AS INTEGER) AS rank
        FROM gpu_benchmarks 
        WHERE performance_score IS NOT NULL
      ) AS ranks
      WHERE ranks.gpu_id IN (${Prisma.join(ids)})
    `;

    const ranksMap = idsAndRanks.reduce((acc, value) => {
      acc[value.gpu_id] = value.rank;
      return acc;
    }, {} as Record<number, number>);

    return ids.map((id) => ranksMap[id] ?? null);
  }

  async getPerformanceRank(id: number, config?: RepositoryConfig) {
    const ranks = await this.getPerformanceRanks([id], config);
    return ranks[0] ?? null;
  }

  async getValueRanks(ids: number[], config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    const idsAndRanks: { gpu_id: number; rank: number }[] = await trx.$queryRaw`
      SELECT ranks.gpu_id, ranks.rank AS rank
      FROM (
        SELECT
          gpu_id,
          CAST(RANK() OVER ( ORDER BY value_score DESC ) AS INTEGER) AS rank
        FROM gpu_benchmarks 
        WHERE value_score IS NOT NULL
      ) AS ranks
      WHERE ranks.gpu_id IN (${Prisma.join(ids)})
    `;

    const ranksMap = idsAndRanks.reduce((acc, value) => {
      acc[value.gpu_id] = value.rank;
      return acc;
    }, {} as Record<number, number>);

    return ids.map((id) => ranksMap[id] ?? null);
  }

  async getValueRank(id: number, config?: RepositoryConfig) {
    const ranks = await this.getValueRanks([id], config);
    return ranks[0] ?? null;
  }

  private generateWhere(filter: GpusFilter): Prisma.GpuWhereInput {
    const performanceRated = filter?.performanceRated ?? false;
    const valueRated = filter?.valueRated;
    const maxPerformanceScore = filter?.maxPerformanceScore;
    const minPerformanceScore = filter?.minPerformanceScore;
    const maxValueScore = filter?.maxValueScore;
    const minValueScore = filter?.minValueScore;
    const companies = filter?.company ?? [];
    const excludeIds = filter?.excludeIds;

    // Exclude Ids
    let idWhere: Prisma.IntFilter = {};
    if (excludeIds != null) {
      idWhere = { ...idWhere, notIn: excludeIds };
    }

    // Performance Score
    let performanceWhere: Prisma.FloatNullableFilter = {};
    if (performanceRated) {
      performanceWhere = { ...performanceWhere, not: null };
    }
    if (maxPerformanceScore != null) {
      performanceWhere = { ...performanceWhere, lte: maxPerformanceScore };
    }
    if (minPerformanceScore != null) {
      performanceWhere = { ...performanceWhere, gte: minPerformanceScore };
    }

    // Value Score
    let valueWhere: Prisma.FloatNullableFilter = {};
    if (valueRated) {
      valueWhere = { ...valueWhere, not: null };
    }
    if (maxValueScore != null) {
      valueWhere = { ...valueWhere, lte: maxValueScore };
    }
    if (minValueScore != null) {
      valueWhere = { ...valueWhere, gte: minValueScore };
    }

    // Company
    const companyWhere: Prisma.StringNullableFilter =
      companies.length > 0 ? { in: companies, mode: 'insensitive' } : undefined;

    return {
      id: idWhere,
      company: companyWhere,
      benchmarks: {
        performanceScore: performanceWhere,
        valueScore: valueWhere,
      },
    };
  }

  private generateOrderBy(
    orderBy: GpusOrderBy,
  ): Prisma.GpuOrderByWithRelationAndSearchRelevanceInput {
    if (orderBy == null) {
      return { id: 'desc' };
    }

    const { sort } = orderBy;
    if (sort === GpuSort.Id) {
      // Default ASC
      const order = orderBy?.order ?? GpuOrder.Asc;
      return { id: order };
    } else if (sort === GpuSort.Name) {
      // Default ASC
      const order = orderBy?.order ?? GpuOrder.Asc;
      return { name: order };
    } else if (sort === GpuSort.ReleaseDate) {
      // Default DESC
      const order = orderBy?.order ?? GpuOrder.Desc;
      return { releaseDate: order };
    } else if (sort === GpuSort.PerformanceRating) {
      // Default DESC
      const order = orderBy?.order ?? GpuOrder.Desc;
      return {
        benchmarks: { performanceScore: { sort: order, nulls: 'last' } },
      };
    } else if (sort === GpuSort.ValueRating) {
      // Default DESC
      const order = orderBy?.order ?? GpuOrder.Desc;
      return { benchmarks: { valueScore: { sort: order, nulls: 'last' } } };
    } else {
      return { id: 'desc' };
    }
  }
}
