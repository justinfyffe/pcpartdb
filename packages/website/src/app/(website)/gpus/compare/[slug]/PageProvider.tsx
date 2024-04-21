'use client';

import {
  CompareGpusViewModel,
  getGpuChipset,
  ProductType,
} from '@pcpartdb/shared';
import { useSearchParams } from 'next/navigation';
import { CacheProvider } from 'packages/website/src/app/_common/cache/CacheProvider';
import { ViewModelType } from 'packages/website/src/app/_common/contexts/types';
import { ViewModelProvider } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { GameSelectionProvider } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { RelativeDataProductsProvider } from 'packages/website/src/app/_common/product/contexts/RelativeDataProductsProvider';
import React, { createContext, useContext, useMemo } from 'react';

export interface PageContextState {
  viewModel: CompareGpusViewModel;
}

export const PageContext = createContext<PageContextState>({
  viewModel: null,
});

export function usePageContext() {
  return useContext(PageContext);
}

export interface PageProviderProps {
  viewModel: CompareGpusViewModel;
  children: React.ReactNode;
}

export function PageProvider(props: PageProviderProps) {
  const { viewModel } = props;
  const searchParams = useSearchParams();

  const [gpu1, gpu2] = viewModel.comparison;
  const [chipset1, chipset2] = [getGpuChipset(gpu1), getGpuChipset(gpu2)];

  const initialGame = useMemo(() => {
    const gameSlug = searchParams.get('game');
    if (!gameSlug) {
      return [chipset1?.games?.[0] ?? null, chipset2?.games?.[0] ?? null].sort(
        (g1, g2) =>
          (g2?.game?.releaseDate ?? '').localeCompare(
            g1?.game?.releaseDate ?? '',
          ),
      )[0];
    }

    return (
      chipset1?.games?.find((pg) => pg.game?.slug === gameSlug) ??
      chipset2?.games?.find((pg) => pg.game?.slug === gameSlug)
    );
    // Only want this to run on the first pass-through.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContext.Provider value={{ viewModel: viewModel }}>
      <CacheProvider products={viewModel.comparison}>
        <ViewModelProvider
          type={ViewModelType.CompareGpusViewModel}
          viewModel={viewModel}
        >
          <GameSelectionProvider
            products={[chipset1, chipset2]}
            game={initialGame?.game}
          >
            <RelativeDataProductsProvider
              productType={ProductType.Gpu}
              productIds={[chipset1.id, chipset2.id]}
              relativeDataProducts={viewModel.relativeDataProducts}
            >
              {props.children}
            </RelativeDataProductsProvider>
          </GameSelectionProvider>
        </ViewModelProvider>
      </CacheProvider>
    </PageContext.Provider>
  );
}
