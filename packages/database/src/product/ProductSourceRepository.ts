import {
  ListProductSourcesFilter,
  ListProductSourcesQuery,
  ProductSourceKey,
  ProductType,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductSourceEntity } from './ProductSourceEntity';

interface ListGroupsOptions {
  query: ListProductSourcesQuery;
}

interface AutocompleteOptions {
  productType: ProductType;
  sourceKey?: ProductSourceKey;
  query: string;
}

export class ProductSourceRepository {
  constructor(protected db: DatabaseClient) {}

  async findByIds(ids: number[], config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    return await trx.productSource.findMany({
      where: { id: { in: ids } },
    });
  }

  async create(
    data: Omit<ProductSourceEntity, 'id'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    return await trx.productSource.create({ data: entity });
  }

  async update(
    id: number,
    data: Partial<ProductSourceEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    return await trx.productSource.update({
      where: { id },
      data: entity,
    });
  }

  async upsert(
    data: Omit<ProductSourceEntity, 'id'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    return await trx.productSource.upsert({
      where: {
        type_key_url: {
          productType: entity.productType,
          sourceKey: entity.sourceKey,
          sourceUrl: entity.sourceUrl,
        },
      },
      update: entity,
      create: entity,
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.productSource.delete({ where: { id } });
  }

  /**
   * Return a list of product source entities, grouped together based on
   * product type and source name.
   */
  async listGroups(options: ListGroupsOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { filter, pagination } = options.query ?? {};

    // Get source names that match the filter
    const rawSourceNames = await trx.productSource.groupBy({
      by: ['productType', 'sourceName'],
      _max: {
        updatedAt: true,
      },
      where: this.generateWhere(filter),
      orderBy: { _max: { updatedAt: 'desc' } },
      skip: pagination?.offset ?? 0,
      take: pagination?.limit ?? 50,
    });
    const sourceNames = rawSourceNames.map((value) => value.sourceName);

    // Group by source name
    const groups = new Map<string, ProductSourceEntity[]>();
    for (const sourceName of sourceNames) {
      groups.set(sourceName.toLowerCase(), []);
    }

    // Get results based on the source names.
    const sources = await trx.productSource.findMany({
      where: {
        productType: filter?.productType,
        sourceName: { in: sourceNames, mode: 'insensitive' },
      },
    });
    for (const source of sources) {
      const key = source.sourceName.toLowerCase();
      groups.get(key).push(source);
    }

    // Count total groups
    const total = (
      await trx.productSource.findMany({
        distinct: ['productType', 'sourceName'],
        select: { sourceName: true },
        where: this.generateWhere(filter),
      })
    ).length;

    return { results: [...groups.values()], total };
  }

  async autocomplete(options: AutocompleteOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { productType, sourceKey, query } = options;
    const tokens = query
      .split(' ')
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 1);

    return await trx.productSource.findMany({
      where: {
        productType,
        sourceKey,
        AND: {
          OR: [
            {
              sourceName: {
                search: tokens.join(' & '),
                mode: 'insensitive',
              },
            },
            {
              sourceUrl: {
                search: tokens.join(' & '),
                mode: 'insensitive',
              },
            },
          ],
        },
      },
      orderBy: {
        _relevance: {
          fields: ['sourceName', 'sourceUrl'],
          search: tokens.join(' | '),
          sort: 'desc',
        },
      },
      take: 10,
    });
  }

  private generateWhere(
    filter: ListProductSourcesFilter,
  ): Prisma.ProductSourceWhereInput {
    const productType = filter?.productType || null;
    const includeArchived = filter?.includeArchived ?? false;

    // Product Type
    const productTypeWhere: Prisma.StringFilter = productType
      ? { equals: productType }
      : undefined;

    // Archived
    const archivedWhere: Prisma.BoolNullableFilter =
      includeArchived !== true ? { equals: false } : undefined;

    return {
      AND: {
        productType: productTypeWhere,
        archived: archivedWhere,
      },
    };
  }
}
