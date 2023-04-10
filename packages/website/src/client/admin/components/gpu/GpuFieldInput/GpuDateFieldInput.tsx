import { GpuField, GpuFieldKey } from '@pcpartdb/shared';
import React, { forwardRef, useCallback } from 'react';
import { DateInput } from '../../../../shared/components';

interface GpuDateFieldInputProps {
  field: GpuFieldKey;

  value?: GpuField<string>;
  onChange?: (value: GpuField<string>) => void;
}

export const GpuDateFieldInput = forwardRef<
  HTMLInputElement,
  GpuDateFieldInputProps
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
    <DateInput
      disabled={value?.meta?.autoUpdate}
      value={baseValue}
      onChange={handleChange}
      ref={ref}
    />
  );
});
GpuDateFieldInput.displayName = 'GpuDateFieldInput';
