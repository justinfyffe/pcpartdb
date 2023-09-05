import { Image } from '@pcpartdb/shared';
import { useContext } from 'react';
import { CacheContext } from './CacheContext';

export type ImageCacheState = Record<number, Image>;

class ImageCacheImpl {
  private cache: ImageCacheState = {};

  get(id: number) {
    return this.cache[id] ?? null;
  }

  save(...imagesToSave: (Image | Image[])[]) {
    imagesToSave.forEach((images) => {
      if (Array.isArray(images)) {
        images.forEach((image) => {
          this.cache[image.id] = image;
        });
        return;
      }

      this.cache[images.id] = images;
    });
  }

  delete(id: number) {
    delete this.cache[id];
  }

  hydrate(state: ImageCacheState) {
    this.save(Object.values(state));
  }

  toObject() {
    return this.cache;
  }
}

export const ImageCache = new ImageCacheImpl();

export function useImageCache(...images: (Image | Image[])[]) {
  const imageCache = useContext(CacheContext).getImageCache();
  if (images.length > 0) {
    imageCache.save(...images);
  }

  return imageCache;
}
