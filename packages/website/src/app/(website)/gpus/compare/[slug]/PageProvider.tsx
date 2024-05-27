'use client';

import { CompareGpusViewModel, ProductType } from '@pcpartdb/shared';
import { useSearchParams } from 'next/navigation';
import { CacheProvider } from 'packages/website/src/app/_common/cache/CacheProvider';
import { SectionHeaderProvider } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeaderProvider';
import { TableOfContentsLink } from 'packages/website/src/app/_common/components/TableOfContents/TableOfContents';
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
  tableOfContents: TableOfContentsLink[];
  children: React.ReactNode;
}

export function PageProvider(props: PageProviderProps) {
  const { viewModel, tableOfContents } = props;
  const searchParams = useSearchParams();

  const [gpu1, gpu2] = viewModel.comparison;

  const initialGame = useMemo(() => {
    const gameSlug = searchParams.get('game');
    if (!gameSlug) {
      return [gpu1?.games?.[0] ?? null, gpu2?.games?.[0] ?? null].sort(
        (g1, g2) =>
          (g2?.game?.releaseDate ?? '').localeCompare(
            g1?.game?.releaseDate ?? '',
          ),
      )[0];
    }

    return (
      gpu1?.games?.find((pg) => pg.game?.slug === gameSlug) ??
      gpu2?.games?.find((pg) => pg.game?.slug === gameSlug)
    );
    // Only want this to run on the first pass-through.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContext.Provider value={{ viewModel: viewModel }}>
      <SectionHeaderProvider links={tableOfContents}>
        <CacheProvider products={viewModel.comparison}>
          <ViewModelProvider
            type={ViewModelType.CompareGpusViewModel}
            viewModel={viewModel}
          >
            <GameSelectionProvider
              products={[gpu1, gpu2]}
              game={initialGame?.game}
            >
              <RelativeDataProductsProvider
                productType={ProductType.Gpu}
                productIds={[gpu1.id, gpu2.id]}
                relativeDataProducts={viewModel.relativeDataProducts}
              >
                {props.children}
              </RelativeDataProductsProvider>
            </GameSelectionProvider>
          </ViewModelProvider>
        </CacheProvider>
      </SectionHeaderProvider>
    </PageContext.Provider>
  );
}
