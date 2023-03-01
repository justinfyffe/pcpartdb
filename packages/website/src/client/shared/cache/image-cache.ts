import { Image } from '@pcpartdb/website/shared/image';
import { useContext } from 'react';
import { CacheContext } from './cache-context';

class ImageCacheImpl {
  private cache = new Map<number, Image>();

  get(id: number) {
    return this.cache.get(id) ?? null;
  }

  save(...imagesToSave: (Image | Image[])[]) {
    imagesToSave.forEach((images) => {
      if (Array.isArray(images)) {
        images.forEach((image) => {
          this.cache.set(image.id, image);
        });
        return;
      }

      this.cache.set(images.id, images);
    });
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

export function useImageCache(...images: (Image | Image[])[]) {
  const { imageCache } = useContext(CacheContext);
  if (images.length > 0) {
    imageCache.save(...images);
  }

  return imageCache;
}
