import { ProductField, ProductFieldKey } from '@pcpartdb/shared';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Textarea } from '../../../../shared/components';

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
ProductTextareaInput.displayName = 'GpuTextFieldInput';
