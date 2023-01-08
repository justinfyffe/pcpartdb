import { ApiClient, apiClient } from '@client/shared/api';
import { PartCache } from '@client/shared/cache';
import {
  ExportPartsRequest,
  ExportPartsResponse,
  ImportPartialPartRequest,
  ImportPartialPartResponse,
  ImportPartsResponse,
  ListPartsRequest,
  Part,
  PartRequest,
  PartType,
} from '@shared/part';
import { PartMetas } from '@shared/part-meta';
import { Specs } from '@shared/spec';

const PATH = 'parts';

export class PartService {
  constructor(private api: ApiClient) {}

  async list(data: ListPartsRequest) {
    const parts = await this.api.get<Part[]>(PATH, {
      params: { q: JSON.stringify(data) },
    });
    PartCache.save(parts);
    return parts;
  }

  async create(data: PartRequest) {
    const part = await this.api.post<Part>(PATH, data);
    PartCache.save(part);
    return part;
  }

  async update(id: number, data: PartRequest) {
    const part = await this.api.put<Part>(`${PATH}/${id}`, data);
    PartCache.save(part);
    return part;
  }

  async delete(id: number) {
    await this.api.delete(`${PATH}/${id}`);
    PartCache.delete(id);
  }

  async autocompletePart(query: string, type: PartType) {
    const parts = await this.api.get<Part[]>(`${PATH}/autocomplete`, {
      params: { type, query },
    });
    PartCache.save(parts);
    return parts;
  }

  async autocompleteMeta(query: string, key?: keyof PartMetas) {
    return await this.api.get<string[]>(`${PATH}/meta/autocomplete`, {
      params: { key, value: query },
    });
  }

  async autocompleteSpec(query: string, key?: keyof Specs) {
    return await this.api.get<string[]>(`${PATH}/specs/autocomplete`, {
      params: { key, value: query },
    });
  }

  async importPartialPart(data: ImportPartialPartRequest) {
    return await this.api.post<ImportPartialPartResponse>(
      `${PATH}/import`,
      data,
    );
  }

  async importParts(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return await this.api.post<ImportPartsResponse>(
      `${PATH}/import/file`,
      formData,
      {
        headers: { 'content-type': 'multipart/form-data' },
      },
    );
  }

  async export(data: ExportPartsRequest) {
    return await this.api.post<ExportPartsResponse>(`${PATH}/export`, data);
  }
}

export const partService = new PartService(apiClient);
