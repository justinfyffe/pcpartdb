import { ApiClient, apiClient } from '@client/shared/api';
import { ProductCache } from '@client/shared/cache';
import {
  ImportProductRequest,
  ImportProductResults,
  Product,
  ProductRequest,
  ProductType,
} from '@shared/product';
import { ProductMetas } from '@shared/product-meta';
import { Specs } from '@shared/spec';

const PATH = 'products';

export class ProductService {
  constructor(private api: ApiClient) {}

  async list(type: ProductType) {
    const products = await this.api.get<Product[]>(PATH, { params: { type } });
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

  async autocompleteMeta(query: string, key?: keyof ProductMetas) {
    return await this.api.get<string[]>(`${PATH}/meta/autocomplete`, {
      params: { key, value: query },
    });
  }

  async autocompleteSpec(query: string, key?: keyof Specs) {
    return await this.api.get<string[]>(`${PATH}/specs/autocomplete`, {
      params: { key, value: query },
    });
  }

  async import(data: ImportProductRequest) {
    return await this.api.post<ImportProductResults>(`${PATH}/import`, data);
  }
}

export const productService = new ProductService(apiClient);
