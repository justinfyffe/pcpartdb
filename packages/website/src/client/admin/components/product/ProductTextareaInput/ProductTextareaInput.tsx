import { ProductField, ProductFieldKey } from '@pcpartdb/shared';
import { Textarea } from 'packages/website/src/client/shared/components/Textarea/Textarea';
import React, { forwardRef, useCallback, useMemo } from 'react';

interface ProductTextareaInputProps {
  fieldKey: ProductFieldKey;

  value?: ProductField<string>;
  onChange?: (value: ProductField<string>) => void;

  placeholder?: string;
  disabled?: boolean;
}

export const ProductTextareaInput = forwardRef<
  HTMLTextAreaElement,
  ProductTextareaInputProps
>((props, ref) => {
  const { fieldKey, value, placeholder, disabled, onChange } = props;

  const rawValue = value?.value ?? null;
  const meta = useMemo(() => value?.meta || {}, [value?.meta]);

  const handleChange = useCallback(
    (value: string) => {
      onChange?.({ value, meta: { ...meta, fieldKey } });
    },
    [fieldKey, meta, onChange],
  );

  return (
    <Textarea
      placeholder={placeholder}
      disabled={disabled}
      value={rawValue}
      onChange={handleChange}
      ref={ref}
    />
  );
});
ProductTextareaInput.displayName = 'ProductTextareaInput';
