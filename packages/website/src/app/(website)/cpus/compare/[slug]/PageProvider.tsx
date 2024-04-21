'use client';

import { CompareCpusViewModel, ProductType } from '@pcpartdb/shared';
import { CacheProvider } from 'packages/website/src/app/_common/cache/CacheProvider';
import { ViewModelType } from 'packages/website/src/app/_common/contexts/types';
import { ViewModelProvider } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { RelativeDataProductsProvider } from 'packages/website/src/app/_common/product/contexts/RelativeDataProductsProvider';
import React, { createContext, useContext } from 'react';

export interface PageContextState {
  viewModel: CompareCpusViewModel;
}

export const PageContext = createContext<PageContextState>({
  viewModel: null,
});

export function usePageContext() {
  return useContext(PageContext);
}

export interface PageProviderProps {
  viewModel: CompareCpusViewModel;
  children: React.ReactNode;
}

export function PageProvider(props: PageProviderProps) {
  const { viewModel } = props;

  const [cpu1, cpu2] = viewModel.comparison;

  return (
    <PageContext.Provider value={{ viewModel: viewModel }}>
      <CacheProvider products={viewModel.comparison}>
        <ViewModelProvider
          type={ViewModelType.CompareCpusViewModel}
          viewModel={viewModel}
        >
          <RelativeDataProductsProvider
            productType={ProductType.Cpu}
            productIds={[cpu1.id, cpu2.id]}
            relativeDataProducts={viewModel.relativeDataProducts}
          >
            {props.children}
          </RelativeDataProductsProvider>
        </ViewModelProvider>
      </CacheProvider>
    </PageContext.Provider>
  );
}
