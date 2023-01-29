import { CacheContext, ImageCache } from '@client/shared/cache';
import { Gpu } from '@shared/gpus';
import { Image } from '@shared/image';
import { useContext } from 'react';

class GpuCacheImpl {
  private cache = new Map<number, Gpu>();

  get(id: number) {
    return this.cache.get(id) ?? null;
  }

  save(...gpusToSave: (Gpu | Gpu[])[]) {
    gpusToSave.forEach((gpus) => {
      if (Array.isArray(gpus)) {
        gpus.forEach((gpu) => {
          this.cache.set(gpu.id, gpu);
          ImageCache.save(gpu.images || null);
        });
      } else {
        this.cache.set(gpus.id, gpus);
        ImageCache.save(gpus.images);
      }
    });
  }

  private saveImages(images: Image[]) {
    ImageCache.save(images);
  }

  delete(id: number) {
    this.cache.delete(id);
  }

  hydrate(gpus: Record<number, Gpu>) {
    this.save(Object.values(gpus));
  }

  toObject() {
    return Object.fromEntries(this.cache);
  }
}

export const GpuCache = new GpuCacheImpl();

export function useGpuCache(...gpus: (Gpu | Gpu[])[]) {
  const { gpuCache } = useContext(CacheContext);
  if (gpus.length > 0) {
    gpuCache.save(...gpus);
  }

  return gpuCache;
}
