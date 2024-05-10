'use client';

import { Product, ProductType } from '@pcpartdb/shared';
import React from 'react';
import { PerformanceBlurb as CpuPerformanceBlurb } from './cpu/PerformanceBlurb';
import { PerformanceBlurb as GpuPerformanceBlurb } from './gpu/PerformanceBlurb';

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

  if (product.productType === ProductType.Gpu) {
    return <GpuPerformanceBlurb />;
  }

  return <></>;
};
