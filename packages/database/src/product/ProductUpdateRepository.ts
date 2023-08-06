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
  productType: ProductType;
  productId: number;
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
    const { productType, productId } = options;

    const trx = config?.trx ?? this.db;
    return await trx.productUpdate.findMany({
      where: {
        AND: [
          { productType },
          { cpuId: productType === ProductType.Cpu ? productId : undefined },
          { gpuId: productType === ProductType.Gpu ? productId : undefined },
          { status: ProductUpdateStatus.Pending },
        ],
      },
    });
  }

  async findById(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    return await trx.productUpdate.findUnique({ where: { id } });
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
    const productType = filter?.productType || null;
    const status = filter?.status || null;
    const search = filter?.search || null;

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
    let gpuProductTypeWhere: Prisma.StringNullableFilter;
    if (productType === ProductType.Gpu) {
      const gpuProductType = filter?.gpuProductType || null;
      if (gpuProductType == null) {
        throw new Error('Missing gpu product type');
      }
      gpuProductTypeWhere = { equals: gpuProductType };
    }

    return {
      AND: [
        { productType: productTypeWhere },
        { gpuProductType: gpuProductTypeWhere },
        { status: statusWhere },
        { productName: productNameWhere },
      ],
    };
  }
}
