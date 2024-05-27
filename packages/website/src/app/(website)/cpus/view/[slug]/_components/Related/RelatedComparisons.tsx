import {
  CpuProductComparison,
  formatProductName,
  getCompareCpusPath,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';

interface RelatedComparisonsProps {
  relatedComparisons: CpuProductComparison[];
}

export function RelatedComparisons(props: RelatedComparisonsProps) {
  const { relatedComparisons } = props;

  const hasRelatedComparison =
    relatedComparisons?.length && relatedComparisons.length > 0;

  if (!hasRelatedComparison) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="related-comparisons">
        Related Comparisons
      </SectionHeader>
      <p className="mb-0">Check out these comparisons for similar CPUs:</p>

      <div className="flex flex-row flex-wrap gap-4 font-semibold">
        {relatedComparisons.map((comparison, i) => (
          <ComparisonCard key={i} comparison={comparison} />
        ))}
      </div>
    </section>
  );
}

interface ComparisonCardProps {
  comparison: CpuProductComparison;
}

function ComparisonCard(props: ComparisonCardProps) {
  const { comparison } = props;

  const name1 = formatProductName(comparison[0]);
  const name2 = formatProductName(comparison[1]);

  return (
    <Button
      variant={ButtonVariant.Card}
      href={getCompareCpusPath({ comparison })}
    >
      {name1}
      <br />
      vs
      <br />
      {name2}
    </Button>
  );
}
