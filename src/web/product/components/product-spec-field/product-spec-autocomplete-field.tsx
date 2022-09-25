import React, { forwardRef, useCallback } from 'react';
import { ProductPropertyType } from '../../../../types/product';
import {
  ProductSpecKey,
  ProductSpecMetadata,
} from '../../../../types/product-spec';
import { ProductPropertyAutocomplete } from '../product-property-autocomplete';

interface ProductSpecAutocompleteValue {
  key: ProductSpecKey;

  stringValue?: string;

  metadata?: ProductSpecMetadata;
  source?: string;
}

interface ProductSpecAutocompleteFieldProps {
  field: ProductSpecKey;

  value?: ProductSpecAutocompleteValue;
  onChange?: (value: ProductSpecAutocompleteValue) => void;
}

export const ProductSpecAutocompleteField = forwardRef<
  HTMLInputElement,
  ProductSpecAutocompleteFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value.stringValue ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { key: field, stringValue: value } : null);
    },
    [field, onChange],
  );

  return (
    <ProductPropertyAutocomplete
      propertyType={ProductPropertyType.Spec}
      field={field}
      value={baseValue}
      onChange={handleChange}
      ref={ref}
    />
  );
});
ProductSpecAutocompleteField.displayName = 'ProductSpecAutocompleteField';
