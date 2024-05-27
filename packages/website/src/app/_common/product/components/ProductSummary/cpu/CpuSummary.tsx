import { CpuProduct } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { IntroBlurb } from './IntroBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { SpecsBlurb } from './SpecsBlurb';

interface CpuSummaryProps {
  product: CpuProduct;
  index?: number;
}

export const CpuSummary: FunctionComponent<CpuSummaryProps> = (props) => {
  const { product } = props;
  return (
    <section>
      <IntroBlurb index={props.index} />
      <SpecsBlurb index={props.index} />
      {product.enablePerformanceSummary ? (
        <PerformanceBlurb index={props.index} />
      ) : (
        <></>
      )}
    </section>
  );
};
