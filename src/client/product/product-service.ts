import { ApiClient, apiClient } from '@client/shared/api';
import { ProductCache } from '@client/shared/cache';
import { Product, ProductRequest, ProductType } from '@shared/product';
import { ProductMetaKey } from '@shared/product-meta';
import { ProductSpecKey } from '@shared/product-spec';

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

  async getComparison(idsOrSlugs: number | string) {
    const products = await this.api.get<Product[]>(
      `${PATH}/comparison/${idsOrSlugs}`,
    );
    ProductCache.save(products);
    return products;
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
