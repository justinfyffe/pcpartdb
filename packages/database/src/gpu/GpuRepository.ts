import {
  DataUpdateStatus,
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
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { GpuEntity } from './GpuEntity';

interface CountOptions {
  query?: GpusQuery;
}

interface ListOptions {
  query?: GpusQuery;
  includeImages?: boolean;
}

interface FindOptions {
  includeImages?: boolean;
}

export class GpuRepository {
  constructor(protected db: DatabaseClient) {}

  async count(options: CountOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;
    const { filter } = options.query ?? {};

    return await db.gpu.count({ where: this.generateWhere(filter) });
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
      include: { images: includeImages ? { include: { image: true } } : false },
      skip: offset ?? DEFAULT_LIST_GPUS_OFFSET,
      take: limit ?? DEFAULT_LIST_GPUS_LIMIT,
    });
  }

  async listAll(
    options: ListOptions,
    config?: RepositoryConfig,
  ): Promise<GpuEntity[]> {
    const db = config?.trx ?? this.db;

    const includeImages = options?.includeImages ?? false;
    const { filter, orderBy } = options.query ?? {};

    return await db.gpu.findMany({
      where: this.generateWhere(filter),
      orderBy: this.generateOrderBy(
        orderBy ?? { sort: DEFAULT_LIST_GPUS_SORT },
      ),
      include: { images: includeImages ? { include: { image: true } } : false },
    });
  }

  async findById(
    id: number,
    options: FindOptions,
    config?: RepositoryConfig,
  ): Promise<GpuEntity> {
    const trx = config?.trx ?? this.db;

    const includeImages = options?.includeImages ?? false;

    return await trx.gpu.findUnique({
      where: { id },
      include: { images: includeImages ? { include: { image: true } } : false },
    });
  }

  async findBySlug(
    slug: string,
    options: FindOptions,
    config?: RepositoryConfig,
  ): Promise<GpuEntity> {
    const trx = config?.trx ?? this.db;

    const includeImages = options?.includeImages ?? false;

    return await trx.gpu.findUnique({
      where: { slug },
      include: { images: includeImages ? { include: { image: true } } : false },
    });
  }

  async findByName(name: string, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    return await trx.gpu.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  async create(data: Omit<GpuEntity, 'id'>, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { parent: _parent, images, ...gpuData } = data;

    const imagesData =
      images?.map((image) => ({ imageId: image.imageId })) ?? [];

    return await trx.gpu.create({
      data: {
        ...gpuData,
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

    // Reject any pending updates.
    await trx.dataUpdate.updateMany({
      where: { gpuId: id, status: DataUpdateStatus.Pending },
      data: {
        decisionMadeAt: new Date(),
        status: DataUpdateStatus.Rejected,
      },
    });

    // Update GPU
    const { parent: _parent, images, ...gpuData } = data;

    const imagesData =
      images?.map((image) => ({ imageId: image.imageId })) ?? [];

    await trx.gpuImage.deleteMany({ where: { gpuId: id } });
    return await trx.gpu.update({
      where: { id },
      data: {
        ...gpuData,
        images: { createMany: { data: imagesData, skipDuplicates: true } },
      },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.gpu.delete({ where: { id } });
  }

  private generateWhere(filter: GpusFilter): Prisma.GpuWhereInput {
    const performanceRated = filter?.performanceRated ?? false;
    const valueRated = filter?.valueRated;
    const maxPerformanceScore = filter?.maxPerformanceScore;
    const minPerformanceScore = filter?.minPerformanceScore;
    const maxValueScore = filter?.maxValueScore;
    const minValueScore = filter?.minValueScore;
    const architectures = filter?.architecture ?? [];
    const companies = filter?.company ?? [];
    const years = filter?.year ?? [];
    const segments = filter?.segment ?? [];
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

    // Architecture
    const architectureWhere: Prisma.StringNullableFilter =
      architectures.length > 0
        ? { in: architectures, mode: 'insensitive' }
        : undefined;

    // Company
    const companyWhere: Prisma.StringNullableFilter =
      companies.length > 0 ? { in: companies, mode: 'insensitive' } : undefined;

    // Segment
    const segmentWhere: Prisma.StringNullableFilter =
      segments.length > 0 ? { in: segments, mode: 'insensitive' } : undefined;

    // Year
    const yearWhere: Prisma.GpuWhereInput[] = years.map((year) => ({
      releaseDate: {
        gte: `${year}-01-01`,
        lte: `${year}-12-31`,
      },
    }));

    return {
      AND: {
        id: idWhere,
        company: companyWhere,
        marketSegment: segmentWhere,
        architecture: architectureWhere,
        performanceScore: performanceWhere,
        valueScore: valueWhere,
        OR: yearWhere,
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
      return { performanceScore: { sort: order, nulls: 'last' } };
    } else if (sort === GpuSort.ValueRating) {
      // Default DESC
      const order = orderBy?.order ?? GpuOrder.Desc;
      return { valueScore: { sort: order, nulls: 'last' } };
    } else {
      return { id: 'desc' };
    }
  }
}
