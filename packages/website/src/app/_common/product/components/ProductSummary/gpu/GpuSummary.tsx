import { GpuProduct } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { CompatibilityBlurb } from './CompatibilityBlurb';
import { IntroBlurb } from './IntroBlurb';
import { MemoryBlurb } from './MemoryBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';

interface GpuSummaryProps {
  product: GpuProduct;
  index?: number;
}

export const GpuSummary: FunctionComponent<GpuSummaryProps> = (props) => {
  const { product } = props;

  return (
    <section>
      <IntroBlurb index={props.index} />
      <MemoryBlurb index={props.index} />
      <CompatibilityBlurb index={props.index} />
      {product.enablePerformanceSummary ? (
        <PerformanceBlurb index={props.index} />
      ) : (
        <></>
      )}
    </section>
  );
};
