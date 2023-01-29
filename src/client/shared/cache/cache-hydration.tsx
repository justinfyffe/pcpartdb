import { useGpuCache, useImageCache } from '@client/shared/cache';
import { Gpu } from '@shared/gpus';
import { Image } from '@shared/image';
import Script from 'next/script';
import React, { FunctionComponent } from 'react';

interface CacheState {
  images: Record<number, Image>;
  gpus: Record<number, Gpu>;
}

export const CacheHydration: FunctionComponent = () => {
  const gpuCache = useGpuCache();
  const imageCache = useImageCache();

  if (typeof document !== 'undefined') {
    const el = document.getElementById('cache');
    if (el != null) {
      const state: CacheState = JSON.parse(el.textContent);
      imageCache.hydrate(state.images);
      gpuCache.hydrate(state.gpus);
    }

    return <React.Fragment />;
  } else {
    const state: CacheState = {
      images: imageCache.toObject(),
      gpus: gpuCache.toObject(),
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
