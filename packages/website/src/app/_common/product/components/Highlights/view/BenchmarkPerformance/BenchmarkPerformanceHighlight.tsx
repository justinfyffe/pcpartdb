import { StarIcon } from '@heroicons/react/24/outline';
import { Product } from '@pcpartdb/shared';
import { HighlightCard } from 'packages/website/src/app/_common/components/Card/HighlightCard';
import React from 'react';
import { PreferredBenchmarkButton } from '../../../PreferredBenchmark/PreferredBenchmarkButton';
import { LongDescription } from './LongDescription';
import { PerformanceChart } from './PerformanceChart';
import { ShortDescription } from './ShortDescription';

interface BenchmarkPerformanceHighlightProps {
  product: Partial<Product>;
  className?: string;

  shortDescription?: boolean;
  longDescription?: boolean;
}

export function BenchmarkPerformanceHighlight(
  props: BenchmarkPerformanceHighlightProps,
) {
  const { product, className, shortDescription, longDescription } = props;

  return (
    <HighlightCard
      icon={<StarIcon />}
      leftTitle="Performance"
      rightTitle={<PreferredBenchmarkButton softReload products={[product]} />}
      className={className}
      contentClassName="justify-between"
    >
      <div className="flex flex-col gap-4">
        <PerformanceChart product={product} />

        {shortDescription && <ShortDescription product={product} />}
        {longDescription && <LongDescription product={product} />}
      </div>
    </HighlightCard>
  );
}
