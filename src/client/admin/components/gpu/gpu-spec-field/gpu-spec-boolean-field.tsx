import { Select, SelectOption, SelectValue } from '@client/shared/components';
import { GpuSpec, GpuSpecKey } from '@shared/gpus';
import React, { forwardRef, useCallback } from 'react';

interface GpuSpecStringFieldProps {
  field: GpuSpecKey;

  value?: GpuSpec<boolean>;
  onChange?: (value: GpuSpec<boolean>) => void;
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
          ? { value: value === 'true', meta: { specKey: field } }
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
