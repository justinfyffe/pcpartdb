import {
  CreateImageRequest,
  Image,
  joinUrlParts,
  ListImagesQuery,
  ListImagesRequest,
  ListImagesResponse,
  UpdateImageRequest,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../shared/api/apiClient';
import { RequestConfig } from '../shared/api/types';
import { ImageCache } from '../shared/cache/ImageCache';

const PATH = 'images';

export class ImageService {
  constructor(private api: ApiClient) {}

  async list(query: ListImagesQuery, config?: RequestConfig) {
    const response = await this.api.get<ListImagesResponse>(PATH, {
      ...config,
      params: {
        req: JSON.stringify({ query } as ListImagesRequest),
      },
    });
    ImageCache.save(response.results);
    return response;
  }

  async create(formData: CreateImageRequest) {
    const data = new FormData();
    data.append('formData', JSON.stringify(formData));
    data.append('file', formData.file);

    const image = await this.api.post<Image>(PATH, data, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    ImageCache.save(image);
    return image;
  }

  async update(id: number, formData: UpdateImageRequest) {
    const data = new FormData();
    data.append('formData', JSON.stringify(formData));
    if (formData.file) {
      data.append('file', formData.file);
    }

    const path = joinUrlParts(PATH, String(id));
    const image = await this.api.put<Image>(path, data, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    ImageCache.save(image);
    return image;
  }

  async delete(id: number) {
    const path = joinUrlParts(PATH, String(id));
    await this.api.delete(path);
    ImageCache.delete(id);
  }
}

export const imageService = new ImageService(apiClient);
