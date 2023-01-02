import { partService } from '@client/part';
import { Autocomplete, AutocompleteOption } from '@client/shared/components';
import { Spec, SpecKey } from '@shared/spec';
import React, { forwardRef, useCallback, useState } from 'react';

interface SpecAutocompleteFieldProps {
  field: SpecKey;

  value?: Spec<string>;
  onChange?: (value: Spec<string>) => void;
}

export const SpecAutocompleteField = forwardRef<
  HTMLInputElement,
  SpecAutocompleteFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = (value?.value as string) ?? null;
  const [results, setResults] = useState<string[]>([]);

  const handleQuery = useCallback(
    async (query: string) => {
      if (query == null) {
        return false;
      }

      const results = await partService.autocompleteSpec(query, field);
      const filtered = results.filter((value) => value != null);
      setResults(filtered);
      return filtered.length > 0;
    },
    [field],
  );

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(
        value != null ? { value, metadata: { specKey: field } } : null,
      );
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
SpecAutocompleteField.displayName = 'SpecAutocompleteField';
