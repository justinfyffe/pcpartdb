import { isCpuProduct, isGpuProduct, Product } from '@pcpartdb/shared';
import React from 'react';
import { CpuSummary } from './cpu/CpuSummary';
import { GpuSummary } from './gpu/GpuSummary';

interface ProductSummaryProps {
  product: Product;
  index?: number;
}

export const ProductSummary = (props: ProductSummaryProps) => {
  const { product, index } = props;

  if (isGpuProduct(product)) {
    return <GpuSummary index={index} />;
  } else if (isCpuProduct(product)) {
    return <CpuSummary index={index} />;
  }

  return <></>;
};
