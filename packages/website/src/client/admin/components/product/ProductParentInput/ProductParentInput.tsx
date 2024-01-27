import { Product, ProductType } from '@pcpartdb/shared';
import { ProductAutocomplete } from 'packages/website/src/client/product/components/ProductAutocomplete/ProductAutocomplete';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { ProductFormContext } from '../ProductForm/ProductFormContext';

export interface ProductParentInputProps {
  productType: ProductType;

  value?: number;
  onChange?: (value: number) => void;
}

export const ProductParentInput: FunctionComponent<ProductParentInputProps> = (
  props,
) => {
  const { productType, onChange, value } = props;
  const context = useContext(ProductFormContext);

  const handleParentChange = useCallback(
    (product: Product) => {
      context.updateContext({ ...context, parentProduct: product });
    },
    [context],
  );

  return (
    <ProductAutocomplete
      productType={productType}
      value={value}
      onChange={onChange}
      onChangeProduct={handleParentChange}
      ref={null}
    />
  );
};
