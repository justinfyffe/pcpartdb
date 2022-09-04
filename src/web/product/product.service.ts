import { denormalize } from 'normalizr';
import {
  Product,
  ProductRequest,
  ProductResponse,
  productSchema,
  ProductsResponse,
  ProductType,
} from '../../types/product';
import {
  ProductMeta,
  ProductMetaKey,
  ProductMetaResponse,
  productMetaSchema,
} from '../../types/product-meta';
import {
  ProductSpec,
  ProductSpecKey,
  productSpecSchema,
  ProductSpecsResponse,
} from '../../types/product-spec';
import { ApiClient, apiClient } from '../shared/api/api-client';

const PATH = 'products';

export class ProductService {
  constructor(private api: ApiClient) {}

  async list() {
    const response = await this.api.get<ProductsResponse>(PATH);
    return denormalize(response.result, [productSchema], response.entities);
  }

  async get(id: number) {
    const response = await this.api.get<ProductResponse>(`${PATH}/${id}`);
    return denormalize(response.result, productSchema, response.entities);
  }

  async create(data: ProductRequest) {
    const response = await this.api.post<ProductResponse>(PATH, data);
    return denormalize(response.result, productSchema, response.entities);
  }

  async update(id: number, data: ProductRequest) {
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
        params: { type, value: query },
      },
    );
    return (
      denormalize(response.result, [productSchema], response.entities) ?? []
    );
  }

  async autocompleteMeta(
    query: string,
    key?: ProductMetaKey,
  ): Promise<ProductMeta[]> {
    const response = await this.api.get<ProductMetaResponse>(
      `${PATH}/meta/autocomplete`,
      {
        params: { key, value: query },
      },
    );
    return (
      denormalize(response.result, [productMetaSchema], response.entities) ?? []
    );
  }

  async autocompleteSpec(
    query: string,
    key?: ProductSpecKey,
  ): Promise<ProductSpec[]> {
    const response = await this.api.get<ProductSpecsResponse>(
      `${PATH}/specs/autocomplete`,
      {
        params: { key, value: query },
      },
    );
    return (
      denormalize(response.result, [productSpecSchema], response.entities) ?? []
    );
  }
}

export const productService = new ProductService(apiClient);
