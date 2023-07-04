import { ProductField, ProductFieldKey } from '@pcpartdb/shared';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import {
  Autocomplete,
  AutocompleteOption,
} from '../../../../shared/components';

interface ProductAutocompleteDataInputProps {
  fieldKey: ProductFieldKey;

  value?: ProductField<string>;
  onChange?: (value: ProductField<string>) => void;
  onQuery?: (query: string) => Promise<string[]>;

  placeholder?: string;
  disabled?: boolean;
}

export const ProductAutocompleteDataInput = forwardRef<
  HTMLInputElement,
  ProductAutocompleteDataInputProps
>((props, ref) => {
  const { fieldKey, placeholder, disabled, value, onChange, onQuery } = props;

  const rawValue = (value?.value as string) ?? null;
  const meta = useMemo(() => value?.meta || {}, [value?.meta]);
  const [results, setResults] = useState<string[]>([]);

  const handleQuery = useCallback(
    async (query: string) => {
      if (query == null) {
        return false;
      }

      const results = await onQuery?.(query);
      const filtered = results.filter((value) => value != null);
      setResults(filtered);
      return filtered.length > 0;
    },
    [onQuery],
  );

  const handleChange = useCallback(
    (value: string) => {
      onChange?.({ value, meta: { ...meta, fieldKey: fieldKey } });
    },
    [fieldKey, meta, onChange],
  );

  return (
    <Autocomplete
      placeholder={placeholder}
      disabled={disabled}
      freeSolo
      onQuery={handleQuery}
      label={rawValue}
      value={rawValue}
      onChange={handleChange}
      ref={ref}
    >
      {results.map((result, i) => (
        <AutocompleteOption
          key={result}
          index={i}
          label={result}
          value={result}
        >
          {result}
        </AutocompleteOption>
      ))}
    </Autocomplete>
  );
});
ProductAutocompleteDataInput.displayName = 'GpuAutocompleteSpecFieldInput';
