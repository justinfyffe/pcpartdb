import { DateFormat, ProductField, ProductFieldKey } from '@pcpartdb/shared';
import { DateInput } from 'packages/website/src/client/shared/components/Input/DateInput';
import {
  Select,
  SelectValue,
} from 'packages/website/src/client/shared/components/Select/Select';
import { SelectOption } from 'packages/website/src/client/shared/components/Select/SelectOption';
import React, { forwardRef, useCallback, useMemo } from 'react';

interface ProductDateInputProps {
  fieldKey: ProductFieldKey;

  value?: ProductField<string>;
  onChange?: (value: ProductField<string>) => void;

  placeholder?: string;
  disabled?: boolean;
}

export const ProductDateInput = forwardRef<
  HTMLInputElement,
  ProductDateInputProps
>((props, ref) => {
  const { fieldKey, placeholder, disabled, value, onChange } = props;

  const rawValue = value?.value || null;
  const meta = useMemo(() => value?.meta || {}, [value?.meta]);
  const format = value?.meta?.dateFormat || null;

  const handleValueChange = useCallback(
    (newValue: string) => {
      onChange?.({
        value: newValue,
        meta: { ...meta, fieldKey, dateFormat: format },
      });
    },
    [fieldKey, format, onChange, meta],
  );

  const handleFormatChange = useCallback(
    (format: SelectValue) => {
      onChange?.({
        value: rawValue,
        meta: { ...meta, fieldKey, dateFormat: format as DateFormat },
      });
    },
    [fieldKey, onChange, rawValue, meta],
  );

  return (
    <div className="flex gap-4">
      <DateInput
        placeholder={placeholder}
        disabled={disabled}
        value={rawValue}
        onChange={handleValueChange}
        className="flex-1"
        ref={ref}
      />

      <Select
        placeholder="Display Format"
        disabled={disabled}
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
ProductDateInput.displayName = 'ProductDateInput';
