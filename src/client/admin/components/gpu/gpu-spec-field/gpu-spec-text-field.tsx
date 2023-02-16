import { Textarea } from '@client/shared/components';
import { GpuField } from '@shared/gpus';
import React, { forwardRef, useCallback } from 'react';

interface GpuSpecTextFieldProps {
  field: string;

  value?: GpuField<string>;
  onChange?: (value: GpuField<string>) => void;
}

export const GpuSpecTextField = forwardRef<
  HTMLTextAreaElement,
  GpuSpecTextFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { value, meta: { fieldKey: field } } : null);
    },
    [field, onChange],
  );

  return <Textarea value={baseValue} onChange={handleChange} ref={ref} />;
});
GpuSpecTextField.displayName = 'GpuSpecTextField';
