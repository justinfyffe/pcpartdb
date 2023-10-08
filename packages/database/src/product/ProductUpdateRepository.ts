import {
  ListProductUpdatesFilter,
  ListProductUpdatesQuery,
  ProductType,
  ProductUpdateStatus,
  SubProductType,
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
  subProductType?: SubProductType;
}

export class ProductUpdateRepository {
  constructor(protected db: DatabaseClient) {}

  async list(options: ListOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { filter, pagination } = options.query ?? {};

    const results = await trx.productUpdate.findMany({
      where: this.generateWhere(filter),
      orderBy: { createdAt: 'asc' },
      skip: pagination?.offset ?? 0,
      take: pagination?.limit ?? 10,
    });

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
    return await trx.productUpdate.findMany({
      where: {
        AND: [{ productId }, { status: ProductUpdateStatus.Pending }],
      },
    });
  }

  async findById(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    return await trx.productUpdate.findUnique({ where: { id } });
  }

  async countPending(options: CountPendingOptions, config?: RepositoryConfig) {
    const { productType, subProductType } = options;

    const trx = config?.trx ?? this.db;
    return await trx.productUpdate.count({
      where: {
        AND: [
          { productType },
          { subProductType },
          { status: ProductUpdateStatus.Pending },
        ],
      },
    });
  }

  async create(
    data: Omit<ProductUpdateEntity, 'id'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    return await trx.productUpdate.create({ data: entity });
  }

  async update(
    id: number,
    data: Partial<ProductUpdateEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    return await trx.productUpdate.update({ where: { id }, data: entity });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
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

    // Handle GPU-specific filters
    let subProductTypeWhere: Prisma.StringNullableFilter;
    if (productType === ProductType.Gpu) {
      const subProductType = filter?.subProductType;
      if (subProductType == null) {
        throw new Error('Missing sub product type');
      }
      subProductTypeWhere = { equals: subProductType };
    }

    return {
      AND: [
        { productType: productTypeWhere },
        { subProductType: subProductTypeWhere },
        { status: statusWhere },
        { productName: productNameWhere },
      ],
    };
  }
}
