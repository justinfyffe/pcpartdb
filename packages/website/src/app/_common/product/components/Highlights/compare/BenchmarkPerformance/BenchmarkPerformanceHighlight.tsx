'use client';

import { StarIcon } from '@heroicons/react/24/outline';
import { getProductBenchmarkName, ProductComparison } from '@pcpartdb/shared';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { HighlightCard } from 'packages/website/src/app/_common/components/Card/HighlightCard';
import { useGameSelection } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import React from 'react';
import { usePreferredBenchmark } from '../../../../hooks/usePreferredBenchmark';
import { PreferredBenchmarkDialogTrigger } from '../../../PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { LongDescription } from './LongDescription';
import { PerformanceChart } from './PerformanceChart';
import { ShortDescription } from './ShortDescription';

interface BenchmarkPerformanceHighlightProps {
  comparison: ProductComparison;
  className?: string;

  shortDescription?: boolean;
  longDescription?: boolean;
}

export function BenchmarkPerformanceHighlight(
  props: BenchmarkPerformanceHighlightProps,
) {
  const { comparison, className, shortDescription, longDescription } = props;
  const [product1, product2] = comparison;
  const productType = product1.productType || product2.productType;

  const { selectedGame } = useGameSelection();
  const preferredBenchmark = usePreferredBenchmark(productType);

  return (
    <HighlightCard
      icon={<StarIcon />}
      leftTitle="Performance"
      rightTitle={
        <PreferredBenchmarkDialogTrigger
          buttonVariant={ButtonVariant.LinkDialog}
          productType={productType}
          productIds={[product1.id, product2.id]}
          gameSlug={selectedGame?.slug}
          softReload
        >
          {getProductBenchmarkName(preferredBenchmark)}
        </PreferredBenchmarkDialogTrigger>
      }
      className={className}
      contentClassName="justify-between"
    >
      <div className="flex flex-col gap-4">
        <PerformanceChart product={product1} otherProduct={product2} />
        <PerformanceChart product={product2} otherProduct={product1} />

        {shortDescription && <ShortDescription comparison={comparison} />}
        {longDescription && <LongDescription comparison={comparison} />}
      </div>
    </HighlightCard>
  );
}
