'use client';

import { isCpuProduct, isGpuProduct, Product } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { CpuAutocompleteOption } from './CpuAutocompleteOption';
import { GpuAutocompleteOption } from './GpuAutocompleteOption';

interface ProductAutocompleteOptionProps {
  product: Partial<Product>;
  index: number;
}

export const ProductAutocompleteOption: FunctionComponent<
  ProductAutocompleteOptionProps
> = (props) => {
  const { index, product } = props;

  if (isCpuProduct(product)) {
    return <CpuAutocompleteOption cpu={product} index={index} />;
  } else if (isGpuProduct(product)) {
    return <GpuAutocompleteOption gpu={product} index={index} />;
  }

  return <></>;
};
