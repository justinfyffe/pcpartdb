import { DateInput } from '@client/shared/components';
import { GpuSpec, GpuSpecKey } from '@shared/gpus';
import React, { forwardRef, useCallback } from 'react';

interface GpuSpecDateFieldProps {
  field: GpuSpecKey;

  value?: GpuSpec<string>;
  onChange?: (value: GpuSpec<string>) => void;
}

export const GpuSpecDateField = forwardRef<
  HTMLInputElement,
  GpuSpecDateFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { value, meta: { specKey: field } } : null);
    },
    [field, onChange],
  );

  return <DateInput value={baseValue} onChange={handleChange} ref={ref} />;
});
GpuSpecDateField.displayName = 'GpuSpecDateField';
