import React, { forwardRef, useCallback, useState } from 'react';
import {
  ProductSpecKey,
  ProductSpecMetadata,
} from '../../../../types/product-spec';
import {
  Autocomplete,
  AutocompleteOption,
} from '../../../shared/components/autocomplete';
import { productService } from '../../product.service';

interface ProductSpecAutocompleteValue {
  key: ProductSpecKey;

  stringValue?: string;

  metadata?: ProductSpecMetadata;
  source?: string;
}

interface ProductSpecAutocompleteFieldProps {
  field: ProductSpecKey;

  value?: ProductSpecAutocompleteValue;
  onChange?: (value: ProductSpecAutocompleteValue) => void;
}

export const ProductSpecAutocompleteField = forwardRef<
  HTMLInputElement,
  ProductSpecAutocompleteFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.stringValue ?? null;
  const [results, setResults] = useState<string[]>([]);

  const handleQuery = useCallback(
    async (query: string) => {
      if (query == null) {
        return false;
      }

      const results = await productService.autocompleteSpec(
        query,
        field as ProductSpecKey,
      );
      const filtered = results.filter((value) => value != null);
      setResults(filtered);
      return filtered.length > 0;
    },
    [field],
  );

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { key: field, stringValue: value } : null);
    },
    [field, onChange],
  );

  return (
    <Autocomplete
      freeSolo
      onQuery={handleQuery}
      label={baseValue}
      value={baseValue}
      onChange={handleChange}
      ref={ref}
    >
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
ProductSpecAutocompleteField.displayName = 'ProductSpecAutocompleteField';
