import {
  DataUpdateStatus,
  DEFAULT_LIST_CPUS_LIMIT,
  DEFAULT_LIST_CPUS_OFFSET,
  DEFAULT_LIST_CPUS_SORT,
  ListCpusFilter,
  ListCpusOrder,
  ListCpusOrderBy,
  ListCpusQuery,
  ListCpusSort,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { CpuEntity } from './CpuEntity';

export interface CountCpusOptions {
  query?: ListCpusQuery;
}

export interface ListCpusOptions {
  query?: ListCpusQuery;
  includeImages?: boolean;
}

export interface FindCpuOptions {
  includeImages?: boolean;
}

export class CpuRepository {
  constructor(protected db: DatabaseClient) {}

  async count(options: CountCpusOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;
    const { filter } = options.query ?? {};

    return await db.cpu.count({ where: this.generateWhere(filter) });
  }

  async list(
    options: ListCpusOptions,
    config?: RepositoryConfig,
  ): Promise<CpuEntity[]> {
    const db = config?.trx ?? this.db;

    const includeImages = options?.includeImages ?? false;
    const { filter, orderBy, pagination } = options.query ?? {};
    const { limit, offset } = pagination ?? {};

    return await db.cpu.findMany({
      where: { ...this.generateWhere(filter) },
      orderBy: this.generateOrderBy(
        orderBy ?? { sort: DEFAULT_LIST_CPUS_SORT },
      ),
      include: {
        images: includeImages ? { include: { image: true } } : false,
      },
      skip: offset ?? DEFAULT_LIST_CPUS_OFFSET,
      take: limit ?? DEFAULT_LIST_CPUS_LIMIT,
    });
  }

  async listAll(options: ListCpusOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const includeImages = options?.includeImages ?? false;
    const { filter, orderBy } = options.query ?? {};

    return await db.cpu.findMany({
      where: { ...this.generateWhere(filter) },
      orderBy: this.generateOrderBy(
        orderBy ?? { sort: DEFAULT_LIST_CPUS_SORT },
      ),
      include: {
        images: includeImages ? { include: { image: true } } : false,
      },
    });
  }

  async findById(
    id: number,
    options?: FindCpuOptions,
    config?: RepositoryConfig,
  ): Promise<CpuEntity> {
    const trx = config?.trx ?? this.db;

    const includeImages = options?.includeImages ?? false;

    return await trx.cpu.findUnique({
      where: { id },
      include: {
        images: includeImages ? { include: { image: true } } : false,
      },
    });
  }

  async findBySlug(
    slug: string,
    options?: FindCpuOptions,
    config?: RepositoryConfig,
  ): Promise<CpuEntity> {
    const trx = config?.trx ?? this.db;

    const includeImages = options?.includeImages ?? false;

    return await trx.cpu.findUnique({
      where: { slug },
      include: {
        images: includeImages ? { include: { image: true } } : false,
      },
    });
  }

  async findByName(
    name: string,
    config?: RepositoryConfig,
  ): Promise<CpuEntity> {
    const trx = config?.trx ?? this.db;

    return await trx.cpu.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });
  }

  async findByCompanyAndName(
    company: string,
    name: string,
    config?: RepositoryConfig,
  ): Promise<CpuEntity> {
    const trx = config?.trx ?? this.db;

    return await trx.cpu.findFirst({
      where: {
        company: { equals: company, mode: 'insensitive' },
        name: { equals: name, mode: 'insensitive' },
      },
    });
  }

  async create(data: Omit<CpuEntity, 'id'>, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { images, ...cpuData } = data;

    const imagesData =
      images?.map((image) => ({ imageId: image.imageId })) ?? [];

    return await trx.cpu.create({
      data: {
        ...cpuData,
        images: { createMany: { data: imagesData, skipDuplicates: true } },
      },
    });
  }

  async update(
    id: number,
    data: Partial<CpuEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;

    // Reject any pending updates.
    await trx.dataUpdate.updateMany({
      where: { cpuId: id, status: DataUpdateStatus.Pending },
      data: {
        decisionMadeAt: new Date(),
        status: DataUpdateStatus.Rejected,
      },
    });

    // Update CPU
    const { images, ...cpuData } = data;

    const imagesData =
      images?.map((image) => ({ imageId: image.imageId })) ?? [];

    await trx.cpuImage.deleteMany({ where: { cpuId: id } });
    return await trx.cpu.update({
      where: { id },
      data: {
        ...cpuData,
        images: { createMany: { data: imagesData, skipDuplicates: true } },
      },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.cpu.delete({ where: { id } });
  }

  private generateWhere(filter: ListCpusFilter): Prisma.CpuWhereInput {
    const performanceRated = filter?.performanceRated ?? false;
    const valueRated = filter?.valueRated;
    const maxPerformanceScore = filter?.maxPerformanceScore;
    const minPerformanceScore = filter?.minPerformanceScore;
    const maxValueScore = filter?.maxValueScore;
    const minValueScore = filter?.minValueScore;
    const companies = filter?.company?.filter((value) => value != null) ?? [];
    const years = filter?.year?.filter((value) => value != null) ?? [];
    const segments = filter?.segment?.filter((value) => value != null) ?? [];
    const excludeIds =
      filter?.excludeIds?.filter((value) => value != null) ?? [];

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

    // Segment
    const segmentsWhere: Prisma.StringNullableListFilter =
      segments.length > 0 ? { hasSome: segments } : undefined;

    // Year
    const yearWhere: Prisma.CpuWhereInput[] = years.map((year) => ({
      releaseDate: {
        gte: `${year}-01-01`,
        lte: `${year}-12-31`,
      },
    }));

    return {
      AND: {
        id: idWhere,
        company: companyWhere,
        marketSegments: segmentsWhere,
        performanceScore: performanceWhere,
        valueScore: valueWhere,
        OR: yearWhere,
      },
    };
  }

  private generateOrderBy(
    orderBy: ListCpusOrderBy,
  ):
    | Prisma.CpuOrderByWithRelationAndSearchRelevanceInput
    | Prisma.CpuOrderByWithRelationAndSearchRelevanceInput[] {
    if (orderBy == null) {
      return { id: 'desc' };
    }

    const { sort } = orderBy;
    if (sort === ListCpusSort.Id) {
      // Default ASC
      const order = orderBy?.order ?? ListCpusOrder.Asc;
      return { id: order };
    } else if (sort === ListCpusSort.Name) {
      // Default ASC
      const order = orderBy?.order ?? ListCpusOrder.Asc;
      return [{ company: { sort: order, nulls: 'last' } }, { name: order }];
    } else if (sort === ListCpusSort.ReleaseDate) {
      // Default DESC
      const order = orderBy?.order ?? ListCpusOrder.Desc;
      return { releaseDate: { sort: order, nulls: 'last' } };
    } else if (sort === ListCpusSort.PerformanceRating) {
      // Default DESC
      const order = orderBy?.order ?? ListCpusOrder.Desc;
      return { performanceScore: { sort: order, nulls: 'last' } };
    } else if (sort === ListCpusSort.ValueRating) {
      // Default DESC
      const order = orderBy?.order ?? ListCpusOrder.Desc;
      return { valueScore: { sort: order, nulls: 'last' } };
    } else {
      return { id: 'desc' };
    }
  }
}
