import { ProductField, ProductFieldKey } from '@pcpartdb/shared';
import {
  Select,
  SelectValue,
} from 'packages/website/src/client/shared/components/Select/Select';
import { SelectOption } from 'packages/website/src/client/shared/components/Select/SelectOption';
import React, { forwardRef, useCallback, useMemo } from 'react';

export interface ProductEnumItem {
  label: string;
  value: string;
}

interface ProductEnumInputProps {
  fieldKey: ProductFieldKey;
  items?: ProductEnumItem[];

  value?: ProductField<string> | ProductField<string[]>;
  onChange?: (value: ProductField<string> | ProductField<string[]>) => void;

  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const ProductEnumInput = forwardRef<
  HTMLSelectElement,
  ProductEnumInputProps
>((props, ref) => {
  const { fieldKey, value, multiple, placeholder, disabled, onChange } = props;

  const items = props.items || [];
  const rawValue = value?.value || null;
  const meta = useMemo(() => value?.meta, [value?.meta]);

  const handleChange = useCallback(
    (value: SelectValue) => {
      if (value != null) {
        if (typeof value === 'string') {
          onChange?.({ value: value as string, meta: { ...meta, fieldKey } });
        } else {
          onChange?.({ value: value as string[], meta: { ...meta, fieldKey } });
        }
      }

      onChange?.({ value: value as string, meta: { ...meta, fieldKey } });
    },
    [fieldKey, meta, onChange],
  );

  return (
    <Select
      placeholder={placeholder}
      disabled={disabled}
      value={rawValue}
      onChange={handleChange}
      clearable
      multiple={multiple}
      ref={ref}
    >
      {items.map((item) => (
        <SelectOption key={item.value} label={item.label} value={item.value}>
          {item.label}
        </SelectOption>
      ))}
    </Select>
  );
});
ProductEnumInput.displayName = 'ProductEnumInput';
