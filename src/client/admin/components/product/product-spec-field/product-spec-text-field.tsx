import React, { forwardRef, useCallback } from 'react';
import {
  ProductSpecKey,
  ProductSpecRequest,
} from '../../../../../shared/product-spec';
import { Textarea } from '../../../../shared/components/textarea';

interface ProductSpecTextFieldProps {
  field: ProductSpecKey;

  value?: ProductSpecRequest;
  onChange?: (value: ProductSpecRequest) => void;
}

export const ProductSpecTextField = forwardRef<
  HTMLTextAreaElement,
  ProductSpecTextFieldProps
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
ProductSpecTextField.displayName = 'ProductSpecTextField';
