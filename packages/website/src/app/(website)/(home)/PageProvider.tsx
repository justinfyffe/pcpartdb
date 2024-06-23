'use client';

import { ApiError, HomeViewModel, isApiError } from '@pcpartdb/shared';
import { ViewModelType } from 'packages/website/src/app/_common/contexts/types';
import { ViewModelProvider } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { viewModelClient } from '../../_common/api/ViewModelClient';

export enum ListType {
  Performance,
  PerformancePerMsrp,
}

export interface PageContextState {
  gpuListType: ListType;
  setGpuListType: (type: ListType) => void;

  cpuListType: ListType;
  setCpuListType: (type: ListType) => void;
}

export const PageContext = createContext<PageContextState>({
  gpuListType: null,
  setGpuListType: null,

  cpuListType: null,
  setCpuListType: null,
});

export function usePageContext() {
  return useContext(PageContext);
}

export interface PageProviderProps {
  viewModel: HomeViewModel;
  children: React.ReactNode;
}

export function PageProvider(props: PageProviderProps) {
  const { viewModel } = props;

  const [gpuListType, setGpuListType] = useState(ListType.Performance);
  const [cpuListType, setCpuListType] = useState(ListType.Performance);

  const refresh = useCallback(async () => {
    const viewModel = await viewModelClient.get<HomeViewModel | ApiError>(
      'home',
    );
    if (isApiError(viewModel)) {
      throw viewModel;
    }
    return viewModel as HomeViewModel;
  }, []);

  return (
    <PageContext.Provider
      value={{ gpuListType, setGpuListType, cpuListType, setCpuListType }}
    >
      <ViewModelProvider
        type={ViewModelType.HomeViewModel}
        viewModel={viewModel}
        refresh={refresh}
      >
        {props.children}
      </ViewModelProvider>
    </PageContext.Provider>
  );
}
