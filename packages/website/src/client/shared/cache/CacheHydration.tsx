import Script from 'next/script';
import React, { FunctionComponent } from 'react';
import {
  ImageCacheState,
  ProductCacheState,
  useImageCache,
  useProductCache,
} from '.';

interface CacheState {
  images: ImageCacheState;
  products: ProductCacheState;
}

export const CacheHydration: FunctionComponent = () => {
  const imageCache = useImageCache();
  const productCache = useProductCache();

  if (typeof document !== 'undefined') {
    const el = document.getElementById('cache');
    if (el != null) {
      const state: CacheState = JSON.parse(el.textContent);
      imageCache.hydrate(state.images);
      productCache.hydrate(state.products);
    }

    return <React.Fragment />;
  } else {
    const state: CacheState = {
      images: imageCache.toObject(),
      products: productCache.toObject(),
    };
    return (
      <Script
        id="cache"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(state) }}
      />
    );
  }
};
