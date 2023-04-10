import { GpuField, GpuFieldKey } from '@pcpartdb/shared';
import React, { forwardRef, useCallback } from 'react';
import { Textarea } from '../../../../shared/components';

interface GpuTextFieldInputProps {
  field: GpuFieldKey;

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
      onChange?.({ value, meta: { fieldKey: field } });
    },
    [field, onChange],
  );

  return (
    <Textarea
      disabled={value?.meta?.autoUpdate}
      value={baseValue}
      onChange={handleChange}
      ref={ref}
    />
  );
});
GpuTextFieldInput.displayName = 'GpuTextFieldInput';
