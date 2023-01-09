import { CacheContext, ImageCache } from '@client/shared/cache';
import { Part } from '@shared/part';
import { PartImage } from '@shared/part-image';
import { useContext } from 'react';

class PartCacheImpl {
  private cache = new Map<number, Part>();

  get(id: number) {
    return this.cache.get(id) ?? null;
  }

  save(...partsToSave: (Part | Part[])[]) {
    partsToSave.forEach((parts) => {
      if (Array.isArray(parts)) {
        parts.forEach((part) => {
          this.cache.set(part.id, part);
          this.saveImages(part.images || null);
        });
      } else {
        this.cache.set(parts.id, parts);
        this.saveImages(parts.images);
      }
    });
  }

  private saveImages(partImages: PartImage[]) {
    const images = [...(partImages ?? [])]
      .filter((partImage) => partImage?.image != null)
      .map((partImage) => partImage.image!);

    ImageCache.save(images);
  }

  delete(id: number) {
    this.cache.delete(id);
  }

  hydrate(parts: Record<number, Part>) {
    this.save(Object.values(parts));
  }

  toObject() {
    return Object.fromEntries(this.cache);
  }
}

export const PartCache = new PartCacheImpl();

export function usePartCache(...parts: (Part | Part[])[]) {
  const { partCache } = useContext(CacheContext);
  if (parts.length > 0) {
    partCache.save(...parts);
  }

  return partCache;
}
