import React, { forwardRef, useCallback } from 'react';
import {
  ProductSpecKey,
  ProductSpecRequest,
} from '../../../../../shared/product-spec';
import { TextInput } from '../../../../shared/components/input';

interface ProductSpecStringFieldProps {
  field: ProductSpecKey;

  value?: ProductSpecRequest;
  onChange?: (value: ProductSpecRequest) => void;
}

export const ProductSpecStringField = forwardRef<
  HTMLInputElement,
  ProductSpecStringFieldProps
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
ProductSpecStringField.displayName = 'ProductSpecStringField';
