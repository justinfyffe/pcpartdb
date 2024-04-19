'use client';

import {
  CpuProduct,
  generateListProductsQueryFromPath,
  getListCpusPath,
  ListCpusAdditionalData,
  ListCpusFilter,
  ListCpusQuery,
  ListCpusViewModel,
  ProductType,
} from '@pcpartdb/shared';
import { useCancelable } from 'packages/website/src/app/_common/hooks/useCancelable';
import { listProducts } from 'packages/website/src/app/_common/product/api';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

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

  const [cpus, setCpus] = useState(viewModel.results);
  const [total, setTotal] = useState(viewModel.total);
  const [query, setQuery] = useState(viewModel.query);
  const [additionalData, setAdditionalData] = useState(
    viewModel.additionalData,
  );

  const fetchCpusImpl = useCallback(async (query: ListCpusQuery) => {
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
  const { func: fetchCpus, abort: abortFetchCpus } =
    useCancelable(fetchCpusImpl);

  const updateQuery = useCallback(
    async (q: ListCpusQuery) => {
      const url = getListCpusPath(q);
      window.history?.pushState({}, '', url);
      abortFetchCpus?.();
      await fetchCpus(q);
    },
    [abortFetchCpus, fetchCpus],
  );

  const handlePopState = useCallback(async () => {
    const url = new URL(window.location.href);
    const pathname = url.pathname;
    const searchParams = url.searchParams.toString();
    const path = `${pathname}${searchParams ? `?${searchParams}` : ''}`;

    abortFetchCpus?.();
    await fetchCpus(
      generateListProductsQueryFromPath({
        productType: ProductType.Cpu,
        path: path,
      }) as ListCpusQuery,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListContext.Provider
      value={{ query, updateQuery, cpus, totalCpus: total, additionalData }}
    >
      {props.children}
    </ListContext.Provider>
  );
}
