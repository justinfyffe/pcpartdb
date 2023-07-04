import {
  CreateGpuRequest,
  Gpu,
  ImportProductsRequest,
  joinUrlParts,
  ListGpusQuery,
  ListGpusResponse,
  ListRetailModelsResponse,
  PreviewImportProductsRequest,
  PreviewImportProductsResponse,
  ProductType,
  ScrapeProductRequest,
  ScrapeProductResponse,
  UpdateGpuRequest,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api';
import { ProductCache } from '../../shared/cache';

const PATH = 'products/gpus';

export class GpuService {
  constructor(private api: ApiClient) {}

  async list(query: ListGpusQuery) {
    const response = await this.api.get<ListGpusResponse>(PATH, {
      params: { q: JSON.stringify(query) },
    });
    ProductCache.save(ProductType.Gpu, response.gpus);
    return response;
  }

  async listRetailModels(chipsetId: number) {
    const path = joinUrlParts(PATH, String(chipsetId), 'retail-models');
    const response = await this.api.get<ListRetailModelsResponse>(path);
    ProductCache.save(ProductType.Gpu, response.retailModels);
    return response;
  }

  async create(data: CreateGpuRequest) {
    const gpu = await this.api.post<Gpu>(PATH, data);
    ProductCache.save(ProductType.Gpu, gpu);
    return gpu;
  }

  async update(id: number, data: UpdateGpuRequest) {
    const path = joinUrlParts(PATH, String(id));
    const gpu = await this.api.put<Gpu>(path, data);
    ProductCache.save(ProductType.Gpu, gpu);
    return gpu;
  }

  async delete(id: number) {
    const path = joinUrlParts(PATH, String(id));
    await this.api.delete(path);
    ProductCache.delete(ProductType.Gpu, id);
  }

  async autocomplete(query: string) {
    const path = joinUrlParts(PATH, 'autocomplete');
    const gpus = await this.api.get<Gpu[]>(path, {
      params: { query },
    });
    ProductCache.save(ProductType.Gpu, gpus);
    return gpus;
  }

  async autocompleteSpec(query: string, key?: string) {
    const path = joinUrlParts(PATH, 'autocomplete/specs');
    return await this.api.get<string[]>(path, {
      params: { key, value: query },
    });
  }

  async scrapeGpu(data: ScrapeProductRequest) {
    const path = joinUrlParts(PATH, 'scrape');
    return await this.api.post<ScrapeProductResponse>(path, data);
  }

  async previewImportGpus(data: PreviewImportProductsRequest) {
    const formData = new FormData();
    formData.append('file', data.file);

    const path = joinUrlParts(PATH, 'bulk/preview');
    const results = await this.api.post<PreviewImportProductsResponse>(
      path,
      formData,
      {
        headers: { 'content-type': 'multipart/form-data' },
      },
    );
    return results;
  }

  async importGpus(data: ImportProductsRequest) {
    const path = joinUrlParts(PATH, 'bulk');
    return await this.api.post(path, data);
  }
}

export const gpuService = new GpuService(apiClient);
