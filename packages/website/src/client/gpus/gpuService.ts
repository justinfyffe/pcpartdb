import {
  CreateGpuRequest,
  Gpu,
  ImportGpusRequest,
  joinUrlParts,
  ListGpusRequest,
  ListGpusResponse,
  ListRetailModelsResponse,
  PreviewImportGpusResponse,
  ScrapeGpuDetailsRequest,
  ScrapeGpuDetailsResponse,
  UpdateGpuRequest,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../shared/api';
import { GpuCache } from '../shared/cache';

const PATH = 'gpus';

export class GpuService {
  constructor(private api: ApiClient) {}

  async list(data: ListGpusRequest) {
    const response = await this.api.get<ListGpusResponse>(PATH, {
      params: { q: JSON.stringify(data) },
    });
    GpuCache.save(response.gpus);
    return response;
  }

  async listRetailModels(chipsetId: number) {
    const path = joinUrlParts(PATH, String(chipsetId), 'retail-models');
    const response = await this.api.get<ListRetailModelsResponse>(path);
    GpuCache.save(response.retailModels);
    return response;
  }

  async create(data: CreateGpuRequest) {
    const gpu = await this.api.post<Gpu>(PATH, data);
    GpuCache.save(gpu);
    return gpu;
  }

  async update(id: number, data: UpdateGpuRequest) {
    const path = joinUrlParts(PATH, String(id));
    const gpu = await this.api.put<Gpu>(path, data);
    GpuCache.save(gpu);
    return gpu;
  }

  async delete(id: number) {
    const path = joinUrlParts(PATH, String(id));
    await this.api.delete(path);
    GpuCache.delete(id);
  }

  async autocomplete(query: string) {
    const path = joinUrlParts(PATH, 'autocomplete');
    const gpus = await this.api.get<Gpu[]>(path, {
      params: { query },
    });
    GpuCache.save(gpus);
    return gpus;
  }

  async autocompleteSpec(query: string, key?: string) {
    const path = joinUrlParts(PATH, 'autocomplete/specs');
    return await this.api.get<string[]>(path, {
      params: { key, value: query },
    });
  }

  async scrapeGpuDetails(data: ScrapeGpuDetailsRequest) {
    const path = joinUrlParts(PATH, 'import/scrape');
    return await this.api.post<ScrapeGpuDetailsResponse>(path, data);
  }

  async previewImportGpus(file: File) {
    const data = new FormData();
    data.append('file', file);

    const path = joinUrlParts(PATH, 'import/preview');
    const results = await this.api.post<PreviewImportGpusResponse>(path, data, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    return results;
  }

  async importGpus(data: ImportGpusRequest) {
    const path = joinUrlParts(PATH, 'import');
    return await this.api.post(path, data);
  }
}

export const gpuService = new GpuService(apiClient);
