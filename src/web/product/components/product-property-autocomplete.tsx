import React, { forwardRef, useCallback, useState } from 'react';
import { ProductPropertyType } from '../../../types/product';
import { ProductMetaKey } from '../../../types/product-meta';
import { ProductSpecKey } from '../../../types/product-spec';
import {
  Autocomplete,
  AutocompleteOption,
} from '../../shared/components/autocomplete';
import { productService } from '../product.service';

export const ProductPropertyAutocomplete = forwardRef<
  HTMLInputElement,
  ProductPropertyAutocompleteProps
>((props, ref) => {
  const { propertyType: type, field, ...restProps } = props;

  const [results, setResults] = useState<string[]>([]);

  const handleQuery = useCallback(
    async (query: string) => {
      if (type === ProductPropertyType.Meta) {
        const results = await productService.autocompleteMeta(
          query,
          field as ProductMetaKey,
        );
        const filtered = results.filter((value) => value != null);
        setResults(filtered);
        return filtered.length > 0;
      } else if (type === ProductPropertyType.Spec) {
        const results = await productService.autocompleteSpec(
          query,
          field as ProductSpecKey,
        );
        const filtered = results.filter((value) => value != null);
        setResults(filtered);
        return filtered.length > 0;
      }

      return false;
    },
    [type, field],
  );

  return (
    <Autocomplete freeSolo onQuery={handleQuery} {...restProps} ref={ref}>
      {results.map((result) => (
        <AutocompleteOption
          key={result}
          label={result}
          value={result}
          className="hover:bg-[#fafafa]"
          hoveredClassName="bg-[#fafafa]"
        >
          {result}
        </AutocompleteOption>
      ))}
    </Autocomplete>
  );
});
ProductPropertyAutocomplete.displayName = 'ProductPropertyAutocomplete';

interface ProductPropertyAutocompleteProps {
  propertyType: ProductPropertyType;
  field?: ProductMetaKey | ProductSpecKey;

  value?: string;
  onChange?: (value: string) => void;
}
