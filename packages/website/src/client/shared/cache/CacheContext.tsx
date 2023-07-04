import { createContext } from 'react';
import { ImageCache } from './ImageCache';
import { ProductCache } from './ProductCache';

interface CacheContextState {
  productCache: typeof ProductCache;
  imageCache: typeof ImageCache;
}

export const CacheContext = createContext<CacheContextState>({
  productCache: ProductCache,
  imageCache: ImageCache,
});
