import {
  formatProductName,
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
          <ComparisonCard key={i} comparison={comparison} />
        ))}
      </div>
    </section>
  );
}

interface ComparisonCardProps {
  comparison: GpuProductComparison;
}

function ComparisonCard(props: ComparisonCardProps) {
  const { comparison } = props;

  const name1 = formatProductName(comparison[0]);
  const name2 = formatProductName(comparison[1]);

  return (
    <Button
      variant={ButtonVariant.Card}
      href={getCompareGpusPath({ comparison })}
    >
      {name1}
      <br />
      vs
      <br />
      {name2}
    </Button>
  );
}
