import { GpuField, GpuFieldKey } from '@pcpartdb/shared';
import React, { forwardRef, useCallback } from 'react';
import {
  Select,
  SelectOption,
  SelectValue,
} from '../../../../shared/components';

interface GpuBooleanFieldInputProps {
  field: GpuFieldKey;

  value?: GpuField<boolean>;
  onChange?: (value: GpuField<boolean>) => void;
}

export const GpuBooleanFieldInput = forwardRef<
  HTMLSelectElement,
  GpuBooleanFieldInputProps
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
    <Select
      disabled={value?.meta?.dataSource?.enabled}
      value={baseValue}
      onChange={handleChange}
      clearable
      ref={ref}
    >
      <SelectOption label="True" value="true">
        True
      </SelectOption>
      <SelectOption label="False" value="false">
        False
      </SelectOption>
    </Select>
  );
});
GpuBooleanFieldInput.displayName = 'GpuBooleanFieldInput';
