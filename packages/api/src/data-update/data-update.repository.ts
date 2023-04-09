import { Injectable } from '@nestjs/common';
import { DataUpdateEntity } from '@pcpartdb/database';
import { DataUpdateStatus } from '@pcpartdb/shared';
import { Database, RepositoryConfig } from '../database';

const DEFAULT_LIST_DATA_UPDATES_OFFSET = 0;
const DEFAULT_LIST_DATA_UPDATES_LIMIT = 50;

interface ListOptions {
  offset?: number;
  limit?: number;
}

@Injectable()
export class DataUpdateRepository {
  constructor(private db: Database) {}

  async listPending(
    options: ListOptions,
    config?: RepositoryConfig,
  ): Promise<DataUpdateEntity[]> {
    const db = config?.trx ?? this.db;

    const { limit, offset } = options ?? {};

    return await db.dataUpdate.findMany({
      where: { status: DataUpdateStatus.Pending },
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
}
