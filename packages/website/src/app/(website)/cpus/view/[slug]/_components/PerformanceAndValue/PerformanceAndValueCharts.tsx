import { CpuProduct, hasProductFieldValue } from '@pcpartdb/shared';
import { BenchmarkPerformanceHighlight } from 'packages/website/src/app/_common/product/components/Highlights/view/BenchmarkPerformance/BenchmarkPerformanceHighlight';
import { BenchmarkPerformancePerDollarHighlight } from 'packages/website/src/app/_common/product/components/Highlights/view/BenchmarkPerformancePerDollar/BenchmarkPerformancePerDollarHighlight';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent } from 'react';

interface PerformanceAndValueChartsProps {
  cpu: Partial<CpuProduct>;
  className?: string;
}

export const PerformanceAndValueCharts: FunctionComponent<
  PerformanceAndValueChartsProps
> = (props) => {
  const { cpu, className } = props;

  const hasMsrp = hasProductFieldValue(cpu.fields?.msrp);

  return (
    <div className={classNames('flex flex-row md:flex-col gap-6', className)}>
      <BenchmarkPerformanceHighlight
        product={cpu}
        longDescription
        className={classNames('flex-1')}
      />
      <BenchmarkPerformancePerDollarHighlight
        product={cpu}
        longDescription
        className={classNames('flex-1', hasMsrp ? '' : 'md:hidden')}
      />
    </div>
  );
};
