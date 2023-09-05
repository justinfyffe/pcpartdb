import { createContext } from 'react';
import { ImageCache } from './ImageCache';
import { ProductCache } from './ProductCache';

interface CacheContextState {
  getProductCache: () => typeof ProductCache;
  getImageCache: () => typeof ImageCache;
}

export const CacheContext = createContext<CacheContextState>({
  getProductCache: () => ProductCache,
  getImageCache: () => ImageCache,
});
