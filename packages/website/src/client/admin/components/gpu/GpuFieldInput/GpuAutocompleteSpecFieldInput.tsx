import { GpuField, GpuFieldKey } from '@pcpartdb/shared';
import { formatGpuField } from 'packages/website/src/client/gpus';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { gpuService } from '../../../../gpus/gpuService';
import {
  Autocomplete,
  AutocompleteOption,
} from '../../../../shared/components';

interface GpuAutocompleteSpecFieldInputProps {
  field: GpuFieldKey;

  value?: GpuField<string>;
  parentValue?: GpuField<string>;
  onChange?: (value: GpuField<string>) => void;
}

export const GpuAutocompleteSpecFieldInput = forwardRef<
  HTMLInputElement,
  GpuAutocompleteSpecFieldInputProps
>((props, ref) => {
  const { field, value, parentValue, onChange } = props;

  const baseValue = (value?.value as string) ?? null;
  const [results, setResults] = useState<string[]>([]);

  const placeholder = useMemo(() => formatGpuField(parentValue), [parentValue]);

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
      onChange?.({ value, meta: { fieldKey: field } });
    },
    [field, onChange],
  );

  return (
    <Autocomplete
      placeholder={placeholder}
      disabled={value?.meta?.autoUpdate}
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
