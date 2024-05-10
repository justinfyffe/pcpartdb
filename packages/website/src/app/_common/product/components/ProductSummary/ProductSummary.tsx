import { isCpuProduct, isGpuProduct, Product } from '@pcpartdb/shared';
import React from 'react';
import { CpuSummary } from './cpu/CpuSummary';
import { CustomSummary } from './CustomSummary';
import { GpuSummary } from './gpu/GpuSummary';

interface ProductSummaryProps {
  product: Product;
}

export const ProductSummary = (props: ProductSummaryProps) => {
  const { product } = props;

  if (product?.summary) {
    return <CustomSummary product={product} />;
  } else if (isGpuProduct(product)) {
    return <GpuSummary product={product} />;
  } else if (isCpuProduct(product)) {
    return <CpuSummary product={product} />;
  }

  return <></>;
};
