'use client';

import { ProductType, RelativeDataProducts } from '@pcpartdb/shared';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useViewModelContext } from '../../contexts/ViewModelProvider';
import { useGameSelection } from '../../game/contexts/GameSelectionProvider';
import { fetchRelativeDataProducts } from '../api';
import { usePreferredBenchmark } from '../hooks/usePreferredBenchmark';

export interface RelativeDataProductsContextState {
  relativeDataProducts: RelativeDataProducts;
  loading: boolean;
}

export const RelativeDataProductsContext =
  createContext<RelativeDataProductsContextState>({
    relativeDataProducts: null,
    loading: false,
  });

export function useRelativeDataProducts() {
  return useContext(RelativeDataProductsContext);
}

export interface RelativeDataProductsProviderProps {
  productType: ProductType;
  productIds: number[];
  relativeDataProducts?: RelativeDataProducts;
  children: React.ReactNode;
}

export function RelativeDataProductsProvider(
  props: RelativeDataProductsProviderProps,
) {
  const { productIds, productType } = props;
  const preferredBenchmark = usePreferredBenchmark(productType);
  const { selectedGame } = useGameSelection();
  const { viewModel, updateViewModel } = useViewModelContext();

  const [relativeDataProducts, setRelativeDataProducts] = useState(
    props.relativeDataProducts ?? null,
  );

  const [loading, setLoading] = useState(false);
  const [skipFirstFetch, setSkipFirstFetch] = useState(true);

  const updateRelativeDataProducts = useCallback(async () => {
    setLoading(true);
    const response = await fetchRelativeDataProducts({
      productIds,
      benchmark: preferredBenchmark,
      game: selectedGame?.slug ?? selectedGame?.id,
    });

    setRelativeDataProducts(response);
    updateViewModel({ ...viewModel, relativeDataProducts: response });
    setLoading(false);
  }, [
    preferredBenchmark,
    productIds,
    selectedGame?.id,
    selectedGame?.slug,
    updateViewModel,
    viewModel,
  ]);

  useEffect(() => {
    if (skipFirstFetch) {
      setSkipFirstFetch(false);
      return;
    }
    updateRelativeDataProducts();
    // Update relative data products whenever preferred benchmark
    // or selected game changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredBenchmark, selectedGame?.slug]);

  return (
    <RelativeDataProductsContext.Provider
      value={{
        relativeDataProducts,
        loading,
      }}
    >
      {props.children}
    </RelativeDataProductsContext.Provider>
  );
}
