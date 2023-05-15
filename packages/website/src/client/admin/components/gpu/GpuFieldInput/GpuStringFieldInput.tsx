import { GpuField, GpuFieldKey } from '@pcpartdb/shared';
import { formatGpuField } from 'packages/website/src/client/gpus';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { TextInput } from '../../../../shared/components';

interface GpuStringFieldInputProps {
  field: GpuFieldKey;

  value?: GpuField<string>;
  parentValue?: GpuField<string>;
  onChange?: (value: GpuField<string>) => void;
}

export const GpuStringFieldInput = forwardRef<
  HTMLInputElement,
  GpuStringFieldInputProps
>((props, ref) => {
  const { field, value, parentValue, onChange } = props;

  const baseValue = value?.value ?? null;
  const placeholder = useMemo(() => formatGpuField(parentValue), [parentValue]);

  const handleChange = useCallback(
    (value: string) => {
      onChange?.({ value, meta: { fieldKey: field } });
    },
    [field, onChange],
  );

  return (
    <TextInput
      placeholder={placeholder}
      disabled={value?.meta?.autoUpdate}
      value={baseValue}
      onChange={handleChange}
      ref={ref}
    />
  );
});
GpuStringFieldInput.displayName = 'GpuStringFieldInput';
