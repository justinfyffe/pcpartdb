import { DataUpdateStatus } from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { DataUpdateEntity } from './DataUpdateEntity';

const DEFAULT_LIST_DATA_UPDATES_OFFSET = 0;
const DEFAULT_LIST_DATA_UPDATES_LIMIT = 50;

interface ListOptions {
  gpuId?: number;

  offset?: number;
  limit?: number;
}

export class DataUpdateRepository {
  constructor(protected db: DatabaseClient) {}

  async listPending(
    options: ListOptions,
    config?: RepositoryConfig,
  ): Promise<DataUpdateEntity[]> {
    const db = config?.trx ?? this.db;

    const { gpuId, limit, offset } = options ?? {};

    return await db.dataUpdate.findMany({
      where: { gpuId, status: DataUpdateStatus.Pending },
      orderBy: { createdAt: 'asc' },
      skip: offset ?? DEFAULT_LIST_DATA_UPDATES_OFFSET,
      take: limit ?? DEFAULT_LIST_DATA_UPDATES_LIMIT,
    });
  }

  async findById(
    id: number,
    config?: RepositoryConfig,
  ): Promise<DataUpdateEntity> {
    const trx = config?.trx ?? this.db;

    return await trx.dataUpdate.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<DataUpdateEntity, 'id'>, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    const { gpu: _gpu, decisionUser: _user, ...entity } = data;

    return await trx.dataUpdate.create({
      data: entity,
    });
  }

  async update(
    id: number,
    data: Partial<DataUpdateEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { gpu: _gpu, decisionUser: _user, ...entity } = data;

    return await trx.dataUpdate.update({
      where: { id },
      data: entity,
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.dataUpdate.delete({ where: { id } });
  }
}
