import React, { forwardRef, useCallback } from 'react';
import {
  ProductSpecKey,
  ProductSpecMetadata,
} from '../../../../types/product-spec';
import { TextInput } from '../../../shared/components/input';

interface ProductSpecTextValue {
  key: ProductSpecKey;

  textValue?: string;

  metadata?: ProductSpecMetadata;
  source?: string;
}

interface ProductSpecTextFieldProps {
  field: ProductSpecKey;

  value?: ProductSpecTextValue;
  onChange?: (value: ProductSpecTextValue) => void;
}

export const ProductSpecTextField = forwardRef<
  HTMLInputElement,
  ProductSpecTextFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value.textValue ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { key: field, textValue: value } : null);
    },
    [field, onChange],
  );

  return <TextInput value={baseValue} onChange={handleChange} ref={ref} />;
});
ProductSpecTextField.displayName = 'ProductSpecTextField';
