import { TextInput } from '@client/shared/components';
import { Spec } from '@shared/spec';
import React, { forwardRef, useCallback } from 'react';

interface SpecStringFieldProps {
  value?: Spec<string>;
  onChange?: (value: Spec<string>) => void;
}

export const SpecStringField = forwardRef<
  HTMLInputElement,
  SpecStringFieldProps
>((props, ref) => {
  const { value, onChange } = props;

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { value } : null);
    },
    [onChange],
  );

  return <TextInput value={baseValue} onChange={handleChange} ref={ref} />;
});
SpecStringField.displayName = 'SpecStringField';
