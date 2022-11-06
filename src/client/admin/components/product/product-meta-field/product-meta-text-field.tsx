import { Textarea } from '@client/shared/components';
import { ProductMeta } from '@shared/product-meta';
import React, { forwardRef, useCallback } from 'react';

interface ProductMetaTextFieldProps {
  value?: ProductMeta<string>;
  onChange?: (value: ProductMeta<string>) => void;
}

export const ProductMetaTextField = forwardRef<
  HTMLTextAreaElement,
  ProductMetaTextFieldProps
>((props, ref) => {
  const { value, onChange } = props;

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { value } : null);
    },
    [onChange],
  );

  return <Textarea value={baseValue} onChange={handleChange} ref={ref} />;
});
ProductMetaTextField.displayName = 'ProductMetaTextField';
