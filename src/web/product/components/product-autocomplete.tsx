import React, { FunctionComponent, useCallback } from 'react';
import { ProductMetaKey } from '../../../types/product-meta';
import { ProductSpecKey } from '../../../types/product-spec';
import {
  Autocomplete,
  AutocompleteValue,
} from '../../shared/components/autocomplete';

export enum ProductAutocompleteType {
  Meta = 'meta',
  Spec = 'spec',
}

interface ProductAutocompleteProps {
  type: ProductAutocompleteType;
  key?: ProductMetaKey | ProductSpecKey;

  value?: AutocompleteValue;
  onChange?: (value: AutocompleteValue) => void;
}

export const ProductAutocomplete: FunctionComponent<
  ProductAutocompleteProps
> = (_props) => {
  const handleQuery = useCallback((query: string) => {
    return [];
  }, []);

  return <Autocomplete onQuery={handleQuery} />;
};
