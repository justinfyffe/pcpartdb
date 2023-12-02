import {
  formatProductComparisonName,
  getCompareGpusPath,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

export const RelatedComparisons: FunctionComponent = () => {
  const { relatedComparisons } = useContext(ComparePageContext);

  return (
    <>
      {relatedComparisons?.comparisons?.length && (
        <section>
          <h2>Related Comparisons</h2>

          <div className="flex flex-row flex-wrap gap-4 font-semibold">
            {relatedComparisons.comparisons.map((comparison, i) => (
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
      )}
    </>
  );
};
