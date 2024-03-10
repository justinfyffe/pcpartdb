'use client';

import { Product, ProductType } from '@pcpartdb/shared';
import React from 'react';
import { PerformanceBlurb as CpuPerformanceBlurb } from './cpu/PerformanceBlurb';
import { PerformanceBlurb as GpuChipsetPerformanceBlurb } from './gpu-chipset/PerformanceBlurb';
import { PerformanceBlurb as GpuRetailModelPerformanceBlurb } from './gpu-retail-model/PerformanceBlurb';

interface PerformanceSummarySectionProps {
  product: Product;
}

export const PerformanceSummarySection = (
  props: PerformanceSummarySectionProps,
) => {
  const { product } = props;

  if (!product.enablePerformanceSummary) {
    return <></>;
  }

  if (product.productType === ProductType.Cpu) {
    return <CpuPerformanceBlurb />;
  }

  if (product.productType === ProductType.Gpu && product.parent == null) {
    return <GpuChipsetPerformanceBlurb />;
  }

  if (product.productType === ProductType.Gpu && product.parent != null) {
    return <GpuRetailModelPerformanceBlurb />;
  }

  return <></>;
};
