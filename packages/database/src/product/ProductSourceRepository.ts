import {
  ListOrder,
  ListProductSourcesFilter,
  ListProductSourcesQuery,
  ProductSourceKey,
  ProductType,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductSourceEntity } from './ProductSourceEntity';

const DEFAULT_LIST_OFFSET = 0;
const DEFAULT_LIST_LIMIT = 10;

interface FindBySourceNamesOptions {
  productType: ProductType;
  sourceNames: string[];
}

interface GroupBySourceNameOptions {
  query: ListProductSourcesQuery;
}

interface CountBySourceNameOptions {
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

  async findBySourceNames(
    options: FindBySourceNamesOptions,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;

    const { productType, sourceNames } = options;

    return await trx.productSource.findMany({
      where: {
        productType,
        sourceName: { in: sourceNames, mode: 'insensitive' },
      },
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

  async archive(id: number, config?: RepositoryConfig) {
    return await this.update(id, { archived: true }, config);
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.productSource.delete({ where: { id } });
  }

  async groupBySourceName(
    options: GroupBySourceNameOptions,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;

    const { filter, orderBy, pagination } = options.query ?? {};
    const { limit, offset } = pagination ?? {};

    const rawSourceNames = await trx.productSource.groupBy({
      by: ['productType', 'sourceName'],
      _count: {
        id: true,
      },
      where: this.generateWhere(filter),
      orderBy: [
        { _count: { id: ListOrder.Desc } },
        { sourceName: orderBy?.order ?? ListOrder.Asc },
      ],
      skip: offset ?? DEFAULT_LIST_OFFSET,
      take: limit ?? DEFAULT_LIST_LIMIT,
    });
    return rawSourceNames.map((value) => value.sourceName);
  }

  async countSourceNames(
    options: CountBySourceNameOptions,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;

    const { filter } = options.query ?? {};

    // This could be slow
    // https://github.com/prisma/prisma/issues/4228#issuecomment-1405042711
    const results = await trx.productSource.findMany({
      distinct: ['sourceName'],
      select: { sourceName: true },
      where: this.generateWhere(filter),
    });
    return results.length;
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
