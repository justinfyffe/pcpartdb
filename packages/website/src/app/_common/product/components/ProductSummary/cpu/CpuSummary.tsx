import { CpuProduct } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { IntroBlurb } from './IntroBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { SpecsBlurb } from './SpecsBlurb';

interface CpuSummaryProps {
  product: CpuProduct;
}

export const CpuSummary: FunctionComponent<CpuSummaryProps> = (props) => {
  const { product } = props;
  return (
    <section className="-mb-4">
      <IntroBlurb />
      <SpecsBlurb />
      {product.enablePerformanceSummary ? <PerformanceBlurb /> : <></>}
    </section>
  );
};
