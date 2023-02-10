import { ApiClient, apiClient } from '@client/shared/api';
import { ImageCache } from '@client/shared/cache';
import { CreateImageRequest, Image, UpdateImageRequest } from '@shared/image';

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

    const image = await this.api.post<Image>(`${PATH}`, data, {
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

    const image = await this.api.put<Image>(`${PATH}/${id}`, data, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    ImageCache.save(image);
    return image;
  }

  async delete(id: number) {
    await this.api.delete(`${PATH}/${id}`);
    ImageCache.delete(id);
  }
}

export const imageService = new ImageService(apiClient);
