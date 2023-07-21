import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { AutomationQueueItemEntity } from './AutomationQueueItemEntity';

export class AutomationQueueRepository {
  constructor(protected db: DatabaseClient) {}

  async create(
    data: Omit<AutomationQueueItemEntity, 'id'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    return await trx.automationQueueItem.create({ data: entity });
  }

  async update(
    id: number,
    data: Partial<AutomationQueueItemEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    return await trx.automationQueueItem.update({
      where: { id },
      data: entity,
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.automationQueueItem.delete({ where: { id } });
  }
}
