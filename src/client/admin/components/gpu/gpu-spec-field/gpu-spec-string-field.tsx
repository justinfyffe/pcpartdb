import { TextInput } from '@client/shared/components';
import { GpuSpec, GpuSpecKey } from '@shared/gpus';
import React, { forwardRef, useCallback } from 'react';

interface GpuSpecStringFieldProps {
  field: GpuSpecKey;

  value?: GpuSpec<string>;
  onChange?: (value: GpuSpec<string>) => void;
}

export const GpuSpecStringField = forwardRef<
  HTMLInputElement,
  GpuSpecStringFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { value, meta: { specKey: field } } : null);
    },
    [field, onChange],
  );

  return <TextInput value={baseValue} onChange={handleChange} ref={ref} />;
});
GpuSpecStringField.displayName = 'GpuSpecStringField';
