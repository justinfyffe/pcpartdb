import {
  ListImagesFilter,
  ListImagesQuery,
  ListOrder,
  ListOrderBy,
  ListSort,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ImageEntity } from './ImageEntity';

interface CountOptions extends ListImagesQuery {}

interface ListOptions extends ListImagesQuery {}

export class ImageRepository {
  constructor(protected db: DatabaseClient) {}

  async count(options: CountOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const where = this.generateWhere(options.filter);
    return await db.image.count({
      where,
    });
  }

  async list(options: ListOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const where = this.generateWhere(options.filter);
    const orderBy = this.generateOrderBy(options.orderBy);
    return await trx.image.findMany({
      where,
      orderBy,
      skip: options.pagination?.offset,
      take: options.pagination?.limit,
    });
  }

  async findById(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.image.findUnique({ where: { id } });
  }

  async findByIds(ids: number[], config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.image.findMany({
      where: { id: { in: ids } },
    });
  }

  async findByPath(path: string, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.image.findUnique({ where: { path } });
  }

  async findByPaths(paths: string[], config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.image.findMany({
      where: { path: { in: paths } },
    });
  }

  async create(image: Omit<ImageEntity, 'id'>, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.image.create({
      data: image,
    });
  }

  async update(
    id: number,
    image: Partial<ImageEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    return await trx.image.update({
      where: { id },
      data: image,
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.image.delete({
      where: { id },
    });
  }

  private generateWhere(filter: ListImagesFilter): Prisma.ImageWhereInput {
    const searchTextWhere = filter?.search
      ? { contains: filter.search, mode: 'insensitive' as Prisma.QueryMode }
      : undefined;

    return {
      OR: searchTextWhere != null ? [{ name: searchTextWhere }] : undefined,
    };
  }

  private generateOrderBy(
    orderBy: ListOrderBy,
  ):
    | Prisma.ImageOrderByWithRelationAndSearchRelevanceInput
    | Prisma.ImageOrderByWithRelationAndSearchRelevanceInput[] {
    if (orderBy == null) {
      return { id: ListOrder.Desc };
    }

    const { sort } = orderBy;
    if (sort === ListSort.Id) {
      // Default ASC
      const order = orderBy?.order ?? ListOrder.Desc;
      return { id: order };
    } else if (sort === ListSort.Name) {
      // Default ASC
      const order = orderBy?.order ?? ListOrder.Asc;
      return { name: order };
    }

    return { id: ListOrder.Desc };
  }
}
