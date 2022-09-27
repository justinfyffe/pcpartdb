import React, { forwardRef, useCallback } from 'react';
import {
  ProductSpecKey,
  ProductSpecMetadata,
} from '../../../../types/product-spec';
import { DateInput } from '../../../shared/components/input';

interface ProductSpecDateValue {
  key: ProductSpecKey;

  stringValue?: string;

  metadata?: ProductSpecMetadata;
  source?: string;
}

interface ProductSpecDateFieldProps {
  field: ProductSpecKey;

  value?: ProductSpecDateValue;
  onChange?: (value: ProductSpecDateValue) => void;
}

export const ProductSpecDateField = forwardRef<
  HTMLInputElement,
  ProductSpecDateFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.stringValue ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { key: field, stringValue: value } : null);
    },
    [field, onChange],
  );

  return <DateInput value={baseValue} onChange={handleChange} ref={ref} />;
});
ProductSpecDateField.displayName = 'ProductSpecDateField';
