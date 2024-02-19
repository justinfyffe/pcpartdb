'use client';

import { Image, Product } from '@pcpartdb/shared';
import React, { createContext, useContext } from 'react';
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

export function useCache() {
  return useContext(CacheContext);
}

export interface CacheProviderProps {
  products?: Product | Product[];
  images?: Image | Image[];
  children: React.ReactNode;
}

export function CacheProvider(props: CacheProviderProps) {
  const { products, images } = props;

  if (products) {
    ProductCache.save(products);
  }

  if (images) {
    ImageCache.save(images);
  }

  return (
    <CacheContext.Provider
      value={{
        getProductCache: () => ProductCache,
        getImageCache: () => ImageCache,
      }}
    >
      {props.children}
    </CacheContext.Provider>
  );
}
