import {
  GpuProductType,
  ListProductSourcesFilter,
  ListProductSourcesQuery,
  ProductSourceKey,
  ProductType,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductSourceEntity } from './ProductSourceEntity';

interface ListOptions {
  query?: ListProductSourcesQuery;
}

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
    const { gpuChipset: _gpuChipset, ...entity } = data;

    return await trx.productSource.create({ data: entity });
  }

  async update(
    id: number,
    data: Partial<ProductSourceEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { gpuChipset: _gpuChipset, ...entity } = data;

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
    const { gpuChipset: _gpuChipset, ...entity } = data;

    return await trx.productSource.upsert({
      where: {
        product_sources_productType_sourceKey_externalKey_unique: {
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
    await trx.productSource.delete({ where: { id } });
  }

  async listAll(options: ListOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { filter } = options.query ?? {};

    return await trx.productSource.findMany({
      where: { ...this.generateWhere(filter) },
    });
  }

  /**
   * Return a list of product source entities, grouped together based on
   * product type and source name.
   */
  async listGroups(options: ListGroupsOptions, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;

    const { filter, pagination } = options.query ?? {};

    // Get group keys that match the filter
    const rawGroupKeys = await trx.productSource.groupBy({
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
    const groups = new Map<string, ProductSourceEntity[]>();
    for (const groupKey of groupKeys) {
      groups.set(groupKey, []);
    }

    // Get results based on the source names.
    const sources = await trx.productSource.findMany({
      where: {
        productType: filter?.productType,
        groupKey: { in: groupKeys, mode: 'insensitive' },
      },
      include: {
        gpuChipset: filter?.gpuProductType === GpuProductType.RetailModel,
      },
    });
    for (const source of sources) {
      const key = source.groupKey;
      groups.get(key).push(source);
    }

    // Count total groups
    const total = (
      await trx.productSource.findMany({
        distinct: ['groupKey'],
        select: { groupKey: true },
        where: this.generateWhere(filter),
      })
    ).length;

    return { results: [...groups.values()], total };
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
    const priorityResults = await trx.productSource.findMany({
      where: {
        AND: [
          { productType },
          { sourceKey },
          { gpuChipsetId: { equals: null } },
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
      fillerResultIds = await trx.$queryRaw`
        SELECT id FROM product_sources
        WHERE
          product_type=${productType} AND
          source_key=${sourceKey} AND
          CONCAT(source_name, ' ', source_url) ~* (${regexTokens})
        ORDER BY source_name ASC NULLS LAST
        LIMIT 6
      `;
    } else {
      fillerResultIds = await trx.$queryRaw`
        SELECT id FROM product_sources
        WHERE
          product_type=${productType} AND
          source_key=${sourceKey}
        ORDER BY source_name ASC NULLS LAST
        LIMIT 6
      `;
    }
    const fillerResults = await trx.productSource.findMany({
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

  private generateWhere(
    filter: ListProductSourcesFilter,
  ): Prisma.ProductSourceWhereInput {
    const productType = filter?.productType || null;
    const includeArchived = filter?.includeArchived ?? false;
    const search = filter?.search || null;

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

    // Handle GPU-specific filters
    let gpuChipsetIdWhere: Prisma.IntNullableFilter;
    if (productType === ProductType.Gpu) {
      const gpuChipsetId = filter?.gpuChipsetId || null;
      const gpuProductType = filter?.gpuProductType || null;

      if (gpuProductType === GpuProductType.Chipset) {
        gpuChipsetIdWhere = { equals: null };
      } else if (gpuProductType === GpuProductType.RetailModel) {
        gpuChipsetIdWhere =
          gpuChipsetId != null ? { equals: gpuChipsetId } : { not: null };
      } else {
        throw new Error('Invalid gpu product type');
      }
    }

    return {
      AND: [
        { productType: productTypeWhere },
        { sourceName: sourceNameWhere },
        { gpuChipsetId: gpuChipsetIdWhere },
        { archived: archivedWhere },
      ],
    };
  }
}
