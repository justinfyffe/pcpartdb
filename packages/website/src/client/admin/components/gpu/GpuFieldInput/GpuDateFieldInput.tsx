import { GpuField } from '@pcpartdb/shared';
import React, { forwardRef, useCallback } from 'react';
import { DateInput } from '../../../../shared/components';

interface GpuDateFieldInputProps {
  field: string;

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
      onChange?.(value != null ? { value, meta: { fieldKey: field } } : null);
    },
    [field, onChange],
  );

  return (
    <DateInput
      disabled={value?.meta?.dataSource?.enabled}
      value={baseValue}
      onChange={handleChange}
      ref={ref}
    />
  );
});
GpuDateFieldInput.displayName = 'GpuDateFieldInput';
