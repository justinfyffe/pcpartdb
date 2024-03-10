import { GpuProduct } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { CompatibilityBlurb } from './CompatibilityBlurb';
import { IntroBlurb } from './IntroBlurb';
import { MemoryBlurb } from './MemoryBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';

interface GpuRetailModelSummaryProps {
  product: GpuProduct;
}

export const GpuRetailModelSummary: FunctionComponent<
  GpuRetailModelSummaryProps
> = (props) => {
  const { product } = props;

  return (
    <section className="-mb-4">
      <IntroBlurb />
      <MemoryBlurb />
      <CompatibilityBlurb />
      {product.enablePerformanceSummary ? <PerformanceBlurb /> : <></>}
    </section>
  );
};
