import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { ProductComparison } from '@pcpartdb/shared';
import { HighlightCard } from 'packages/website/src/app/_common/components/Card/HighlightCard';
import React from 'react';
import { PreferredBenchmarkButton } from '../../../PreferredBenchmark/PreferredBenchmarkButton';
import { LongDescription } from './LongDescription';
import { PerformancePerDollarChart } from './PerformancePerDollarChart';
import { ShortDescription } from './ShortDescription';

interface BenchmarkPerformancePerDollarHighlightProps {
  comparison: ProductComparison;
  className?: string;

  shortDescription?: boolean;
  longDescription?: boolean;
}

export function BenchmarkPerformancePerDollarHighlight(
  props: BenchmarkPerformancePerDollarHighlightProps,
) {
  const { comparison, className, shortDescription, longDescription } = props;
  const [product1, product2] = comparison;

  return (
    <HighlightCard
      icon={<CurrencyDollarIcon />}
      leftTitle="Performance per dollar"
      rightTitle={<PreferredBenchmarkButton softReload products={comparison} />}
      className={className}
      contentClassName="justify-between"
    >
      <div className="flex flex-col gap-4">
        <PerformancePerDollarChart product={product1} otherProduct={product2} />
        <PerformancePerDollarChart product={product2} otherProduct={product1} />

        {shortDescription && <ShortDescription comparison={comparison} />}
        {longDescription && <LongDescription comparison={comparison} />}
      </div>
    </HighlightCard>
  );
}
