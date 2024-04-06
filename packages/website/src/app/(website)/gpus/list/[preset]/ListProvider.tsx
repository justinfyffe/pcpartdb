'use client';

import {
  generateListProductsQueryFromPath,
  getListGpusPath,
  GpuProduct,
  ListGpusAdditionalData,
  ListGpusFilter,
  ListGpusQuery,
  ListGpusViewModel,
  ProductType,
} from '@pcpartdb/shared';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();

  const [gpus, setGpus] = useState(viewModel.results);
  const [total, setTotal] = useState(viewModel.total);
  const [query, setQuery] = useState(viewModel.query);
  const [additionalData, setAdditionalData] = useState(
    viewModel.additionalData,
  );

  const fetchGpusImpl = useCallback(async (query: ListGpusQuery) => {
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
  const { func: fetchGpus, abort: abortFetchGpus } =
    useCancelable(fetchGpusImpl);

  // TODO: make this work with back/forward button.
  const updateQuery = useCallback(
    async (q: ListGpusQuery) => {
      abortFetchGpus?.();
      await fetchGpus(q);
      const url = getListGpusPath(q);
      router.push(url, { scroll: false });
      // window.history.pushState({}, '', url);
    },
    [abortFetchGpus, fetchGpus, router],
  );

  // TODO: this sort of allows back, but causes a lot of random issues
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  // useEffect(() => {
  //   const url = `${pathname}?${searchParams}`;
  //   abortFetchGpus?.();
  //   fetchGpus(
  //     generateListProductsQueryFromPath({
  //       productType: query.filter.productType,
  //       path: url,
  //       defaults: {
  //         sort: searchParams.get('sort'),
  //         order: searchParams.get('order'),
  //       },
  //     }) as ListGpusQuery,
  //   );
  //   // Only run this hook when the url changes.
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname, searchParams]);

  return (
    <ListContext.Provider
      value={{ query, updateQuery, gpus, totalGpus: total, additionalData }}
    >
      {props.children}
    </ListContext.Provider>
  );
}
