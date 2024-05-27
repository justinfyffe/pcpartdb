'use client';

import {
  generateListProductsQueryFromPath,
  getListGpusPath,
  GpuProduct,
  isApiError,
  ListGpusFilter,
  ListGpusQuery,
  ListGpusViewModel,
  ProductType,
} from '@pcpartdb/shared';
import { useCancelable } from 'packages/website/src/app/_common/hooks/utils/useCancelable';
import { listProducts } from 'packages/website/src/app/_common/product/api';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface ListContextState {
  query?: ListGpusQuery;
  updateQuery: (query: ListGpusQuery) => void;
  gpus: GpuProduct[];
  totalGpus: number;
  loading: boolean;
}

export const ListContext = createContext<ListContextState>({
  query: null,
  updateQuery: null,
  gpus: null,
  totalGpus: null,
  loading: null,
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

  const [loading, setLoading] = useState(false);
  const [gpus, setGpus] = useState(viewModel.results);
  const [total, setTotal] = useState(viewModel.total);
  const [query, setQuery] = useState(viewModel.query);

  const fetchGpusImpl = useCallback(async (query: ListGpusQuery) => {
    const filter: ListGpusFilter = {
      ...(query?.filter ?? {}),
      productType: ProductType.Gpu,
    };
    setLoading(true);
    const response = await listProducts({ ...query, filter });
    if (isApiError(response)) {
      setLoading(false);
      throw response;
    }

    setGpus(response.results as GpuProduct[]);
    setTotal(response.total);
    setQuery(query);
    setLoading(false);
  }, []);
  const { func: fetchGpus, abort: abortFetchGpus } =
    useCancelable(fetchGpusImpl);

  const updateQuery = useCallback(
    async (q: ListGpusQuery) => {
      const url = getListGpusPath(q);
      window.history?.pushState({}, '', url);
      abortFetchGpus?.();
      await fetchGpus(q);
    },
    [abortFetchGpus, fetchGpus],
  );

  const handlePopState = useCallback(async () => {
    const url = new URL(window.location.href);
    const pathname = url.pathname;
    const searchParams = url.searchParams.toString();
    const path = `${pathname}${searchParams ? `?${searchParams}` : ''}`;

    abortFetchGpus?.();
    await fetchGpus(
      generateListProductsQueryFromPath({
        productType: ProductType.Gpu,
        path: path,
      }) as ListGpusQuery,
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
      value={{ query, updateQuery, gpus, totalGpus: total, loading }}
    >
      {props.children}
    </ListContext.Provider>
  );
}
