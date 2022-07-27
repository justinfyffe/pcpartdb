import { denormalize } from 'normalizr';
import {
  ProductFormData,
  ProductResponse,
  productSchema,
  ProductsResponse,
} from '../../types/product';
import { ApiClient, apiClient } from '../shared/api/api-client';

const PATH = 'products';

export class UserService {
  constructor(private api: ApiClient) {}

  async list() {
    const response = await this.api.get<ProductsResponse>(PATH);
    return denormalize(response.result, [productSchema], response.entities);
  }

  async get(id: number) {
    const response = await this.api.get<ProductResponse>(`${PATH}/${id}`);
    return denormalize(response.result, productSchema, response.entities);
  }

  async create(data: ProductFormData) {
    const response = await this.api.post<ProductResponse>(PATH, data);
    return denormalize(response.result, productSchema, response.entities);
  }

  async update(id: number, data: ProductFormData) {
    const response = await this.api.put<ProductResponse>(`${PATH}/${id}`, data);
    return denormalize(response.result, productSchema, response.entities);
  }

  async delete(id: number) {
    await this.api.delete(`${PATH}/${id}`);
  }
}

export const productService = new UserService(apiClient);
