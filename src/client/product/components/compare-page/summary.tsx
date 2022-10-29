import React, { useContext } from 'react';
import { ProductsContext } from './products-context';

export const Summary = () => {
  const context = useContext(ProductsContext);

  const { products } = context;

  return (
    <>
      Summary for {products[0].name} vs {products[1].name}
    </>
  );
};
