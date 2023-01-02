import { createContext } from 'react';
import { ImageCache } from './image-cache';
import { PartCache } from './part-cache';

interface CacheContextState {
  partCache: typeof PartCache;
  imageCache: typeof ImageCache;
}

export const CacheContext = createContext<CacheContextState>({
  partCache: PartCache,
  imageCache: ImageCache,
});
