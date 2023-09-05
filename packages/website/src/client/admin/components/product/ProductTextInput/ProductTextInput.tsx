import { ProductField, ProductFieldKey } from '@pcpartdb/shared';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import React, { forwardRef, useCallback, useMemo } from 'react';

interface ProductTextInputProps {
  fieldKey: ProductFieldKey;

  value?: ProductField<string>;
  onChange?: (value: ProductField<string>) => void;

  placeholder?: string;
  disabled?: boolean;
}

export const ProductTextInput = forwardRef<
  HTMLInputElement,
  ProductTextInputProps
>((props, ref) => {
  const { fieldKey, value, placeholder, disabled, onChange } = props;

  const rawValue = value?.value || null;
  const meta = useMemo(() => value?.meta, [value?.meta]);

  const handleChange = useCallback(
    (newValue: string) => {
      onChange?.({ value: newValue, meta: { ...meta, fieldKey } });
    },
    [fieldKey, meta, onChange],
  );

  return (
    <TextInput
      placeholder={placeholder}
      disabled={disabled}
      value={rawValue}
      onChange={handleChange}
      ref={ref}
    />
  );
});
ProductTextInput.displayName = 'ProductTextInput';
