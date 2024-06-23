import { ProductType } from '@pcpartdb/shared';
import React from 'react';
import { ProductList } from './ProductList';
import { ProductListHeader } from './ProductListHeader';
import { ProductListLinks } from './ProductListLinks';

interface ProductListSectionProps {
  productType: ProductType;
}

export function ProductListSection(props: ProductListSectionProps) {
  const { productType } = props;

  return (
    <section>
      <ProductListHeader productType={productType} />
      <ProductList productType={productType} />
      <ProductListLinks productType={productType} />
    </section>
  );
}
