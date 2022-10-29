import React, { useContext } from 'react';
import { ProductContext } from './product-context';

export const Summary = () => {
  const context = useContext(ProductContext);

  const { product } = context;

  return <>Summary for {product.name}</>;
};
