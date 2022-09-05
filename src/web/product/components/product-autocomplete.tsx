import React, { FunctionComponent, useCallback } from 'react';
import { ProductType } from '../../../types/product';
import { Autocomplete } from '../../shared/components/autocomplete';
import { productService } from '../product.service';

interface ProductAutocompleteProps {
  productType: ProductType;

  value?: number;
  onChange?: (value: number) => void;

  ref?: unknown;
}

export const ProductPropertyAutocomplete: FunctionComponent<
  ProductAutocompleteProps
> = (props) => {
  const { productType: type, onChange, value, ...restProps } = props;

  const handleQuery = useCallback(
    async (query: string) => {
      const results = await productService.autocompleteProduct(query, type);

      return results
        .filter((product) => product != null)
        .map((product) => ({ label: product.name, value: `${product.id}` }));
    },
    [type],
  );

  const handleChange = useCallback(
    (value: string) => {
      onChange(Number(value));
    },
    [onChange],
  );

  return (
    <Autocomplete
      freeSolo
      value={`${value}`}
      onQuery={handleQuery}
      onChange={handleChange}
      {...restProps}
    />
  );
};
