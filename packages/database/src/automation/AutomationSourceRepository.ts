import {
  ListAutomationSourcesFilter,
  ListAutomationSourcesQuery,
  ProductSourceKey,
  ProductType,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { AutomationSourceEntity } from './AutomationSourceEntity';

interface ListOptions {
  query?: ListAutomationSourcesQuery;
}

interface ListGroupsOptions {
  query: ListAutomationSourcesQuery;
}

interface CountUnarchivedGroupsOptions {
  query: ListAutomationSourcesQuery;
}

interface AutocompleteOptions {
  productType: ProductType;
  sourceKey?: ProductSourceKey;
  query: string;
}

export class AutomationSourceRepository {
  constructor(protected db: DatabaseClient) {}

  async findByIds(ids: number[], config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    config?.queryCounter();
    return await trx.automationSource.findMany({
      where: { id: { in: ids } },
    });
  }

  async create(
    data: Omit<AutomationSourceEntity, 'id'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    config?.queryCounter();
    return await trx.automationSource.create({ data: entity });
  }

  async update(
    id: number,
    data: Partial<AutomationSourceEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    config?.queryCounter();
    return await trx.automationSource.update({
      where: { id },
      data: entity,
    });
  }

  async upsert(
    data: Omit<AutomationSourceEntity, 'id'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    config?.queryCounter();
    return await trx.automationSource.upsert({
      where: {
        productType_sourceKey_externalKey: {
          productType: entity.productType,
          sourceKey: entity.sourceKey,
          externalKey: entity.externalKey,
        },
      },
      update: entity,
      create: entity,
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    await trx.automationSource.delete({ where: { id } });
  }

  async listAll(options: ListOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { filter } = options.query ?? {};

    config?.queryCounter();
    return await trx.automationSource.findMany({
      where: { ...this.generateWhere(filter) },
    });
  }

  /**
   * Return a list of automation source entities, grouped together based on
   * product type and source name.
   */
  async listGroups(options: ListGroupsOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { filter, pagination } = options.query ?? {};

    // Get group keys that match the filter
    config?.queryCounter();
    const rawGroupKeys = await trx.automationSource.groupBy({
      by: ['groupKey'],
      _count: {
        groupKey: true,
      },
      where: this.generateWhere(filter),
      orderBy: [
        { _count: { groupKey: 'desc' } },
        { _max: { sourceName: 'asc' } },
      ],
      skip: pagination?.offset ?? 0,
      take: pagination?.limit ?? 50,
    });
    const groupKeys = rawGroupKeys.map((value) => value.groupKey);

    // Group by source name
    const groups = new Map<string, AutomationSourceEntity[]>();
    for (const groupKey of groupKeys) {
      groups.set(groupKey, []);
    }

    // Get results based on the source names.
    config?.queryCounter();
    const sources = await trx.automationSource.findMany({
      where: {
        productType: filter?.productType,
        groupKey: { in: groupKeys, mode: 'insensitive' },
      },
    });
    for (const source of sources) {
      const key = source.groupKey;
      groups.get(key).push(source);
    }

    // Count total groups
    config?.queryCounter();
    const total = (
      await trx.automationSource.findMany({
        distinct: ['groupKey'],
        select: { groupKey: true },
        where: this.generateWhere(filter),
      })
    ).length;

    return { results: [...groups.values()], total };
  }

  async countPendingGroups(
    options: CountUnarchivedGroupsOptions,
    config?: RepositoryConfig,
  ) {
    const { filter } = options.query ?? {};

    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    const total = (
      await trx.automationSource.findMany({
        distinct: ['groupKey'],
        select: { groupKey: true },
        where: this.generateWhere(filter),
      })
    ).length;
    return total;
  }

  async autocomplete(options: AutocompleteOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { productType, sourceKey, query } = options;
    const searchTokens = query
      .split(' ')
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 1);
    let regexTokens = query
      .split(' ')
      .filter((value) => value.trim().length > 1)
      .map((value) => `(?=.*${value.trim().toLowerCase()})`)
      .join('');
    regexTokens = `${regexTokens}.*`;

    // Get results based on relevancy
    config?.queryCounter();
    const priorityResults = await trx.automationSource.findMany({
      where: {
        AND: [
          { productType, sourceKey },
          {
            OR: [
              {
                sourceName: {
                  search: searchTokens.join(' & '),
                  mode: 'insensitive',
                },
              },
              {
                sourceUrl: {
                  search: searchTokens.join(' & '),
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        _relevance: {
          fields: ['sourceName', 'sourceUrl'],
          search: searchTokens.join(' | '),
          sort: 'desc',
        },
      },
      take: 6,
    });

    // Get results based on regex
    let fillerResultIds: { id: number }[] = [];
    if (regexTokens !== '.*') {
      config?.queryCounter();
      fillerResultIds = await trx.$queryRaw`
        SELECT id FROM automation_sources
        WHERE
          product_type=${productType} AND
          source_key=${sourceKey} AND
          CONCAT(source_name, ' ', source_url) ~* (${regexTokens})
        ORDER BY source_name ASC NULLS LAST
        LIMIT 6
      `;
    } else {
      config?.queryCounter();
      fillerResultIds = await trx.$queryRaw`
        SELECT id FROM automation_sources
        WHERE
          product_type=${productType} AND
          source_key=${sourceKey}
        ORDER BY source_name ASC NULLS LAST
        LIMIT 6
      `;
    }
    config?.queryCounter();
    const fillerResults = await trx.automationSource.findMany({
      where: { id: { in: fillerResultIds.map((json) => json.id) } },
      orderBy: { sourceName: 'desc' },
    });

    // Return top results.
    return [
      ...new Map(
        [...priorityResults, ...fillerResults].map((v) => [v.id, v]),
      ).values(),
    ].slice(0, 6);
  }

  async isSourceUsed(
    key: ProductSourceKey,
    url: string,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? this.db;
    config?.queryCounter();
    return (
      (await db.productSource.count({
        where: { sourceKey: key, sourceUrl: url },
      })) > 0
    );
  }

  private generateWhere(
    filter: ListAutomationSourcesFilter,
  ): Prisma.AutomationSourceWhereInput {
    const productType = filter?.productType;
    const includeArchived = filter?.includeArchived ?? false;
    const search = filter?.search;

    // Product Type
    const productTypeWhere: Prisma.StringFilter = productType
      ? { equals: productType }
      : undefined;

    // Archived
    const archivedWhere: Prisma.BoolNullableFilter =
      includeArchived !== true ? { equals: false } : undefined;

    // Source name
    const sourceNameWhere: Prisma.StringFilter = search
      ? { contains: search, mode: 'insensitive' }
      : undefined;

    return {
      productType: productTypeWhere,
      archived: archivedWhere,
      sourceName: sourceNameWhere,
    };
  }
}
