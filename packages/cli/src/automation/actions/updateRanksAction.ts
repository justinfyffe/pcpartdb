import {
  AutomationAction,
  buildProductRankKey,
  getPreferenceBenchmarks,
  hasProductBenchmark,
  hasProductFieldRawValue,
  ListProductsFilter,
  ListProductsRequest,
  ListProductsResponse,
  Product,
  productBenchmarkValue,
  productFieldRawValue,
  ProductRanks,
  ProductType,
  RankType,
  UpdateProductRanksRequest,
} from '@pcpartdb/shared';
import FormData from 'form-data';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { AutomationContext } from '../types';
import { productCalculationsPath } from '../utils/product-calculations';

/**
 * Filters for fetching products we want to run computations on.
 */
const LIST_FILTERS: Partial<Record<ProductType, ListProductsFilter>> = {
  [ProductType.Cpu]: { productType: ProductType.Cpu },
  [ProductType.Gpu]: { productType: ProductType.Gpu, isChipset: true },
};

export async function updateRanksAction(
  _action: AutomationAction,
  context: AutomationContext,
) {
  await updateRanks(ProductType.Cpu, context);
  await updateRanks(ProductType.Gpu, context);

  // Reset cache
  // await context.api.delete('website/cache');

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updateRanksDate: new Date().getTime(),
  };
}

async function updateRanks(
  productType: ProductType,
  context: AutomationContext,
) {
  const products = await fetchProducts(productType, context);

  const request: UpdateProductRanksRequest = {
    productType,
    ranks: {},
  };

  console.time('populateRanks for ' + productType);
  request.ranks = populateRanks(productType, products);
  console.timeEnd('populateRanks for ' + productType);

  // Create and upload ranks file
  const path = await createRanksFile(productType, request);
  await uploadRanksFile(path, context);
}

async function fetchProducts(
  productType: ProductType,
  context: AutomationContext,
) {
  const filter = LIST_FILTERS[productType];
  const request: ListProductsRequest = { query: { filter }, bypassCache: true };
  const response = await context.api.get<ListProductsResponse>(
    'products/all',
    {},
    { params: { req: JSON.stringify(request) } },
  );
  return response.results;
}

function populateRanks(productType: ProductType, products: Product[]) {
  const ranks: Record<number, ProductRanks> = {};

  const rankableBenchmarks = getPreferenceBenchmarks(productType);
  for (const benchmark of rankableBenchmarks) {
    const filteredPerformanceProducts = products.filter((p) =>
      hasProductBenchmark(p, benchmark),
    );
    const filteredValueProducts = filteredPerformanceProducts.filter((p) =>
      hasProductFieldRawValue(p.fields?.msrp),
    );

    const sortedByPerformance = filteredPerformanceProducts.sort(
      (a, b) =>
        productBenchmarkValue(b, benchmark) -
        productBenchmarkValue(a, benchmark),
    );
    const sortedByValue = filteredValueProducts.sort(
      (a, b) =>
        productBenchmarkValue(b, benchmark) /
          productFieldRawValue<number>(b.fields.msrp) -
        productBenchmarkValue(a, benchmark) /
          productFieldRawValue<number>(a.fields.msrp),
    );

    for (const product of products) {
      const productId = product.id;
      ranks[productId] = { ...(ranks[productId] ?? {}) };

      // Unranked will be "0"
      const performanceRank =
        sortedByPerformance.findIndex((p) => p.id === product.id) + 1;
      const valueRank = sortedByValue.findIndex((p) => p.id === product.id) + 1;

      if (performanceRank > 0) {
        const rankKey = buildProductRankKey({
          type: RankType.Performance,
          benchmark,
        });
        ranks[productId][rankKey] = {
          rank: performanceRank,
          total: sortedByPerformance.length,
        };
      }
      if (valueRank > 0) {
        const rankKey = buildProductRankKey({
          type: RankType.PerformancePerDollar,
          benchmark,
        });
        ranks[productId][rankKey] = {
          rank: valueRank,
          total: sortedByValue.length,
        };
      }
    }
  }

  return ranks;
}

async function createRanksFile(
  productType: ProductType,
  request: UpdateProductRanksRequest,
) {
  const json = JSON.stringify(request);
  const path = productCalculationsPath(
    `${productType.toLowerCase()}-ranks.json`,
  );
  await fsPromises.writeFile(path, json, 'utf-8');
  return path;
}

async function uploadRanksFile(path: string, context: AutomationContext) {
  const data = new FormData();
  data.append('file', fs.createReadStream(path));
  console.log(`Uploading ranks: ${path}`);
  await context.api.post(
    'automation/tasks/product-ranks',
    data,
    {},
    {
      headers: { 'content-type': 'multipart/form-data' },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    },
  );
  console.log(`Uploaded ranks: ${path}`);
}
