import {
  DateFormat,
  formatDate,
  ProductField,
  ProductFieldKey,
} from '@pcpartdb/shared';
import { DateInput } from 'packages/website/src/client/shared/components/Input/DateInput';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { ProductFieldInput } from '../ProductFieldInput/ProductFieldInput';

export interface ProductDateInputProps {
  fieldKey: ProductFieldKey;

  label?: string;
  value?: ProductField<string>;
  onChange?: (value: ProductField<string>) => void;

  defaultFormat?: DateFormat;
  placeholder?: string;
  disabled?: boolean;
}

export const ProductDateInput = forwardRef<
  HTMLInputElement,
  ProductDateInputProps
>((props, ref) => {
  const {
    fieldKey,
    placeholder,
    disabled,
    label,
    value,
    defaultFormat,
    onChange,
  } = props;

  const rawValue = value?.value ?? null;
  const meta = useMemo(() => value?.meta || {}, [value?.meta]);

  const handleRawValueChange = useCallback(
    (newValue: string) => {
      const formattedValue = formatDate(newValue, { format: defaultFormat });
      onChange?.({
        value: newValue,
        meta: { ...meta, fieldKey, formattedValue },
      });
    },
    [defaultFormat, onChange, meta, fieldKey],
  );

  return (
    <ProductFieldInput
      fieldKey={fieldKey}
      disabled={disabled}
      label={label}
      value={value}
      onChange={(field) => onChange?.(field as ProductField<string>)}
    >
      <DateInput
        placeholder={placeholder}
        disabled={disabled}
        value={rawValue}
        onChange={handleRawValueChange}
        className="flex-1"
        ref={ref}
      />
    </ProductFieldInput>
  );
});
ProductDateInput.displayName = 'ProductDateInput';
