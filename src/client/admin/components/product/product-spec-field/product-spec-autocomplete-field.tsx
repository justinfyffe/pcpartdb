import { productService } from '@client/product';
import { Autocomplete, AutocompleteOption } from '@client/shared/components';
import { ProductSpecKey, ProductSpecRequest } from '@shared/product-spec';
import React, { forwardRef, useCallback, useState } from 'react';

interface ProductSpecAutocompleteFieldProps {
  field: ProductSpecKey;

  value?: ProductSpecRequest;
  onChange?: (value: ProductSpecRequest) => void;
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
