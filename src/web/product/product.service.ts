import { Product, ProductType } from '../../types/product';
import { ProductMetaKey } from '../../types/product-meta';
import { ProductSpecKey } from '../../types/product-spec';
import { ApiClient, apiClient } from '../shared/api/api-client';

const PATH = 'products';

export class ProductService {
  constructor(private api: ApiClient) {}

  async list(): Promise<Product[]> {
    return await this.api.get<Product[]>(PATH);
  }

  async get(idOrSlug: number | string): Promise<Product> {
    return await this.api.get<Product>(`${PATH}/${idOrSlug}`);
  }

  async create(data: Product): Promise<Product> {
    return await this.api.post<Product>(PATH, data);
  }

  async update(id: number, data: Product): Promise<Product> {
    return await this.api.put<Product>(`${PATH}/${id}`, data);
  }

  async delete(id: number) {
    await this.api.delete(`${PATH}/${id}`);
  }

  async autocompleteProduct(
    query: string,
    type: ProductType,
  ): Promise<Product[]> {
    return await this.api.get<Product[]>(`${PATH}/autocomplete`, {
      params: { type, query },
    });
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
