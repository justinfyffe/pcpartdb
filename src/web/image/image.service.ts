import { denormalize } from 'normalizr';
import {
  ImageRequest,
  ImageResponse,
  imageSchema,
  ImagesResponse,
} from '../../types/image';
import { ApiClient, apiClient } from '../shared/api/api-client';

const PATH = 'images';

export class ImageService {
  constructor(private api: ApiClient) {}

  async list() {
    const response = await this.api.get<ImagesResponse>(PATH);
    return denormalize(response.result, [imageSchema], response.entities);
  }

  async get(id: number) {
    const response = await this.api.get<ImageResponse>(`${PATH}/${id}`);
    return denormalize(response.result, imageSchema, response.entities);
  }

  async create(formData: ImageRequest) {
    const data = new FormData();
    data.append('formData', JSON.stringify(formData));
    data.append('file', formData.file);

    const response = await this.api.post<ImageResponse>(`${PATH}`, data, {
      headers: { 'content-type': 'multipart/form-data' },
    });

    return denormalize(response.result, imageSchema, response.entities);
  }

  async update(id: number, formData: ImageRequest) {
    const data = new FormData();
    data.append('formData', JSON.stringify(formData));
    if (formData.file) {
      data.append('file', formData.file);
    }

    const response = await this.api.put<ImageResponse>(`${PATH}/${id}`, data, {
      headers: { 'content-type': 'multipart/form-data' },
    });

    return denormalize(response.result, imageSchema, response.entities);
  }

  async delete(id: number) {
    await this.api.delete(`${PATH}/${id}`);
  }
}

export const imageService = new ImageService(apiClient);
