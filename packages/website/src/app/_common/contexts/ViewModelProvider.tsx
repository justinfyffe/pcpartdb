'use client';

import {
  CompareCpusViewModel,
  CompareGpusViewModel,
  HomeViewModel,
  ViewCpuViewModel,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { ViewModelType } from './types';

type ViewModel =
  | HomeViewModel
  | CompareCpusViewModel
  | CompareGpusViewModel
  | ViewCpuViewModel
  | ViewGpuViewModel;

export interface ViewModelContextState<T = ViewModel> {
  type: ViewModelType;
  viewModel: T;
  updateViewModel: (viewModel: ViewModel) => void;
  refresh?: () => void;
  loading: boolean;
}

export const ViewModelContext = createContext<ViewModelContextState<ViewModel>>(
  {
    type: null,
    viewModel: null,
    updateViewModel: () => {},
    refresh: null,
    loading: null,
  },
);

export function useViewModelContext<T = ViewModel>() {
  return useContext(ViewModelContext) as ViewModelContextState<T>;
}

export function useViewModel<T = ViewModel>() {
  const ctx = useViewModelContext();
  return ctx.viewModel as T;
}

export interface ViewModelProviderProps {
  type: ViewModelType;
  viewModel: ViewModel;
  refresh?: () => ViewModel | Promise<ViewModel>;
  children: React.ReactNode;
}

export function ViewModelProvider(props: ViewModelProviderProps) {
  const { type, refresh: refreshImpl } = props;

  const [viewModel, updateViewModel] = useState(props.viewModel);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!refreshImpl) {
      return;
    }

    setLoading(true);
    const newViewModel = await refreshImpl?.();
    updateViewModel(newViewModel);
    setLoading(false);
  }, [refreshImpl]);

  return (
    <ViewModelContext.Provider
      value={{ type, viewModel, updateViewModel, refresh, loading }}
    >
      {props.children}
    </ViewModelContext.Provider>
  );
}
