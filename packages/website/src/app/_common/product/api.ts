import {
  AutocompleteProductsRequest,
  AutocompleteProductsResponse,
  joinUrlParts,
  ListProductsQuery,
  ListProductsRequest,
  ListProductsResponse,
  Product,
  ProductType,
} from '@pcpartdb/shared';
import { apiClient } from '../api/ApiClient';
import { ProductCache } from '../cache/ProductCache';

const PATH = 'products';

export async function autocompleteProducts(
  productType: ProductType,
  query: string,
): Promise<Product[]> {
  const path = joinUrlParts(
    PATH,
    'autocomplete',
    `?${new URLSearchParams({
      req: JSON.stringify({
        productType,
        query,
      } as AutocompleteProductsRequest),
    })}`,
  );
  const response = await apiClient.get<AutocompleteProductsResponse>(path);

  const products = response.results;
  ProductCache.save(products);
  return products;
}

export async function listProducts(
  query: ListProductsQuery,
  config?: RequestInit,
) {
  const productType = query.filter?.productType;
  if (productType == null) {
    throw new Error('Missing product type for list');
  }

  const path = joinUrlParts(
    PATH,
    `?${new URLSearchParams({
      req: JSON.stringify({ query } as ListProductsRequest),
    })}`,
  );
  const response = await apiClient.get<ListProductsResponse>(path, {
    ...config,
  });
  ProductCache.save(response.results);
  return response;
}
