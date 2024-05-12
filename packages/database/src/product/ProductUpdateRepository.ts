import {
  ListProductUpdatesFilter,
  ListProductUpdatesQuery,
  ProductType,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductUpdateEntity } from './ProductUpdateEntity';

interface ListOptions {
  query: ListProductUpdatesQuery;
}

export interface FindPendingByProductIdOptions {
  productId: number;
}

export interface CountPendingOptions {
  productType: ProductType;
}

export class ProductUpdateRepository {
  constructor(protected db: DatabaseClient) {}

  async list(options: ListOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { filter, pagination } = options.query ?? {};

    config?.queryCounter();
    const results = await trx.productUpdate.findMany({
      where: this.generateWhere(filter),
      orderBy: { createdAt: 'asc' },
      skip: pagination?.offset ?? 0,
      take: pagination?.limit ?? 10,
    });

    config?.queryCounter();
    const total = await trx.productUpdate.count({
      where: this.generateWhere(filter),
    });

    return { results, total };
  }

  async findPendingByProductId(
    options: FindPendingByProductIdOptions,
    config?: RepositoryConfig,
  ) {
    const { productId } = options;

    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    return await trx.productUpdate.findMany({
      where: { productId, status: ProductUpdateStatus.Pending },
    });
  }

  async findById(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    config?.queryCounter();
    return await trx.productUpdate.findUnique({ where: { id } });
  }

  async countPending(options: CountPendingOptions, config?: RepositoryConfig) {
    const { productType } = options;

    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    return await trx.productUpdate.count({
      where: {
        productType,
        status: ProductUpdateStatus.Pending,
      },
    });
  }

  async create(
    data: Omit<ProductUpdateEntity, 'id'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    config?.queryCounter();
    return await trx.productUpdate.create({ data: entity });
  }

  async update(
    id: number,
    data: Partial<ProductUpdateEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    config?.queryCounter();
    return await trx.productUpdate.update({ where: { id }, data: entity });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    await trx.productUpdate.delete({ where: { id } });
  }

  private generateWhere(
    filter: ListProductUpdatesFilter,
  ): Prisma.ProductUpdateWhereInput {
    const productType = filter?.productType;
    const status = filter?.status;
    const search = filter?.search;

    // Product Type
    const productTypeWhere: Prisma.StringFilter = productType
      ? { equals: productType }
      : undefined;

    // Status
    const statusWhere: Prisma.StringFilter = status
      ? { equals: status }
      : undefined;

    // Source name
    const productNameWhere: Prisma.StringFilter = search
      ? { contains: search, mode: 'insensitive' }
      : undefined;

    return {
      productType: productTypeWhere,
      status: statusWhere,
      productName: productNameWhere,
    };
  }
}
