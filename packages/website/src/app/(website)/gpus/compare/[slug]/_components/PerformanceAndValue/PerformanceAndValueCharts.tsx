import { hasProductFieldValue, ProductComparison } from '@pcpartdb/shared';
import { BenchmarkPerformanceHighlight } from 'packages/website/src/app/_common/product/components/Highlights/compare/BenchmarkPerformance/BenchmarkPerformanceHighlight';
import { BenchmarkPerformancePerDollarHighlight } from 'packages/website/src/app/_common/product/components/Highlights/compare/BenchmarkPerformancePerDollar/BenchmarkPerformancePerDollarHighlight';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent } from 'react';

interface PerformanceAndValueChartsProps {
  comparison: ProductComparison;
  className?: string;
}

export const PerformanceAndValueCharts: FunctionComponent<
  PerformanceAndValueChartsProps
> = (props) => {
  const { comparison, className } = props;
  const [gpu1, gpu2] = comparison;

  const hasMsrp =
    hasProductFieldValue(gpu1.fields?.msrp) ||
    hasProductFieldValue(gpu2.fields?.msrp);

  return (
    <div className={classNames('flex flex-row md:flex-col gap-6', className)}>
      <BenchmarkPerformanceHighlight
        comparison={comparison}
        longDescription
        className={classNames('flex-1')}
      />
      <BenchmarkPerformancePerDollarHighlight
        comparison={comparison}
        longDescription
        className={classNames('flex-1', hasMsrp ? '' : 'md:hidden')}
      />
    </div>
  );
};
