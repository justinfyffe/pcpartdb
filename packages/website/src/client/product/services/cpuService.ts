import {
  Cpu,
  CreateCpuRequest,
  ImportProductsRequest,
  joinUrlParts,
  ListCpusQuery,
  ListCpusResponse,
  PreviewImportProductsRequest,
  PreviewImportProductsResponse,
  ProductType,
  ScrapeProductRequest,
  ScrapeProductResponse,
  UpdateCpuRequest,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api';
import { ProductCache } from '../../shared/cache';

const PATH = 'products/cpus';

export class CpuService {
  constructor(private api: ApiClient) {}

  async list(query: ListCpusQuery) {
    const response = await this.api.get<ListCpusResponse>(PATH, {
      params: { q: JSON.stringify(query) },
    });
    ProductCache.save(ProductType.Cpu, response.cpus);
    return response;
  }

  async create(data: CreateCpuRequest) {
    const cpu = await this.api.post<Cpu>(PATH, data);
    ProductCache.save(ProductType.Cpu, cpu);
    return cpu;
  }

  async update(id: number, data: UpdateCpuRequest) {
    const path = joinUrlParts(PATH, String(id));
    const cpu = await this.api.put<Cpu>(path, data);
    ProductCache.save(ProductType.Cpu, cpu);
    return cpu;
  }

  async delete(id: number) {
    const path = joinUrlParts(PATH, String(id));
    await this.api.delete(path);
    ProductCache.delete(ProductType.Cpu, id);
  }

  async autocomplete(query: string) {
    const path = joinUrlParts(PATH, 'autocomplete');
    const cpus = await this.api.get<Cpu[]>(path, {
      params: { query },
    });
    ProductCache.save(ProductType.Cpu, cpus);
    return cpus;
  }

  async autocompleteField(query: string, key?: string) {
    const path = joinUrlParts(PATH, 'autocomplete/field');
    return await this.api.get<string[]>(path, {
      params: { key, value: query },
    });
  }

  async scrapeCpu(data: ScrapeProductRequest) {
    const path = joinUrlParts(PATH, 'scrape');
    return await this.api.post<ScrapeProductResponse>(path, data);
  }

  async previewImportCpus(data: PreviewImportProductsRequest) {
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

  async importCpus(data: ImportProductsRequest) {
    const path = joinUrlParts(PATH, 'bulk');
    return await this.api.post(path, data);
  }
}

export const cpuService = new CpuService(apiClient);
