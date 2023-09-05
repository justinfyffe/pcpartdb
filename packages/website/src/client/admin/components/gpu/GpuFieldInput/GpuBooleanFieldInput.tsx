import {
  formatGpuField,
  GpuField,
  GpuFieldKey,
  hasProductFieldValue,
} from '@pcpartdb/shared';
import {
  Select,
  SelectValue,
} from 'packages/website/src/client/shared/components/Select/Select';
import { SelectOption } from 'packages/website/src/client/shared/components/Select/SelectOption';
import React, { forwardRef, useCallback, useMemo } from 'react';

interface GpuBooleanFieldInputProps {
  field: GpuFieldKey;

  value?: GpuField<boolean>;
  parentValue?: GpuField<boolean>;
  onChange?: (value: GpuField<boolean>) => void;
}

export const GpuBooleanFieldInput = forwardRef<
  HTMLSelectElement,
  GpuBooleanFieldInputProps
>((props, ref) => {
  const { field, value, parentValue, onChange } = props;

  let baseValue: string = null;
  if (hasProductFieldValue(value)) {
    baseValue = value.value ? 'true' : 'false';
  }
  const placeholder = useMemo(() => formatGpuField(parentValue), [parentValue]);

  const handleChange = useCallback(
    (value: SelectValue) => {
      onChange?.({ value: value === 'true', meta: { fieldKey: field } });
    },
    [field, onChange],
  );

  return (
    <Select
      placeholder={placeholder}
      disabled={value?.meta?.autoUpdate}
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
