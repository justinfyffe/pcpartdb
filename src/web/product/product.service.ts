import { denormalize } from 'normalizr';
import {
  Product,
  ProductRequest,
  ProductResponse,
  productSchema,
  ProductsResponse,
  ProductType,
} from '../../types/product';
import { ProductMetaKey } from '../../types/product-meta';
import { ProductSpecKey } from '../../types/product-spec';
import { ApiClient, apiClient } from '../shared/api/api-client';

const PATH = 'products';

export class ProductService {
  constructor(private api: ApiClient) {}

  async list(): Promise<Product[]> {
    const response = await this.api.get<ProductsResponse>(PATH);
    return denormalize(response.result, [productSchema], response.entities);
  }

  async get(idOrSlug: number | string): Promise<Product> {
    const response = await this.api.get<ProductResponse>(`${PATH}/${idOrSlug}`);
    return denormalize(response.result, productSchema, response.entities);
  }

  async create(data: ProductRequest): Promise<Product> {
    const response = await this.api.post<ProductResponse>(PATH, data);
    return denormalize(response.result, productSchema, response.entities);
  }

  async update(id: number, data: ProductRequest): Promise<Product> {
    const response = await this.api.put<ProductResponse>(`${PATH}/${id}`, data);
    return denormalize(response.result, productSchema, response.entities);
  }

  async delete(id: number) {
    await this.api.delete(`${PATH}/${id}`);
  }

  async autocompleteProduct(
    query: string,
    type: ProductType,
  ): Promise<Product[]> {
    const response = await this.api.get<ProductsResponse>(
      `${PATH}/autocomplete`,
      {
        params: { type, query },
      },
    );
    return (
      denormalize(response.result, [productSchema], response.entities) ?? []
    );
  }

  async autocompleteMeta(query: string, key?: ProductMetaKey) {
    return await this.api.get<string[]>(`${PATH}/meta/autocomplete`, {
      params: { key, value: query },
    });
  }

  async autocompleteSpec(query: string, key?: ProductSpecKey) {
    return await this.api.get<string[]>(`${PATH}/specs/autocomplete`, {
      params: { key, value: query },
    });
  }
}

export const productService = new ProductService(apiClient);
