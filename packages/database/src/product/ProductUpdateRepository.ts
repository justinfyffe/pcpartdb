import { ProductType, ProductUpdateStatus } from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductUpdateEntity } from './ProductUpdateEntity';

export interface FindPendingOptions {
  productType: ProductType;
  productId?: number;
  productCompany?: string;
  productName?: string;
}

export class ProductUpdateRepository {
  constructor(protected db: DatabaseClient) {}

  async findPending(options: FindPendingOptions, config?: RepositoryConfig) {
    const { productType, productId, productCompany, productName } = options;

    const trx = config?.trx ?? this.db;
    return await trx.productUpdate.findMany({
      where: {
        productType,
        productName,
        productCompany,
        cpuId: productType === ProductType.Cpu ? productId : undefined,
        gpuId: productType === ProductType.Gpu ? productId : undefined,
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

    return await trx.productUpdate.create({ data: entity });
  }

  async update(
    id: number,
    data: Partial<ProductUpdateEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    return await trx.productUpdate.update({
      where: { id },
      data: entity,
    });
  }

  async approve(id: number, config?: RepositoryConfig) {
    const data = {
      status: ProductUpdateStatus.Approved,
      statusUpdatedAt: new Date(),
    };
    await this.update(id, data, config);
  }

  async reject(id: number, config?: RepositoryConfig) {
    const data = {
      status: ProductUpdateStatus.Rejected,
      statusUpdatedAt: new Date(),
    };
    await this.update(id, data, config);
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.productUpdate.delete({ where: { id } });
  }
}
