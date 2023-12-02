import {
  formatProductComparisonName,
  getCompareCpusPath,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

export const RelatedComparisons: FunctionComponent = () => {
  const { relatedCpuComparisons } = useContext(ViewPageContext);

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
