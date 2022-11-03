import { TextInput } from '@client/shared/components';
import { Spec, SpecKey } from '@shared/spec';
import React, { forwardRef, useCallback } from 'react';

interface SpecStringFieldProps {
  field: SpecKey;

  value?: Spec<string>;
  onChange?: (value: Spec<string>) => void;
}

export const SpecStringField = forwardRef<
  HTMLInputElement,
  SpecStringFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(
        value != null ? { value, metadata: { specKey: field } } : null,
      );
    },
    [field, onChange],
  );

  return <TextInput value={baseValue} onChange={handleChange} ref={ref} />;
});
SpecStringField.displayName = 'SpecStringField';
