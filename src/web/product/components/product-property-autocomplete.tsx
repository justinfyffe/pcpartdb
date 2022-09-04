import React, { FunctionComponent, useCallback } from 'react';
import { ProductPropertyType } from '../../../types/product';
import { ProductMetaKey } from '../../../types/product-meta';
import { ProductSpecKey } from '../../../types/product-spec';
import { Autocomplete } from '../../shared/components/autocomplete';
import { productService } from '../product.service';

interface ProductPropertyAutocompleteProps {
  propertyType: ProductPropertyType;
  field?: ProductMetaKey | ProductSpecKey;

  value?: string;
  onChange?: (value: string) => void;

  ref?: unknown;
}

export const ProductPropertyAutocomplete: FunctionComponent<
  ProductPropertyAutocompleteProps
> = (props) => {
  const { propertyType: type, field, ...restProps } = props;

  const handleQuery = useCallback(
    async (query: string) => {
      if (type === ProductPropertyType.Meta) {
        const results = await productService.autocompleteMeta(
          query,
          field as ProductMetaKey,
        );

        return results.filter((value) => value != null);
      } else if (type === ProductPropertyType.Spec) {
        const results = await productService.autocompleteSpec(
          query,
          field as ProductSpecKey,
        );

        return results.filter((value) => value != null);
      }
      return [];
    },
    [type, field],
  );

  return <Autocomplete onQuery={handleQuery} {...restProps} />;
};
