import {
  AutomationQueueStatus,
  ListAutomationQueueQuery,
} from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { AutomationQueueItemEntity } from './AutomationQueueItemEntity';

interface ListOptions {
  query: ListAutomationQueueQuery;
}

export class AutomationQueueRepository {
  constructor(protected db: DatabaseClient) {}

  async findNextPending(config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    return await trx.automationQueueItem.findFirst({
      where: { status: AutomationQueueStatus.Pending },
      orderBy: [{ priority: 'desc' }, { timestamp: 'asc' }],
    });
  }

  async listPending(options: ListOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    const { pagination } = options.query ?? {};

    const results = await trx.automationQueueItem.findMany({
      where: { status: AutomationQueueStatus.Pending },
      orderBy: [{ priority: 'desc' }, { timestamp: 'asc' }],
      skip: pagination?.offset ?? 0,
      take: pagination?.limit ?? 50,
    });

    const total = await trx.automationQueueItem.count({
      where: { status: AutomationQueueStatus.Pending },
    });

    return { results, total };
  }

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

  async updateStatus(
    id: number,
    status: AutomationQueueStatus,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    await trx.automationQueueItem.update({
      where: { id },
      data: { status, statusUpdatedAt: new Date() },
    });
  }
}
