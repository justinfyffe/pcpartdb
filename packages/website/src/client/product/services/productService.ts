import {
  AutocompleteProductsRequest,
  AutocompleteProductsResponse,
  CreateProductRequest,
  GetRelativeDataProductsRequest,
  joinUrlParts,
  ListProductsQuery,
  ListProductsRequest,
  ListProductsResponse,
  NormalizedData,
  Product,
  ProductType,
  RelativeDataProducts,
  relativeDataProductsNormalizr,
  ScrapeProductRequest,
  ScrapeProductResponse,
  UpdateProductRequest,
} from '@pcpartdb/shared';
import { denormalize } from 'normalizr';
import { ApiClient, apiClient } from '../../shared/api/apiClient';
import { RequestConfig } from '../../shared/api/types';
import { ProductCache } from '../../shared/cache/ProductCache';

const PATH = 'products';

export class ProductService {
  constructor(private api: ApiClient) {}

  async list(query: ListProductsQuery, config?: RequestConfig) {
    const productType = query.filter?.productType;
    if (productType == null) {
      throw new Error('Missing product type for list');
    }

    const response = await this.api.get<ListProductsResponse>(PATH, {
      ...config,
      params: {
        req: JSON.stringify({ query } as ListProductsRequest),
      },
    });
    ProductCache.save(productType, response.results);
    return response;
  }

  async create(productType: ProductType, data: CreateProductRequest) {
    const product = await this.api.post<Product>(PATH, data);
    ProductCache.save(productType, product);
    return product;
  }

  async update(
    productType: ProductType,
    id: number,
    data: UpdateProductRequest,
  ) {
    const path = joinUrlParts(PATH, String(id));
    const product = await this.api.put<Product>(path, data);
    ProductCache.save(productType, product);
    return product;
  }

  async delete(id: number) {
    const path = joinUrlParts(PATH, String(id));
    const product = await this.api.delete(path);
    ProductCache.delete(ProductType.Gpu, id);
    return product;
  }

  async autocomplete(
    productType: ProductType,
    query: string,
  ): Promise<Product[]> {
    const path = joinUrlParts(PATH, 'autocomplete');
    const response = await this.api.get<AutocompleteProductsResponse>(path, {
      params: {
        req: JSON.stringify({
          productType,
          query,
        } as AutocompleteProductsRequest),
      },
    });

    const products = response.results;
    ProductCache.save(productType, products);
    return products;
  }

  async scrape(request: ScrapeProductRequest) {
    const path = joinUrlParts(PATH, 'scrape');
    return await this.api.post<ScrapeProductResponse>(path, request);
  }

  async getRelativeDataProducts(request: GetRelativeDataProductsRequest) {
    const path = joinUrlParts(PATH, 'relative');
    const response = await this.api.post<NormalizedData>(path, request);
    const denormalized: RelativeDataProducts = denormalize(
      response.result,
      relativeDataProductsNormalizr,
      response.entities,
    );

    Object.values(denormalized).forEach((productList) => {
      if (Array.isArray(productList) && productList.length > 0) {
        const products = productList as Partial<Product>[];
        ProductCache.save(products[0].productType, products);
      }
    });

    return denormalized;
  }
}

export const productService = new ProductService(apiClient);
