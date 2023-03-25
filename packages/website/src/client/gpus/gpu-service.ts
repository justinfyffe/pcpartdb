import {
  CreateGpuRequest,
  Gpu,
  ImportGpusRequest,
  ListGpusRequest,
  ListGpusResponse,
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

  async create(data: CreateGpuRequest) {
    const gpu = await this.api.post<Gpu>(PATH, data);
    GpuCache.save(gpu);
    return gpu;
  }

  async update(id: number, data: UpdateGpuRequest) {
    const gpu = await this.api.put<Gpu>(`${PATH}/${id}`, data);
    GpuCache.save(gpu);
    return gpu;
  }

  async delete(id: number) {
    await this.api.delete(`${PATH}/${id}`);
    GpuCache.delete(id);
  }

  async autocomplete(query: string) {
    const gpus = await this.api.get<Gpu[]>(`${PATH}/autocomplete`, {
      params: { query },
    });
    GpuCache.save(gpus);
    return gpus;
  }

  async autocompleteSpec(query: string, key?: string) {
    return await this.api.get<string[]>(`${PATH}/specs/autocomplete`, {
      params: { key, value: query },
    });
  }

  async refreshRatings() {
    return await this.api.post(`${PATH}/refresh-ratings`, null);
  }

  async scrapeGpuDetails(data: ScrapeGpuDetailsRequest) {
    return await this.api.post<ScrapeGpuDetailsResponse>(
      `${PATH}/scrape-details`,
      data,
    );
  }

  async previewImportGpus(file: File) {
    const data = new FormData();
    data.append('file', file);

    const results = await this.api.post<PreviewImportGpusResponse>(
      `${PATH}/preview-import`,
      data,
      { headers: { 'content-type': 'multipart/form-data' } },
    );
    return results;
  }

  async importGpus(data: ImportGpusRequest) {
    return await this.api.post(`${PATH}/import`, data);
  }
}

export const gpuService = new GpuService(apiClient);
