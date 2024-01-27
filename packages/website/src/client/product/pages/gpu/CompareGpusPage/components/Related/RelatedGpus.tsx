import { formatProductName, getViewGpuPath } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

export const RelatedGpus: FunctionComponent = () => {
  const { relatedGpus } = useContext(ComparePageContext);

  const hasRelatedGpus = relatedGpus?.length && relatedGpus.length > 0;

  if (!hasRelatedGpus) {
    return <></>;
  }

  return (
    <section>
      <h2>Related GPUs</h2>

      <div className="flex flex-row flex-wrap gap-x-6 gap-y-3 font-semibold">
        {relatedGpus.map((product, i) => (
          <Button
            key={i}
            variant={ButtonVariant.Card}
            href={getViewGpuPath(product)}
          >
            {formatProductName(product)}
          </Button>
        ))}
      </div>
    </section>
  );
};
