'use client';

import { getGpuChipset, ProductType, ViewGpuViewModel } from '@pcpartdb/shared';
import { useSearchParams } from 'next/navigation';
import { CacheProvider } from 'packages/website/src/app/_common/cache/CacheProvider';
import { ViewModelType } from 'packages/website/src/app/_common/contexts/types';
import { ViewModelProvider } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { GameSelectionProvider } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { RelativeDataProductsProvider } from 'packages/website/src/app/_common/product/contexts/RelativeDataProductsProvider';
import React, { createContext, useContext, useMemo } from 'react';

export interface PageContextState {
  viewModel: ViewGpuViewModel;
}

export const PageContext = createContext<PageContextState>({
  viewModel: null,
});

export function usePageContext() {
  return useContext(PageContext);
}

export interface PageProviderProps {
  viewModel: ViewGpuViewModel;
  children: React.ReactNode;
}

export function PageProvider(props: PageProviderProps) {
  const { viewModel } = props;
  const searchParams = useSearchParams();

  const { gpu } = viewModel;
  const chipset = getGpuChipset(gpu);

  const initialGame = useMemo(() => {
    const gameSlug = searchParams.get('game');
    if (!gameSlug) {
      return chipset?.games?.[0];
    }

    return chipset?.games?.find((pg) => pg.game?.slug === gameSlug);
    // Only want this to run on the first pass-through.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContext.Provider value={{ viewModel: viewModel }}>
      <CacheProvider
        products={[gpu, chipset]}
        productGames={[...(chipset?.games ?? [])]}
      >
        <ViewModelProvider
          type={ViewModelType.ViewGpuViewModel}
          viewModel={viewModel}
        >
          <GameSelectionProvider products={[chipset]} game={initialGame?.game}>
            <RelativeDataProductsProvider
              productType={ProductType.Gpu}
              productIds={[chipset.id]}
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
