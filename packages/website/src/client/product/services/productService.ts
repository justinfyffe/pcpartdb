import {
  AutocompleteProductsRequest,
  AutocompleteProductsResponse,
  CreateProductRequest,
  joinUrlParts,
  ListProductsRequest,
  ListProductsResponse,
  ListQuery,
  Product,
  ProductType,
  ScrapeProductRequest,
  ScrapeProductResponse,
  UpdateProductRequest,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api/apiClient';
import { ProductCache } from '../../shared/cache/ProductCache';

const PATH = 'products';

export class ProductService {
  constructor(private api: ApiClient) {}

  async list(productType: ProductType, query: ListQuery) {
    const response = await this.api.get<ListProductsResponse>(PATH, {
      params: {
        req: JSON.stringify({ productType, query } as ListProductsRequest),
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
}

export const productService = new ProductService(apiClient);
