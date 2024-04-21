import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { CpuFieldsEntity } from './CpuFieldsEntity';
import { GpuFieldsEntity } from './GpuFieldsEntity';

interface FindByProductIdsOptions {
  productIds: number[];
}

export class ProductFieldsRepository {
  constructor(protected db: DatabaseClient) {}

  async findByProductIds(
    options: FindByProductIdsOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;

    const cpuFieldResults: CpuFieldsEntity[] = await db.cpuFields.findMany({
      where: { productId: { in: options.productIds } },
    });
    const gpuFieldResults: GpuFieldsEntity[] = await db.gpuFields.findMany({
      where: { productId: { in: options.productIds } },
    });

    return [...cpuFieldResults, ...gpuFieldResults];
  }
}
