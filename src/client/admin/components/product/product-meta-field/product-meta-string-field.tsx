import { TextInput } from '@client/shared/components';
import { ProductMeta, ProductMetaKey } from '@shared/product-meta';
import React, { forwardRef, useCallback } from 'react';

interface ProductMetaTextFieldProps {
  field: ProductMetaKey;

  value?: ProductMeta<string>;
  onChange?: (value: ProductMeta<string>) => void;
}

export const ProductMetaStringField = forwardRef<
  HTMLInputElement,
  ProductMetaTextFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(
        value != null ? { value, metadata: { metaKey: field } } : null,
      );
    },
    [field, onChange],
  );

  return <TextInput value={baseValue} onChange={handleChange} ref={ref} />;
});
ProductMetaStringField.displayName = 'ProductMetaStringField';
