import { TextInput } from '@client/shared/components';
import { SpecKey, SpecRequest } from '@shared/spec';
import React, { forwardRef, useCallback } from 'react';

interface SpecStringFieldProps {
  field: SpecKey;

  value?: SpecRequest;
  onChange?: (value: SpecRequest) => void;
}

export const SpecStringField = forwardRef<
  HTMLInputElement,
  SpecStringFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.stringValue ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { key: field, stringValue: value } : null);
    },
    [field, onChange],
  );

  return <TextInput value={baseValue} onChange={handleChange} ref={ref} />;
});
SpecStringField.displayName = 'SpecStringField';
