import React, { forwardRef, useCallback } from 'react';
import {
  ProductSpecKey,
  ProductSpecRequest,
} from '../../../../types/product-spec';
import {
  Select,
  SelectOption,
  SelectValue,
} from '../../../shared/components/select';

interface ProductSpecStringFieldProps {
  field: ProductSpecKey;

  value?: ProductSpecRequest;
  onChange?: (value: ProductSpecRequest) => void;
}

export const ProductSpecBooleanField = forwardRef<
  HTMLSelectElement,
  ProductSpecStringFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  let baseValue: string = null;
  if (value?.booleanValue != null) {
    baseValue = value?.booleanValue ? 'true' : 'false';
  }

  const handleChange = useCallback(
    (value: SelectValue) => {
      if (typeof value != 'string') {
        throw new Error('Invalid select value for ProductSpecBooleanField');
      }

      onChange?.(
        value != null ? { key: field, booleanValue: value === 'true' } : null,
      );
    },
    [field, onChange],
  );

  return (
    <Select value={baseValue} onChange={handleChange} clearable ref={ref}>
      <SelectOption label="True" value="true">
        True
      </SelectOption>
      <SelectOption label="False" value="false">
        False
      </SelectOption>
    </Select>
  );
});
ProductSpecBooleanField.displayName = 'ProductSpecBooleanField';
