import React, { forwardRef, useCallback } from 'react';
import {
  ProductMetaKey,
  ProductMetaMetadata,
} from '../../../../shared/product-meta';
import { Textarea } from '../../../shared/components/textarea';

interface ProductMetaTextValue {
  key: ProductMetaKey;

  textValue?: string;

  metadata?: ProductMetaMetadata;
  source?: string;
}

interface ProductMetaTextFieldProps {
  field: ProductMetaKey;

  value?: ProductMetaTextValue;
  onChange?: (value: ProductMetaTextValue) => void;
}

export const ProductMetaTextField = forwardRef<
  HTMLTextAreaElement,
  ProductMetaTextFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.textValue ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { key: field, textValue: value } : null);
    },
    [field, onChange],
  );

  return <Textarea value={baseValue} onChange={handleChange} ref={ref} />;
});
ProductMetaTextField.displayName = 'ProductMetaTextField';
