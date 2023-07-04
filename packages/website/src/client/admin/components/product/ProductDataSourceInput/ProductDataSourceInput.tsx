import { ProductDataSource } from '@pcpartdb/shared';
import React, { forwardRef, useCallback } from 'react';
import { TextInput } from '../../../../shared/components';

interface ProductDataSourceInputProps {
  value?: ProductDataSource;
  onChange?: (value: ProductDataSource) => void;
}

export const ProductDataSourceInput = forwardRef<
  HTMLInputElement,
  ProductDataSourceInputProps
>((props, ref) => {
  const { value, onChange } = props;

  const baseValue = value?.url ?? null;

  const handleChange = useCallback(
    (url: string) => {
      onChange?.(url != null ? { url } : null);
    },
    [onChange],
  );

  return <TextInput value={baseValue} onChange={handleChange} ref={ref} />;
});
ProductDataSourceInput.displayName = 'ProductDataSourceInput';
