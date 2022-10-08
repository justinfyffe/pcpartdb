import React, { forwardRef, useCallback } from 'react';
import {
  ProductMetaKey,
  ProductMetaMetadata,
} from '../../../../../shared/product-meta';
import { TextInput } from '../../../../shared/components/input';

interface ProductMetaTextValue {
  key: ProductMetaKey;

  stringValue?: string;

  metadata?: ProductMetaMetadata;
  source?: string;
}

interface ProductMetaTextFieldProps {
  field: ProductMetaKey;

  value?: ProductMetaTextValue;
  onChange?: (value: ProductMetaTextValue) => void;
}

export const ProductMetaStringField = forwardRef<
  HTMLInputElement,
  ProductMetaTextFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.stringValue ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { key: field, stringValue: value } : null);
    },
    [field, onChange],
  );

  return <TextInput value={baseValue} onChange={handleChange} ref={ref} />;
});
ProductMetaStringField.displayName = 'ProductMetaStringField';
