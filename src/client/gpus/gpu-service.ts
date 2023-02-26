import { ApiClient, apiClient } from '@client/shared/api';
import { GpuCache } from '@client/shared/cache';
import {
  CreateGpuRequest,
  Gpu,
  ImportGpuDataRequest,
  ImportGpuDataResponse,
  ListGpusRequest,
  UpdateGpuRequest,
} from '@shared/gpus';

const PATH = 'gpus';

export class GpuService {
  constructor(private api: ApiClient) {}

  async list(data: ListGpusRequest) {
    const gpus = await this.api.get<Gpu[]>(PATH, {
      params: { q: JSON.stringify(data) },
    });
    GpuCache.save(gpus);
    return gpus;
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

  async importGpuData(data: ImportGpuDataRequest) {
    return await this.api.post<ImportGpuDataResponse>(`${PATH}/import`, data);
  }
}

export const gpuService = new GpuService(apiClient);
