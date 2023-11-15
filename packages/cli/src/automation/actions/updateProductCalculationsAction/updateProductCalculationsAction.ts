import {
  AutomationAction,
  ListProductsFilter,
  ListProductsRequest,
  ListProductsResponse,
  ProductCalculationsRequest,
  ProductType,
  RelatedProductType,
} from '@pcpartdb/shared';
import FormData from 'form-data';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { AutomationContext } from '../../types';
import { productCalculationsPath } from '../../utils/product-calculations';
import { populateRanks } from './populateRanks';
import { populateRelatedProducts } from './populateRelatedProducts';
import { populateScores } from './populateScores';
import { ProductCalculations } from './types';

/**
 * Filters for fetching products we want to run computations on.
 */
const LIST_FILTERS: Partial<Record<ProductType, ListProductsFilter>> = {
  [ProductType.Cpu]: {},
  [ProductType.Gpu]: { isChipset: true },
};

export async function updateProductCalculationsAction(
  _action: AutomationAction,
  context: AutomationContext,
) {
  await updateProductCalculations(ProductType.Cpu, context);
  await updateProductCalculations(ProductType.Gpu, context);

  // Reset cache
  await context.api.delete('website/cache');

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updateProductCalculationsDate: new Date().getTime(),
  };
}

async function updateProductCalculations(
  productType: ProductType,
  context: AutomationContext,
) {
  const products = await fetchProducts(productType, context);

  // Empty set of calculations for all products.
  const calculations: Record<number, ProductCalculations> = products.reduce(
    (acc, product) => ({
      ...acc,
      [product.id]: {
        product,
        scores: {},
        ranks: {},
        related: {},
      } as ProductCalculations,
    }),
    {},
  );

  // Populate Scores
  populateScores({ productType, calculations });

  // Calculate Ranks
  populateRanks({ productType, calculations });

  // Determine Related Products
  populateRelatedProducts({
    type: RelatedProductType.PerformanceRating,
    calculations,
  });
  populateRelatedProducts({
    type: RelatedProductType.PerformancePerMsrp,
    calculations,
  });

  // Create and upload calculations file
  const path = await createCalculationsFile(
    productType,
    Object.values(calculations),
  );
  await uploadCalculationsFile(productType, path, context);
}

async function fetchProducts(
  productType: ProductType,
  context: AutomationContext,
) {
  const filter = LIST_FILTERS[productType];
  const request: ListProductsRequest = { productType, query: { filter } };
  const response = await context.api.get<ListProductsResponse>(
    'products/all',
    {},
    { params: { req: JSON.stringify(request) } },
  );
  return response.results;
}

async function createCalculationsFile(
  productType: ProductType,
  calculations: ProductCalculations[],
) {
  const requests: ProductCalculationsRequest[] = calculations.map((c) => ({
    productId: c.product.id,
    name: c.product.name,
    scores: c.scores,
    ranks: c.ranks,
    related: c.related,
  }));
  const json = JSON.stringify(requests, undefined, 2);
  const path = productCalculationsPath(
    `${productType.toLowerCase()}-calculations.json`,
  );
  await fsPromises.writeFile(path, json, 'utf-8');
  return path;
}

async function uploadCalculationsFile(
  productType: ProductType,
  path: string,
  context: AutomationContext,
) {
  const data = new FormData();
  data.append('productType', productType);
  data.append('file', fs.createReadStream(path));
  console.log(`Uploading calculations: ${path}`);
  await context.api.post(
    'automation/tasks/product-calculations',
    data,
    {},
    {
      headers: { 'content-type': 'multipart/form-data' },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    },
  );
  console.log(`Uploaded calculations: ${path}`);
}
