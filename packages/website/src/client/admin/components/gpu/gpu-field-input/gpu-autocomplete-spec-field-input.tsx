import { gpuService } from '@pcpartdb/website/client/gpus';
import {
  Autocomplete,
  AutocompleteOption,
} from '@pcpartdb/website/client/shared/components';
import { GpuField } from '@pcpartdb/website/shared/gpus';
import React, { forwardRef, useCallback, useState } from 'react';

interface GpuAutocompleteSpecFieldInputProps {
  field: string;

  value?: GpuField<string>;
  onChange?: (value: GpuField<string>) => void;
}

export const GpuAutocompleteSpecFieldInput = forwardRef<
  HTMLInputElement,
  GpuAutocompleteSpecFieldInputProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = (value?.value as string) ?? null;
  const [results, setResults] = useState<string[]>([]);

  const handleQuery = useCallback(
    async (query: string) => {
      if (query == null) {
        return false;
      }

      const results = await gpuService.autocompleteSpec(query, field);
      const filtered = results.filter((value) => value != null);
      setResults(filtered);
      return filtered.length > 0;
    },
    [field],
  );

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { value, meta: { fieldKey: field } } : null);
    },
    [field, onChange],
  );

  return (
    <Autocomplete
      disabled={value?.meta?.dataSource?.enabled}
      freeSolo
      onQuery={handleQuery}
      label={baseValue}
      value={baseValue}
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
GpuAutocompleteSpecFieldInput.displayName = 'GpuAutocompleteSpecFieldInput';
