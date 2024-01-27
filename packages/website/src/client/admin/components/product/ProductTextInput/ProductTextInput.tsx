import {
  hasProductFieldRawValue,
  ProductField,
  ProductFieldKey,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { ProductFieldInput } from '../ProductFieldInput/ProductFieldInput';

export interface ProductTextInputProps {
  fieldKey: ProductFieldKey;

  label?: string;
  value?: ProductField<string>;
  onChange?: (value: ProductField<string>) => void;

  placeholder?: string;
  disabled?: boolean;

  formatter?: (value: string) => string;
}

export const ProductTextInput = forwardRef<
  HTMLInputElement,
  ProductTextInputProps
>((props, ref) => {
  const { fieldKey, label, value, placeholder, disabled, onChange, formatter } =
    props;

  const rawValue = value?.value ?? null;
  const meta = useMemo(() => value?.meta, [value?.meta]);

  const suggestedFormats = useMemo(() => {
    if (!hasProductFieldRawValue(value)) {
      return [];
    }

    const set = new Set<string>();
    set.add(formatter?.(productFieldRawValue(value)));
    set.add(productFieldRawValue(value));
    return [...set.values()].filter((value) => value != null);
  }, [formatter, value]);

  const handleValueChange = useCallback(
    (newValue: string) => {
      onChange?.({
        value: newValue,
        meta: { ...meta, fieldKey },
      });
    },
    [fieldKey, meta, onChange],
  );

  return (
    <ProductFieldInput
      fieldKey={fieldKey}
      disabled={disabled}
      label={label}
      value={value}
      onChange={(field) => onChange?.(field as ProductField<string>)}
      suggestedFormats={suggestedFormats}
    >
      <TextInput
        placeholder={placeholder}
        disabled={disabled}
        value={rawValue}
        onChange={handleValueChange}
        ref={ref}
      />
    </ProductFieldInput>
  );
});
ProductTextInput.displayName = 'ProductTextInput';
