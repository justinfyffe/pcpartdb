import { isCpuProduct, isGpuProduct, Product } from '@pcpartdb/shared';
import React from 'react';
import { CpuSummary } from './cpu/CpuSummary';
import { CustomSummary } from './CustomSummary';
import { GpuSummary } from './gpu/GpuSummary';

interface ProductSummaryProps {
  product: Product;
  index?: number;
}

export const ProductSummary = (props: ProductSummaryProps) => {
  const { product, index } = props;

  if (product?.summary) {
    return <CustomSummary product={product} index={index} />;
  } else if (isGpuProduct(product)) {
    return <GpuSummary product={product} index={index} />;
  } else if (isCpuProduct(product)) {
    return <CpuSummary product={product} index={index} />;
  }

  return <></>;
};
