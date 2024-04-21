'use client';

import { ProductType, ViewCpuViewModel } from '@pcpartdb/shared';
import { CacheProvider } from 'packages/website/src/app/_common/cache/CacheProvider';
import { ViewModelType } from 'packages/website/src/app/_common/contexts/types';
import { ViewModelProvider } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { RelativeDataProductsProvider } from 'packages/website/src/app/_common/product/contexts/RelativeDataProductsProvider';
import React, { createContext, useContext } from 'react';

export interface PageContextState {
  viewModel: ViewCpuViewModel;
}

export const PageContext = createContext<PageContextState>({
  viewModel: null,
});

export function usePageContext() {
  return useContext(PageContext);
}

export interface PageProviderProps {
  viewModel: ViewCpuViewModel;
  children: React.ReactNode;
}

export function PageProvider(props: PageProviderProps) {
  const { viewModel } = props;

  const { cpu } = viewModel;

  return (
    <PageContext.Provider value={{ viewModel: viewModel }}>
      <CacheProvider products={[cpu]}>
        <ViewModelProvider
          type={ViewModelType.ViewCpuViewModel}
          viewModel={viewModel}
        >
          <RelativeDataProductsProvider
            productType={ProductType.Cpu}
            productIds={[cpu.id]}
            relativeDataProducts={viewModel.relativeDataProducts}
          >
            {props.children}
          </RelativeDataProductsProvider>
        </ViewModelProvider>
      </CacheProvider>
    </PageContext.Provider>
  );
}
