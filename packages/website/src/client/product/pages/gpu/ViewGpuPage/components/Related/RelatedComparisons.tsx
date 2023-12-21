import {
  formatProductComparisonName,
  getCompareGpusPath,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

export const RelatedComparisons: FunctionComponent = () => {
  const { relatedGpuComparisons } = useContext(ViewPageContext);

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
};
