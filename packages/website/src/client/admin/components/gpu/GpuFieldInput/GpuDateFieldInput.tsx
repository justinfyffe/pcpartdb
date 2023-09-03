import {
  DateFormat,
  formatGpuField,
  GpuField,
  GpuFieldKey,
} from '@pcpartdb/shared';
import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  DateInput,
  Select,
  SelectOption,
  SelectValue,
} from '../../../../shared/components';

interface GpuDateFieldInputProps {
  field: GpuFieldKey;

  value?: GpuField<string>;
  parentValue?: GpuField<string>;
  onChange?: (value: GpuField<string>) => void;
}

export const GpuDateFieldInput = forwardRef<
  HTMLInputElement,
  GpuDateFieldInputProps
>((props, ref) => {
  const { field: fieldKey, value, parentValue, onChange } = props;

  const baseValue = value?.value ?? null;
  const format = value?.meta?.dateFormat ?? null;
  const placeholder = useMemo(() => formatGpuField(parentValue), [parentValue]);

  const handleValueChange = useCallback(
    (newValue: string) => {
      onChange?.({
        value: newValue,
        meta: { fieldKey, dateFormat: format },
      });
    },
    [fieldKey, format, onChange],
  );

  const handleFormatChange = useCallback(
    (format: SelectValue) => {
      onChange?.({
        value: baseValue,
        meta: { fieldKey, dateFormat: format as DateFormat },
      });
    },
    [fieldKey, baseValue, onChange],
  );

  return (
    <div className="flex gap-4">
      <DateInput
        placeholder={placeholder}
        disabled={value?.meta?.autoUpdate}
        value={baseValue}
        onChange={handleValueChange}
        className="flex-1"
        ref={ref}
      />

      <Select
        placeholder="Display Format"
        disabled={value?.meta?.autoUpdate}
        value={format}
        onChange={handleFormatChange}
        className="flex-1"
        clearable
      >
        <SelectOption label="Quarter Year" value={DateFormat.QuarterYear}>
          Quarter Year
        </SelectOption>
        <SelectOption label="Year" value={DateFormat.Year}>
          Year
        </SelectOption>
        <SelectOption label="Year Quarter" value={DateFormat.YearQuarter}>
          Year Quarter
        </SelectOption>
      </Select>
    </div>
  );
});
GpuDateFieldInput.displayName = 'GpuDateFieldInput';
