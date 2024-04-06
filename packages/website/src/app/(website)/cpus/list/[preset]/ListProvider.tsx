'use client';

import {
  CpuProduct,
  getListCpusPath,
  ListCpusAdditionalData,
  ListCpusFilter,
  ListCpusQuery,
  ListCpusViewModel,
  ProductType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/navigation';
import { listProducts } from 'packages/website/src/app/_common/product/api';
import React, { createContext, useCallback, useContext, useState } from 'react';

export interface ListContextState {
  query?: ListCpusQuery;
  updateQuery: (query: ListCpusQuery) => void;
  cpus: CpuProduct[];
  totalCpus: number;
  additionalData: ListCpusAdditionalData;
}

export const ListContext = createContext<ListContextState>({
  query: null,
  updateQuery: null,
  cpus: null,
  totalCpus: null,
  additionalData: null,
});

export function useListContext() {
  return useContext(ListContext);
}

export interface ListProviderProps {
  viewModel: ListCpusViewModel;
  children: React.ReactNode;
}

export function ListProvider(props: ListProviderProps) {
  const { viewModel } = props;
  const router = useRouter();

  const [cpus, setCpus] = useState(viewModel.results);
  const [total, setTotal] = useState(viewModel.total);
  const [query, setQuery] = useState(viewModel.query);
  const [additionalData, setAdditionalData] = useState(
    viewModel.additionalData,
  );

  const fetchCpus = useCallback(async (query: ListCpusQuery) => {
    const filter: ListCpusFilter = {
      ...(query?.filter ?? {}),
      productType: ProductType.Cpu,
    };
    const response = await listProducts({ ...query, filter });

    setCpus(response.results as CpuProduct[]);
    setTotal(response.total);
    setAdditionalData(response.additionalData);
    setQuery(query);
  }, []);

  const updateQuery = useCallback(
    async (q: ListCpusQuery) => {
      await fetchCpus(q);
      const url = getListCpusPath(q);
      router.push(url, { scroll: false });
      // window.history.pushState({}, '', url);
    },
    [fetchCpus, router],
  );

  return (
    <ListContext.Provider
      value={{ query, updateQuery, cpus, totalCpus: total, additionalData }}
    >
      {props.children}
    </ListContext.Provider>
  );
}
