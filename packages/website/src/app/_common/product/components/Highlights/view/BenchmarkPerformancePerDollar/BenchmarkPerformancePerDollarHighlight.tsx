import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Product } from '@pcpartdb/shared';
import { HighlightCard } from 'packages/website/src/app/_common/components/Card/HighlightCard';
import React from 'react';
import { PreferredBenchmarkButton } from '../../../PreferredBenchmark/PreferredBenchmarkButton';
import { LongDescription } from './LongDescription';
import { PerformancePerDollarChart } from './PerformancePerDollarChart';
import { ShortDescription } from './ShortDescription';

interface BenchmarkPerformancePerDollarHighlightProps {
  product: Partial<Product>;
  className?: string;

  shortDescription?: boolean;
  longDescription?: boolean;
}

export function BenchmarkPerformancePerDollarHighlight(
  props: BenchmarkPerformancePerDollarHighlightProps,
) {
  const { product, className, shortDescription, longDescription } = props;

  return (
    <HighlightCard
      icon={<CurrencyDollarIcon />}
      leftTitle="Performance per dollar"
      rightTitle={<PreferredBenchmarkButton softReload products={[product]} />}
      className={className}
      contentClassName="justify-between"
    >
      <div className="flex flex-col gap-4">
        <PerformancePerDollarChart product={product} />

        {shortDescription && <ShortDescription product={product} />}
        {longDescription && <LongDescription product={product} />}
      </div>
    </HighlightCard>
  );
}
