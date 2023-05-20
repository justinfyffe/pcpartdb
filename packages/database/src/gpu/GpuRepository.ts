import {
  DataUpdateStatus,
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  DEFAULT_LIST_GPUS_SORT,
  ListGpusFilter,
  ListGpusOrder,
  ListGpusOrderBy,
  ListGpusQuery,
  ListGpusSort,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { GpuEntity } from './GpuEntity';

interface CountOptions {
  query?: ListGpusQuery;
}

interface CountRetailModelsOptions {
  chipsetIds: number[];
}

interface ListOptions {
  query?: ListGpusQuery;
  includeImages?: boolean;
  includeChipset?: boolean;
  includeRetailModels?: boolean;
}

interface FindOptions {
  includeImages?: boolean;
  includeChipset?: boolean;
  includeRetailModels?: boolean;
}

export class GpuRepository {
  constructor(protected db: DatabaseClient) {}

  async count(options: CountOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;
    const { filter } = options.query ?? {};

    return await db.gpu.count({ where: this.generateWhere(filter) });
  }

  async countRetailModels(
    options: CountRetailModelsOptions,
    config?: RepositoryConfig,
  ) {
    const { chipsetIds } = options;
    const db = config?.trx ?? this.db;
    const results = await db.gpu.groupBy({
      _count: true,
      by: ['chipsetId'],
      where: { chipsetId: { in: chipsetIds } },
    });

    return results.reduce((acc, result) => {
      acc[result.chipsetId] = result._count;
      return acc;
    }, {} as Record<number, number>);
  }

  async list(
    options: ListOptions,
    config?: RepositoryConfig,
  ): Promise<GpuEntity[]> {
    const db = config?.trx ?? this.db;

    const includeChipset = options?.includeChipset ?? false;
    const includeRetailModels = options?.includeRetailModels ?? false;
    const includeImages = options?.includeImages ?? false;
    const { filter, orderBy, pagination } = options.query ?? {};
    const { limit, offset } = pagination ?? {};

    return await db.gpu.findMany({
      where: { ...this.generateWhere(filter) },
      orderBy: this.generateOrderBy(
        orderBy ?? { sort: DEFAULT_LIST_GPUS_SORT },
      ),
      include: {
        chipset: includeChipset,
        retailModels: includeRetailModels,
        images: includeImages ? { include: { image: true } } : false,
      },
      skip: offset ?? DEFAULT_LIST_GPUS_OFFSET,
      take: limit ?? DEFAULT_LIST_GPUS_LIMIT,
    });
  }

  async listAll(
    options: ListOptions,
    config?: RepositoryConfig,
  ): Promise<GpuEntity[]> {
    const db = config?.trx ?? this.db;

    const includeChipset = options?.includeChipset ?? false;
    const includeRetailModels = options?.includeRetailModels ?? false;
    const includeImages = options?.includeImages ?? false;
    const { filter, orderBy } = options.query ?? {};

    return await db.gpu.findMany({
      where: { ...this.generateWhere(filter) },
      orderBy: this.generateOrderBy(
        orderBy ?? { sort: DEFAULT_LIST_GPUS_SORT },
      ),
      include: {
        chipset: includeChipset,
        retailModels: includeRetailModels,
        images: includeImages ? { include: { image: true } } : false,
      },
    });
  }

  async findById(
    id: number,
    options: FindOptions,
    config?: RepositoryConfig,
  ): Promise<GpuEntity> {
    const trx = config?.trx ?? this.db;

    const includeChipset = options?.includeChipset ?? false;
    const includeRetails = options?.includeRetailModels ?? false;
    const includeImages = options?.includeImages ?? false;

    return await trx.gpu.findUnique({
      where: { id },
      include: {
        chipset: includeChipset,
        retailModels: includeRetails,
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

    const includeChipset = options?.includeChipset ?? false;
    const includeRetailModels = options?.includeRetailModels ?? false;
    const includeImages = options?.includeImages ?? false;

    return await trx.gpu.findUnique({
      where: { slug },
      include: {
        chipset: includeChipset,
        retailModels: includeRetailModels,
        images: includeImages ? { include: { image: true } } : false,
      },
    });
  }

  async findByCompanyAndName(
    company: string,
    name: string,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;

    return await trx.gpu.findFirst({
      where: {
        company: { equals: company, mode: 'insensitive' },
        name: { equals: name, mode: 'insensitive' },
      },
    });
  }

  async create(data: Omit<GpuEntity, 'id'>, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { chipset: _parent, images, ...gpuData } = data;

    const imagesData =
      images?.map((image) => ({ imageId: image.imageId })) ?? [];

    return await trx.gpu.create({
      data: {
        ...gpuData,
        retailModels: {},
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
    const { chipset: _parent, images, ...gpuData } = data;

    const imagesData =
      images?.map((image) => ({ imageId: image.imageId })) ?? [];

    await trx.gpuImage.deleteMany({ where: { gpuId: id } });
    return await trx.gpu.update({
      where: { id },
      data: {
        ...gpuData,
        retailModels: {},
        images: { createMany: { data: imagesData, skipDuplicates: true } },
      },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.gpu.delete({ where: { id } });
  }

  private generateWhere(filter: ListGpusFilter): Prisma.GpuWhereInput {
    const chipsetId = filter?.chipsetId || null;
    const isChipset = filter?.isChipset ?? false;
    const isRetailModel = filter?.isRetailModel ?? false;
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

    // Parent
    let parentWhere: Prisma.IntNullableFilter = {};
    if (isChipset && !isRetailModel) {
      parentWhere = null;
    } else if (!isChipset && isRetailModel) {
      parentWhere = { not: null };
    }
    if (chipsetId != null) {
      parentWhere = { ...parentWhere, equals: chipsetId };
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
        chipsetId: parentWhere,
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
    orderBy: ListGpusOrderBy,
  ):
    | Prisma.GpuOrderByWithRelationAndSearchRelevanceInput
    | Prisma.GpuOrderByWithRelationAndSearchRelevanceInput[] {
    if (orderBy == null) {
      return { id: 'desc' };
    }

    const { sort } = orderBy;
    if (sort === ListGpusSort.Id) {
      // Default ASC
      const order = orderBy?.order ?? ListGpusOrder.Asc;
      return { id: order };
    } else if (sort === ListGpusSort.Name) {
      // Default ASC
      const order = orderBy?.order ?? ListGpusOrder.Asc;
      return [{ company: { sort: order, nulls: 'last' } }, { name: order }];
    } else if (sort === ListGpusSort.ReleaseDate) {
      // Default DESC
      const order = orderBy?.order ?? ListGpusOrder.Desc;
      return { releaseDate: { sort: order, nulls: 'last' } };
    } else if (sort === ListGpusSort.PerformanceRating) {
      // Default DESC
      const order = orderBy?.order ?? ListGpusOrder.Desc;
      return { performanceScore: { sort: order, nulls: 'last' } };
    } else if (sort === ListGpusSort.ValueRating) {
      // Default DESC
      const order = orderBy?.order ?? ListGpusOrder.Desc;
      return { valueScore: { sort: order, nulls: 'last' } };
    } else {
      return { id: 'desc' };
    }
  }
}
