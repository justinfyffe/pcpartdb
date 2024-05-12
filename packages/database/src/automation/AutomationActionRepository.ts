import {
  AutomationActionStatus,
  ListAutomationActionsQuery,
} from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { AutomationActionEntity } from './AutomationActionEntity';

interface ListOptions {
  query: ListAutomationActionsQuery;
}

export class AutomationActionRepository {
  constructor(protected db: DatabaseClient) {}

  async findById(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    return await trx.automationAction.findUnique({
      where: { id },
    });
  }

  async findNextPending(config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    config?.queryCounter();
    return await trx.automationAction.findFirst({
      where: { status: AutomationActionStatus.Pending },
      orderBy: [{ priority: 'desc' }, { timestamp: 'asc' }],
    });
  }

  async listPending(options: ListOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    const { pagination } = options.query ?? {};

    config?.queryCounter();
    const results = await trx.automationAction.findMany({
      where: { status: AutomationActionStatus.Pending },
      orderBy: [{ priority: 'desc' }, { timestamp: 'asc' }],
      skip: pagination?.offset ?? 0,
      take: pagination?.limit ?? 50,
    });

    config?.queryCounter();
    const total = await trx.automationAction.count({
      where: { status: AutomationActionStatus.Pending },
    });

    return { results, total };
  }

  async create(
    data: Omit<AutomationActionEntity, 'id'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    config?.queryCounter();
    return await trx.automationAction.create({ data: entity });
  }

  async update(
    id: number,
    data: Partial<AutomationActionEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    config?.queryCounter();
    return await trx.automationAction.update({
      where: { id },
      data: entity,
    });
  }
}
