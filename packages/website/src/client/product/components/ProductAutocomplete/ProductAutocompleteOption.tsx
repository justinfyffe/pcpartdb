import { Cpu, Gpu, Product, ProductType } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { CpuAutocompleteOption } from './CpuAutocompleteOption';
import { GpuAutocompleteOption } from './GpuAutocompleteOption';

interface ProductAutocompleteOptionProps {
  productType: ProductType;
  product: Product;
  index: number;
}

export const ProductAutocompleteOption: FunctionComponent<
  ProductAutocompleteOptionProps
> = (props) => {
  const { index, product, productType } = props;

  if (productType === ProductType.Cpu) {
    return <CpuAutocompleteOption cpu={product as Cpu} index={index} />;
  } else if (productType === ProductType.Gpu) {
    return <GpuAutocompleteOption gpu={product as Gpu} index={index} />;
  }

  return <></>;
};
