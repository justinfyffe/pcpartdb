import { ProductType } from '@pcpartdb/shared';
import React from 'react';
import { ProductListSubtitle } from './ProductListSubtitle';
import { ProductListToggle } from './ProductListToggle';

interface ProductListHeaderProps {
  productType: ProductType;
}

export function ProductListHeader(props: ProductListHeaderProps) {
  const { productType } = props;

  return (
    <div className="flex justify-between items-end mb-4 gap-4">
      <div className="flex flex-col gap-1">
        {productType === ProductType.Cpu && (
          <h2 className="mb-0">Best Gaming Desktop CPUs</h2>
        )}
        {productType === ProductType.Gpu && (
          <h2 className="mb-0">Best Gaming Desktop GPUs</h2>
        )}
        <ProductListSubtitle productType={productType} />
      </div>

      <ProductListToggle productType={productType} />
    </div>
  );
}
