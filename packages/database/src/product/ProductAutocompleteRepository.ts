import { ProductType } from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductEntity } from './ProductEntity';

const AUTOCOMPLETE_LIMIT = 25;

export class ProductAutocompleteRepository {
  constructor(protected db: DatabaseClient) {}

  async autocomplete(
    productType: ProductType,
    query: string,
    config?: RepositoryConfig,
  ): Promise<ProductEntity[]> {
    const db = config?.trx ?? this.db;

    const tokens = query
      .split(' ')
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 1);

    let regexTokens = query
      .split(' ')
      .filter((value) => value.trim().length > 1)
      .map((value) => `(?=.*${value.trim().toLowerCase()})`)
      .join('');
    regexTokens = `${regexTokens}.*`;

    // Get results based on search relevancy.
    config?.queryCounter();
    const priorityProducts = await db.product.findMany({
      where: {
        productType,
        searchText: { search: tokens.join(' & '), mode: 'insensitive' },
      },
      include: {
        cpuFields: productType === ProductType.Cpu,
        gpuFields: productType === ProductType.Gpu,
      },
      orderBy: [
        {
          _relevance: {
            fields: ['searchText'],
            search: tokens.join(' & '),
            sort: 'desc',
          },
        },
      ],
      take: AUTOCOMPLETE_LIMIT,
    });

    // Get results based on regex.
    let fillerProducts: { id: number }[] = [];
    if (regexTokens !== '.*') {
      config?.queryCounter();
      fillerProducts = await db.$queryRaw`
        SELECT id FROM products
        WHERE product_type = ${productType} AND search_text ~* (${regexTokens})
        LIMIT ${AUTOCOMPLETE_LIMIT}
      `;
    } else {
      config?.queryCounter();
      fillerProducts = await db.product.findMany({
        where: { productType },
        take: AUTOCOMPLETE_LIMIT,
      });
    }
    const fillerResultIds = [...fillerProducts].slice(0, AUTOCOMPLETE_LIMIT);

    config?.queryCounter();
    const fillerResults = await db.product.findMany({
      where: { id: { in: fillerResultIds.map((json) => json.id) } },
      include: { cpuFields: true, gpuFields: true },
    });

    // Return top results.
    return [
      ...new Map(
        [...priorityProducts, ...fillerResults].map((v) => [v.id, v]),
      ).values(),
    ].slice(0, AUTOCOMPLETE_LIMIT);
  }
}
