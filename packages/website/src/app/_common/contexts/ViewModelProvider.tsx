'use client';

import {
  CompareCpusViewModel,
  CompareGpusViewModel,
  ViewCpuViewModel,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import React, { createContext, useContext, useState } from 'react';
import { ViewModelType } from './types';

type ViewModel =
  | CompareCpusViewModel
  | CompareGpusViewModel
  | ViewCpuViewModel
  | ViewGpuViewModel;

export interface ViewModelContextState<T = ViewModel> {
  type: ViewModelType;
  viewModel: T;
  updateViewModel: (viewModel: ViewModel) => void;
}

export const ViewModelContext = createContext<ViewModelContextState<ViewModel>>(
  {
    type: null,
    viewModel: null,
    updateViewModel: () => {},
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
  children: React.ReactNode;
}

export function ViewModelProvider(props: ViewModelProviderProps) {
  const { type } = props;
  const [viewModel, updateViewModel] = useState(props.viewModel);

  return (
    <ViewModelContext.Provider value={{ type, viewModel, updateViewModel }}>
      {props.children}
    </ViewModelContext.Provider>
  );
}
