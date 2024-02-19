'use client';

import {
  getListGpusPath,
  GpuProduct,
  ListGpusAdditionalData,
  ListGpusFilter,
  ListGpusQuery,
  ListGpusViewModel,
  ProductType,
} from '@pcpartdb/shared';
import { listProducts } from 'packages/website/src/app/_common/product/api';
import React, { createContext, useCallback, useContext, useState } from 'react';

export interface ListContextState {
  query?: ListGpusQuery;
  updateQuery: (query: ListGpusQuery) => void;
  gpus: GpuProduct[];
  totalGpus: number;
  additionalData: ListGpusAdditionalData;
}

export const ListContext = createContext<ListContextState>({
  query: null,
  updateQuery: null,
  gpus: null,
  totalGpus: null,
  additionalData: null,
});

export function useListContext() {
  return useContext(ListContext);
}

export interface ListProviderProps {
  viewModel: ListGpusViewModel;
  children: React.ReactNode;
}

export function ListProvider(props: ListProviderProps) {
  const { viewModel } = props;

  const [gpus, setGpus] = useState(viewModel.results);
  const [total, setTotal] = useState(viewModel.total);
  const [query, setQuery] = useState(viewModel.query);
  const [additionalData, setAdditionalData] = useState(
    viewModel.additionalData,
  );

  const fetchGpus = useCallback(async (query: ListGpusQuery) => {
    const filter: ListGpusFilter = {
      ...(query?.filter ?? {}),
      productType: ProductType.Gpu,
    };
    const response = await listProducts({ ...query, filter });

    setGpus(response.results as GpuProduct[]);
    setTotal(response.total);
    setAdditionalData(response.additionalData);
    setQuery(query);
  }, []);

  const updateQuery = useCallback(
    async (q: ListGpusQuery) => {
      await fetchGpus(q);
      const url = getListGpusPath(q);
      window.history.pushState({}, '', url);
    },
    [fetchGpus],
  );

  return (
    <ListContext.Provider
      value={{ query, updateQuery, gpus, totalGpus: total, additionalData }}
    >
      {props.children}
    </ListContext.Provider>
  );
}
