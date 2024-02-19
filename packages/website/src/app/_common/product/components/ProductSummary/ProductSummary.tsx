import {
  isCpuProduct,
  isGpuChipset,
  isGpuRetailModel,
  Product,
} from '@pcpartdb/shared';
import React from 'react';
import { CpuSummary } from './cpu/CpuSummary';
import { CustomSummary } from './CustomSummary';
import { GpuChipsetSummary } from './gpu-chipset/GpuChipsetSummary';
import { GpuRetailModelSummary } from './gpu-retail-model/GpuRetailModelSummary';

interface ProductSummaryProps {
  product: Product;
}

export const ProductSummary = (props: ProductSummaryProps) => {
  const { product } = props;

  if (product?.summary) {
    return <CustomSummary product={product} />;
  } else if (isGpuChipset(product)) {
    return <GpuChipsetSummary />;
  } else if (isGpuRetailModel(product)) {
    return <GpuRetailModelSummary />;
  } else if (isCpuProduct(product)) {
    return <CpuSummary />;
  }

  return <></>;
};
