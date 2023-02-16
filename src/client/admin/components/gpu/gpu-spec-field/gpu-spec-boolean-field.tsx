import { Select, SelectOption, SelectValue } from '@client/shared/components';
import { GpuField } from '@shared/gpus';
import React, { forwardRef, useCallback } from 'react';

interface GpuSpecStringFieldProps {
  field: string;

  value?: GpuField<boolean>;
  onChange?: (value: GpuField<boolean>) => void;
}

export const GpuSpecBooleanField = forwardRef<
  HTMLSelectElement,
  GpuSpecStringFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  let baseValue: string = null;
  if (value?.value != null) {
    baseValue = value?.value ? 'true' : 'false';
  }

  const handleChange = useCallback(
    (value: SelectValue) => {
      onChange?.(
        value != null && typeof value == 'string'
          ? { value: value === 'true', meta: { fieldKey: field } }
          : null,
      );
    },
    [field, onChange],
  );

  return (
    <Select value={baseValue} onChange={handleChange} clearable ref={ref}>
      <SelectOption label="True" value="true">
        True
      </SelectOption>
      <SelectOption label="False" value="false">
        False
      </SelectOption>
    </Select>
  );
});
GpuSpecBooleanField.displayName = 'GpuSpecBooleanField';
