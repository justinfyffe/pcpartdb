import { Image, ImageRequest } from '../../types/image';
import { ApiClient, apiClient } from '../shared/api/api-client';

const PATH = 'images';

export class ImageService {
  constructor(private api: ApiClient) {}

  async list() {
    return await this.api.get<Image[]>(PATH);
  }

  async get(id: number) {
    return await this.api.get<Image>(`${PATH}/${id}`);
  }

  async create(formData: ImageRequest) {
    const data = new FormData();
    data.append('formData', JSON.stringify(formData));
    data.append('file', formData.file);

    return await this.api.post<Image>(`${PATH}`, data, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  }

  async update(id: number, formData: ImageRequest) {
    const data = new FormData();
    data.append('formData', JSON.stringify(formData));
    if (formData.file) {
      data.append('file', formData.file);
    }

    return await this.api.put<Image>(`${PATH}/${id}`, data, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  }

  async delete(id: number) {
    await this.api.delete(`${PATH}/${id}`);
  }
}

export const imageService = new ImageService(apiClient);
