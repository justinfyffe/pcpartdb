import {
  formatProductComparisonName,
  getCompareCpusPath,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

export const RelatedComparisons: FunctionComponent = () => {
  const { relatedCpuComparisons } = useContext(ComparePageContext);

  return (
    <>
      {relatedCpuComparisons?.comparisons?.length && (
        <section>
          <h2>Related Comparisons</h2>

          <div className="flex flex-row flex-wrap gap-4 font-semibold">
            {relatedCpuComparisons.comparisons.map((comparison, i) => (
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
      )}
    </>
  );
};
