import { GpuField, GpuFieldKey } from '@pcpartdb/shared';
import React, { forwardRef, useCallback } from 'react';
import { TextInput } from '../../../../shared/components';

interface GpuStringFieldInputProps {
  field: GpuFieldKey;

  value?: GpuField<string>;
  onChange?: (value: GpuField<string>) => void;
}

export const GpuStringFieldInput = forwardRef<
  HTMLInputElement,
  GpuStringFieldInputProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.({ value, meta: { fieldKey: field } });
    },
    [field, onChange],
  );

  return (
    <TextInput
      disabled={value?.meta?.autoUpdate}
      value={baseValue}
      onChange={handleChange}
      ref={ref}
    />
  );
});
GpuStringFieldInput.displayName = 'GpuStringFieldInput';
