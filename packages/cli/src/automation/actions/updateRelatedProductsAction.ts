import {
  AutomationAction,
  buildRelatedProductKey,
  getPreferenceBenchmarks,
  hasProductBenchmark,
  ListProductsFilter,
  ListProductsRequest,
  ListProductsResponse,
  MarketSegment,
  Product,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  productFieldRawValue,
  ProductType,
  RelatedProducts,
  RelatedProductType,
  surroundingValues,
  UpdateRelatedProductsRequest,
} from '@pcpartdb/shared';
import FormData from 'form-data';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { AutomationContext } from '../types';
import { productCalculationsPath } from '../utils/product-calculations';

const TOTAL_RELATIVE_PRODUCTS = 10;

/**
 * Filters for fetching products we want to run computations on.
 */
const LIST_FILTERS: Partial<Record<ProductType, ListProductsFilter>> = {
  [ProductType.Cpu]: { productType: ProductType.Cpu },
  [ProductType.Gpu]: { productType: ProductType.Gpu, isChipset: true },
};

export async function updateRelatedProductsAction(
  _action: AutomationAction,
  context: AutomationContext,
) {
  await updateRelatedProducts(ProductType.Cpu, context);
  await updateRelatedProducts(ProductType.Gpu, context);

  // Reset cache
  await context.api.delete('website/cache');

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updateRelatedProductsDate: new Date().getTime(),
  };
}

async function updateRelatedProducts(
  productType: ProductType,
  context: AutomationContext,
) {
  const products = await fetchProducts(productType, context);

  const request: UpdateRelatedProductsRequest = {
    productType,
    relatedProducts: {},
  };

  console.time('populateRelatedProducts for ' + productType);
  request.relatedProducts = populateRelatedProducts(productType, products);
  console.timeEnd('populateRelatedProducts for ' + productType);

  // Create and upload ranks file
  const path = await createRelatedProductsFile(productType, request);
  await uploadRelatedProductsFile(path, context);
}

async function fetchProducts(
  productType: ProductType,
  context: AutomationContext,
) {
  const filter = LIST_FILTERS[productType];
  const request: ListProductsRequest = { query: { filter } };
  const response = await context.api.get<ListProductsResponse>(
    'products/all',
    {},
    { params: { req: JSON.stringify(request) } },
  );
  return response.results;
}

function populateRelatedProducts(
  productType: ProductType,
  products: Product[],
) {
  const relatedProducts: Record<number, RelatedProducts> = {};

  const rankableBenchmarks = getPreferenceBenchmarks(productType);
  for (const benchmark of rankableBenchmarks) {
    const performanceProducts = products.filter((p) =>
      hasProductBenchmark(p, benchmark),
    );
    const valueProducts = performanceProducts.filter(
      (p) => productBenchmarkValuePerMsrp(p, benchmark) != null,
    );

    const performanceSorted = performanceProducts.sort(
      (a, b) =>
        productBenchmarkValue(b, benchmark) -
        productBenchmarkValue(a, benchmark),
    );
    const valueSorted = valueProducts.sort(
      (a, b) =>
        productBenchmarkValue(b, benchmark) -
        productBenchmarkValue(a, benchmark),
    );

    const performanceFiltered = Object.values(MarketSegment).reduce(
      (acc, segment) => {
        acc[segment] = performanceSorted.filter(
          (p) => productFieldRawValue(p.fields?.marketSegment) === segment,
        );
        return acc;
      },
      {} as Record<MarketSegment, Product[]>,
    );
    const valueFiltered = Object.values(MarketSegment).reduce(
      (acc, segment) => {
        acc[segment] = valueSorted.filter(
          (p) => productFieldRawValue(p.fields?.marketSegment) === segment,
        );
        return acc;
      },
      {} as Record<MarketSegment, Product[]>,
    );

    for (const product of products) {
      const productId = product.id;
      relatedProducts[productId] = { ...(relatedProducts[productId] ?? {}) };

      const segment = productFieldRawValue<MarketSegment>(
        product.fields?.marketSegment,
      );
      const hasSegment = segment != null;
      const hasMsrp = productBenchmarkValuePerMsrp(product, benchmark);

      let relative: Product[] = [];
      if (hasSegment && hasMsrp) {
        // Products with segment and msrp
        relative = valueFiltered[segment];
      } else if (hasSegment) {
        // Products with segment
        relative = performanceFiltered[segment];
      } else {
        // All other products
        relative = performanceSorted;
      }

      const surrounded = getSurroundingProducts(product.id, relative).map(
        (p) => p.id,
      );

      if (surrounded.length > 0) {
        const key = buildRelatedProductKey({
          type: RelatedProductType.Performance,
          benchmark,
        });
        relatedProducts[productId][key] = surrounded.map((s) => ({ id: s }));
      }
    }
  }

  return relatedProducts;
}

function getSurroundingProducts(productId: number, products: Product[]) {
  const idx = products.findIndex((p) => p.id === productId);
  if (idx === -1) {
    return [];
  }

  return surroundingValues(products, idx, TOTAL_RELATIVE_PRODUCTS);
}

async function createRelatedProductsFile(
  productType: ProductType,
  request: UpdateRelatedProductsRequest,
) {
  const json = JSON.stringify(request);
  const path = productCalculationsPath(
    `${productType.toLowerCase()}-related.json`,
  );
  await fsPromises.writeFile(path, json, 'utf-8');
  return path;
}

async function uploadRelatedProductsFile(
  path: string,
  context: AutomationContext,
) {
  const data = new FormData();
  data.append('file', fs.createReadStream(path));
  console.log(`Uploading related products: ${path}`);
  await context.api.post(
    'automation/tasks/related-products',
    data,
    {},
    {
      headers: { 'content-type': 'multipart/form-data' },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    },
  );
  console.log(`Uploaded related products: ${path}`);
}
