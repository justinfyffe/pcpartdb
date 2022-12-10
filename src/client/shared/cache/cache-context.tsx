import { createContext } from 'react';
import { ImageCache } from './image-cache';
import { ProductCache } from './product-cache';

interface CacheContextState {
  productCache: typeof ProductCache;
  imageCache: typeof ImageCache;
}

export const CacheContext = createContext<CacheContextState>({
  productCache: ProductCache,
  imageCache: ImageCache,
});
