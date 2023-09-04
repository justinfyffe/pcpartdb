import { GpuField, GpuFieldKey } from '@pcpartdb/shared';
import { Textarea } from 'packages/website/src/client/shared/components/Textarea/Textarea';
import React, { forwardRef, useCallback } from 'react';

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
