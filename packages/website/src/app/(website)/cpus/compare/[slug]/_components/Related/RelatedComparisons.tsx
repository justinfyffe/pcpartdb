import {
  CpuProductComparison,
  formatProductComparisonName,
  getCompareCpusPath,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import React, { FunctionComponent } from 'react';

interface RelatedComparisonsProps {
  relatedComparisons: CpuProductComparison[];
}

export const RelatedComparisons: FunctionComponent<RelatedComparisonsProps> = (
  props: RelatedComparisonsProps,
) => {
  const { relatedComparisons } = props;

  const hasRelatedComparison =
    relatedComparisons?.length && relatedComparisons.length > 0;

  if (!hasRelatedComparison) {
    return <></>;
  }

  return (
    <section>
      <h2>Related Comparisons</h2>

      <div className="flex flex-row flex-wrap gap-4 font-semibold">
        {relatedComparisons.map((comparison, i) => (
          <Button
            key={i}
            variant={ButtonVariant.Card}
            href={getCompareCpusPath({ comparison })}
          >
            {formatProductComparisonName(comparison)}
          </Button>
        ))}
      </div>
    </section>
  );
};
