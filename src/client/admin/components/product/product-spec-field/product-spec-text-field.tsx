import { Textarea } from '@client/shared/components';
import { ProductSpecKey, ProductSpecRequest } from '@shared/product-spec';
import React, { forwardRef, useCallback } from 'react';

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
