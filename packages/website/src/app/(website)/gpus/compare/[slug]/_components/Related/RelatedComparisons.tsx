import {
  formatProductComparisonName,
  getCompareGpusPath,
  GpuProductComparison,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import React from 'react';

interface RelatedComparisonsProps {
  relatedGpuComparisons: GpuProductComparison[];
}

export function RelatedComparisons(props: RelatedComparisonsProps) {
  const { relatedGpuComparisons } = props;

  const hasRelatedComparison =
    relatedGpuComparisons?.length && relatedGpuComparisons.length > 0;

  if (!hasRelatedComparison) {
    return <></>;
  }

  return (
    <section>
      <h2>Related Comparisons</h2>

      <div className="flex flex-row flex-wrap gap-4 font-semibold">
        {relatedGpuComparisons.map((comparison, i) => (
          <Button
            key={i}
            variant={ButtonVariant.Card}
            href={getCompareGpusPath({ comparison })}
          >
            {formatProductComparisonName(comparison)}
          </Button>
        ))}
      </div>
    </section>
  );
}
