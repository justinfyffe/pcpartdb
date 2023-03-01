import { Textarea } from '@pcpartdb/website/client/shared/components';
import { GpuField } from '@pcpartdb/website/shared/gpus';
import React, { forwardRef, useCallback } from 'react';

interface GpuTextFieldInputProps {
  field: string;

  value?: GpuField<string>;
  onChange?: (value: GpuField<string>) => void;
}

export const GpuTextFieldInput = forwardRef<
  HTMLTextAreaElement,
  GpuTextFieldInputProps
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
    <Textarea
      disabled={value?.meta?.dataSource?.enabled}
      value={baseValue}
      onChange={handleChange}
      ref={ref}
    />
  );
});
GpuTextFieldInput.displayName = 'GpuTextFieldInput';
