import { prisma } from '@pcpartdb/website/server/db/database';
import { RepositoryConfig } from '@pcpartdb/website/server/db/repository';
import {
  GpuOrder,
  GpusFilter,
  GpusOrderBy,
  GpuSort,
  GpusQuery,
} from '@pcpartdb/website/shared/gpus';
import { Prisma } from '@prisma/client';
import { GpuEntity, GpuSpecsEntity } from './gpu-entity';

export interface ListOptions {
  query?: GpusQuery;

  includeImages?: boolean;
  includeRanks?: boolean;
}

export interface FindOptions {
  includeImages?: boolean;
  includeRanks?: boolean;
}

export class GpuRepository {
  async list(
    options: ListOptions,
    config?: RepositoryConfig,
  ): Promise<GpuEntity[]> {
    const db = config?.trx ?? prisma;

    const includeImages = options?.includeImages ?? false;
    const { filter, orderBy, limit, offset } = options.query ?? {};

    return await db.gpu.findMany({
      where: this.generateWhere(filter),
      orderBy: this.generateOrderBy(orderBy),
      include: {
        specs: true,
        benchmarks: true,
        images: includeImages ? { include: { image: true } } : false,
      },
      skip: offset,
      take: limit,
    });
  }

  async findById(
    id: number,
    options: FindOptions,
    config?: RepositoryConfig,
  ): Promise<GpuEntity> {
    const trx = config?.trx ?? prisma;
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
    const trx = config?.trx ?? prisma;
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

  async findSimilarValue(
    query: string,
    config?: RepositoryConfig,
  ): Promise<GpuEntity[]> {
    const db = config?.trx ?? prisma;

    const tokens = query
      .split(' ')
      .map((value) => value.trim())
      .join('|');

    const idsFromNameOrCompany: { id: number }[] = await db.$queryRaw`
      SELECT id FROM gpus
      WHERE name ~* (${tokens}) OR company ~* (${tokens})
      LIMIT 5
    `;

    const ids = idsFromNameOrCompany.map((json) => json.id);

    return await db.gpu.findMany({
      where: { id: { in: ids } },
      orderBy: { releaseDate: 'desc' },
      take: 5,
    });
  }

  async findSimilarSpecValue(
    key: keyof GpuSpecsEntity,
    query: string,
    config?: RepositoryConfig,
  ): Promise<string[]> {
    const trx = config?.trx ?? prisma;
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
    const trx = config?.trx ?? prisma;

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
    const trx = config?.trx ?? prisma;

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
    const trx = config?.trx ?? prisma;
    await trx.gpu.delete({ where: { id } });
  }

  async getPerformanceRanks(ids: number[], config?: RepositoryConfig) {
    const trx = config?.trx ?? prisma;
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
    const trx = config?.trx ?? prisma;
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
    const companies = filter?.company ?? [];

    const performanceRatedWhere: Prisma.FloatNullableFilter = performanceRated
      ? { not: null }
      : undefined;
    const valueRatedWhere: Prisma.FloatNullableFilter = valueRated
      ? { not: null }
      : undefined;
    const companyWhere: Prisma.StringNullableFilter =
      companies.length > 0 ? { in: companies, mode: 'insensitive' } : undefined;

    return {
      company: companyWhere,
      benchmarks: {
        performanceScore: performanceRatedWhere,
        valueScore: valueRatedWhere,
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
      return { benchmarks: { performanceScore: order } };
    } else if (sort === GpuSort.ValueRating) {
      // Default DESC
      const order = orderBy?.order ?? GpuOrder.Desc;
      return { benchmarks: { valueScore: order } };
    } else {
      return { id: 'desc' };
    }
  }
}

export const gpuRepository = new GpuRepository();
