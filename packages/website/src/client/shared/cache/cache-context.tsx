import { createContext } from 'react';
import { GpuCache } from './gpu-cache';
import { ImageCache } from './image-cache';

interface CacheContextState {
  gpuCache: typeof GpuCache;
  imageCache: typeof ImageCache;
}

export const CacheContext = createContext<CacheContextState>({
  gpuCache: GpuCache,
  imageCache: ImageCache,
});
