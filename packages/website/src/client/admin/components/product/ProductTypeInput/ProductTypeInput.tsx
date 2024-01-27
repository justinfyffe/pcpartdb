import { formatProductType, ProductType } from '@pcpartdb/shared';
import {
  Select,
  SelectValue,
} from 'packages/website/src/client/shared/components/Select/Select';
import { SelectOption } from 'packages/website/src/client/shared/components/Select/SelectOption';
import React, { forwardRef, useCallback } from 'react';

const PRODUCT_TYPES = [ProductType.Cpu, ProductType.Gpu];

interface ProductTypeInputProps {
  value?: ProductType;
  onChange?: (value: ProductType) => void;
}

export const ProductTypeInput = forwardRef<
  HTMLSelectElement,
  ProductTypeInputProps
>((props, ref) => {
  const { onChange, value } = props;

  const handleChange = useCallback(
    (selectValue: SelectValue) => {
      onChange?.(selectValue as ProductType);
    },
    [onChange],
  );

  return (
    <Select value={value} onChange={handleChange} ref={ref}>
      {PRODUCT_TYPES.map((type) => {
        return (
          <SelectOption key={type} label={formatProductType(type)} value={type}>
            {formatProductType(type)}
          </SelectOption>
        );
      })}
    </Select>
  );
});
ProductTypeInput.displayName = 'ProductTypeInput';
