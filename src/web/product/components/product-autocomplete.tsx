import React, { FunctionComponent, useCallback } from 'react';
import { ProductMetaKey } from '../../../types/product-meta';
import { ProductSpecKey } from '../../../types/product-spec';
import {
  Autocomplete,
  AutocompleteValue,
} from '../../shared/components/autocomplete';
import { productService } from '../product.service';

export enum ProductAutocompleteType {
  Meta = 'meta',
  Spec = 'spec',
}

interface ProductAutocompleteProps {
  type: ProductAutocompleteType;
  key?: ProductMetaKey | ProductSpecKey;

  value?: AutocompleteValue;
  onChange?: (value: AutocompleteValue) => void;

  ref?: unknown;
}

export const ProductAutocomplete: FunctionComponent<
  ProductAutocompleteProps
> = (props) => {
  const { type, key, ...restProps } = props;

  const handleQuery = useCallback(
    async (query: string) => {
      if (type === ProductAutocompleteType.Meta) {
        const results = await productService.autocompleteMeta(
          query,
          key as ProductMetaKey,
        );
        return results
          .filter((value) => value != null)
          .map((result) => result.value! as string | number);
      } else if (type === ProductAutocompleteType.Spec) {
        const results = await productService.autocompleteSpec(
          query,
          key as ProductSpecKey,
        );
        return results
          .filter((value) => value != null)
          .map((result) => result.value! as string | number);
      }
      return [];
    },
    [type, key],
  );

  return <Autocomplete onQuery={handleQuery} {...restProps} />;
};
