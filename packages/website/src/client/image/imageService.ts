import {
  CreateImageRequest,
  Image,
  joinUrlParts,
  UpdateImageRequest,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../shared/api';
import { ImageCache } from '../shared/cache';

const PATH = 'images';

export class ImageService {
  constructor(private api: ApiClient) {}

  async list() {
    const images = await this.api.get<Image[]>(PATH);
    ImageCache.save(images);
    return images;
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
