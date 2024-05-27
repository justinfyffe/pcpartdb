import { hasProductFieldValue, Product } from '@pcpartdb/shared';
import { BenchmarkPerformanceHighlight } from 'packages/website/src/app/_common/product/components/Highlights/view/BenchmarkPerformance/BenchmarkPerformanceHighlight';
import { BenchmarkPerformancePerDollarHighlight } from 'packages/website/src/app/_common/product/components/Highlights/view/BenchmarkPerformancePerDollar/BenchmarkPerformancePerDollarHighlight';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent } from 'react';

interface BenchmarkPerformanceAndValueChartsProps {
  gpu: Partial<Product>;
  className?: string;
}

export const BenchmarkPerformanceAndValueCharts: FunctionComponent<
  BenchmarkPerformanceAndValueChartsProps
> = (props) => {
  const { gpu, className } = props;

  const hasMsrp = hasProductFieldValue(gpu.fields?.msrp);

  return (
    <div className={classNames('flex flex-row md:flex-col gap-6', className)}>
      <BenchmarkPerformanceHighlight
        product={gpu}
        longDescription
        className={classNames('flex-1')}
      />
      <BenchmarkPerformancePerDollarHighlight
        product={gpu}
        longDescription
        className={classNames('flex-1', hasMsrp ? '' : 'md:hidden')}
      />
    </div>
  );
};
