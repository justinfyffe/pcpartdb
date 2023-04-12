import {
  DataUpdateStatus,
  DEFAULT_LIST_DATA_UPDATES_LIMIT,
  DEFAULT_LIST_DATA_UPDATES_OFFSET,
} from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { DataUpdateEntity } from './DataUpdateEntity';

interface CountOptions {
  gpuId?: number;
  status?: DataUpdateStatus;
}

interface ListOptions {
  gpuId?: number;
  status?: DataUpdateStatus;

  offset?: number;
  limit?: number;
}

export class DataUpdateRepository {
  constructor(protected db: DatabaseClient) {}

  async count(options?: CountOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const { gpuId, status } = options ?? {};

    return await db.dataUpdate.count({
      where: { gpuId, status },
    });
  }

  async list(
    options: ListOptions,
    config?: RepositoryConfig,
  ): Promise<DataUpdateEntity[]> {
    const db = config?.trx ?? this.db;

    const { gpuId, status, limit, offset } = options ?? {};

    return await db.dataUpdate.findMany({
      where: { gpuId, status },
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
