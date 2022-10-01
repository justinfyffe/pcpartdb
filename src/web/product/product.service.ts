import { Product, ProductRequest, ProductType } from '../../types/product';
import { ProductMetaKey } from '../../types/product-meta';
import { ProductSpecKey } from '../../types/product-spec';
import { ApiClient, apiClient } from '../shared/api/api-client';
import { ProductCache } from '../shared/cache';

const PATH = 'products';

export class ProductService {
  constructor(private api: ApiClient) {}

  async list() {
    const products = await this.api.get<Product[]>(PATH);
    ProductCache.save(products);
    return products;
  }

  async get(idOrSlug: number | string) {
    const product = await this.api.get<Product>(`${PATH}/${idOrSlug}`);
    ProductCache.save(product);
    return product;
  }

  async create(data: ProductRequest) {
    const product = await this.api.post<Product>(PATH, data);
    ProductCache.save(product);
    return product;
  }

  async update(id: number, data: ProductRequest) {
    const product = await this.api.put<Product>(`${PATH}/${id}`, data);
    ProductCache.save(product);
    return product;
  }

  async delete(id: number) {
    await this.api.delete(`${PATH}/${id}`);
    ProductCache.delete(id);
  }

  async autocompleteProduct(query: string, type: ProductType) {
    const products = await this.api.get<Product[]>(`${PATH}/autocomplete`, {
      params: { type, query },
    });
    ProductCache.save(products);
    return products;
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
