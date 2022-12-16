import React, { useContext } from 'react';
import { ProductsContext } from './products-context';

export const Summary = () => {
  const context = useContext(ProductsContext);

  const { comparison } = context;

  return (
    <>
      Summary for {comparison[0].name} vs {comparison[1].name}
    </>
  );
};
