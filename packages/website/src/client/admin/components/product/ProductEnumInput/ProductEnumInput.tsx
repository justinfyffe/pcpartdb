import {
  hasProductFieldRawValue,
  ProductField,
  ProductFieldKey,
  productFieldRawValue,
} from '@pcpartdb/shared';
import {
  Select,
  SelectValue,
} from 'packages/website/src/client/shared/components/Select/Select';
import { SelectOption } from 'packages/website/src/client/shared/components/Select/SelectOption';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { ProductFieldInput } from '../ProductFieldInput/ProductFieldInput';

export interface ProductEnumItem {
  label: string;
  value: string;
}

export interface ProductEnumInputProps {
  fieldKey: ProductFieldKey;
  items?: ProductEnumItem[];

  label?: string;
  value?: ProductField<string> | ProductField<string[]>;
  onChange?: (value: ProductField<string> | ProductField<string[]>) => void;

  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;

  formatter?: (value: SelectValue) => string;
}

export const ProductEnumInput = forwardRef<
  HTMLSelectElement,
  ProductEnumInputProps
>((props, ref) => {
  const {
    fieldKey,
    label,
    value,
    multiple,
    placeholder,
    disabled,
    onChange,
    formatter,
  } = props;

  const items = props.items ?? [];
  const rawValue = value?.value ?? null;
  const meta = useMemo(() => value?.meta, [value?.meta]);

  const suggestedFormats = useMemo(() => {
    if (!hasProductFieldRawValue(value)) {
      return [];
    }

    const set = new Set<string>();
    set.add(formatter?.(productFieldRawValue(value as unknown)));
    set.add(productFieldRawValue(value as unknown));
    return [...set.values()].filter((value) => value != null);
  }, [formatter, value]);

  const handleValueChange = useCallback(
    (value: SelectValue) => {
      if (value != null) {
        if (typeof value === 'string') {
          onChange?.({
            value: value as string,
            meta: { ...meta, fieldKey },
          });
        } else {
          onChange?.({
            value: value as string[],
            meta: { ...meta, fieldKey },
          });
        }
      } else {
        onChange?.(null);
      }
    },
    [fieldKey, meta, onChange],
  );

  return (
    <ProductFieldInput
      fieldKey={fieldKey}
      disabled={disabled}
      label={label}
      value={value}
      onChange={(field) =>
        onChange?.(field as ProductField<string> | ProductField<string[]>)
      }
      suggestedFormats={suggestedFormats}
    >
      <Select
        placeholder={placeholder}
        disabled={disabled}
        value={rawValue}
        onChange={handleValueChange}
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
    </ProductFieldInput>
  );
});
ProductEnumInput.displayName = 'ProductEnumInput';
