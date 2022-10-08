import { Image } from '@shared/image';

class ImageCacheImpl {
  private cache = new Map<number, Image>();

  get(id: number) {
    return this.cache.get(id) ?? null;
  }

  save(images: Image | Image[]) {
    if (Array.isArray(images)) {
      images.forEach((image) => {
        this.cache.set(image.id, image);
      });
      return;
    }

    this.cache.set(images.id, images);
  }

  delete(id: number) {
    this.cache.delete(id);
  }

  hydrate(images: Record<number, Image>) {
    this.save(Object.values(images));
  }

  toObject() {
    return Object.fromEntries(this.cache);
  }
}

export const ImageCache = new ImageCacheImpl();
