import { gpuService } from '@client/gpus';
import { Autocomplete, AutocompleteOption } from '@client/shared/components';
import { GpuSpec, GpuSpecKey } from '@shared/gpus';
import React, { forwardRef, useCallback, useState } from 'react';

interface GpuSpecAutocompleteFieldProps {
  field: GpuSpecKey;

  value?: GpuSpec<string>;
  onChange?: (value: GpuSpec<string>) => void;
}

export const GpuSpecAutocompleteField = forwardRef<
  HTMLInputElement,
  GpuSpecAutocompleteFieldProps
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
      onChange?.(value != null ? { value, meta: { specKey: field } } : null);
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
GpuSpecAutocompleteField.displayName = 'GpuSpecAutocompleteField';
