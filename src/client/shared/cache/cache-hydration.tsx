import { useImageCache, usePartCache } from '@client/shared/cache';
import { Image } from '@shared/image';
import { Part } from '@shared/part';
import Head from 'next/head';
import React, { FunctionComponent } from 'react';

interface CacheState {
  images: Record<number, Image>;
  parts: Record<number, Part>;
}

export const CacheHydration: FunctionComponent = () => {
  const partCache = usePartCache();
  const imageCache = useImageCache();

  if (typeof document !== 'undefined') {
    const el = document.getElementById('cache');
    if (el != null) {
      const state: CacheState = JSON.parse(el.textContent);
      imageCache.hydrate(state.images);
      partCache.hydrate(state.parts);
    }

    return <React.Fragment />;
  } else {
    const state: CacheState = {
      images: imageCache.toObject(),
      parts: partCache.toObject(),
    };
    return (
      <Head>
        <script
          id="cache"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(state) }}
        />
      </Head>
    );
  }
};
