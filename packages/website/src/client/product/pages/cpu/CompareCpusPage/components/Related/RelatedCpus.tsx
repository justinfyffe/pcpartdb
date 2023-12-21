import { formatProductName, getViewCpuPath } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

export const RelatedCpus: FunctionComponent = () => {
  const { relatedCpus } = useContext(ComparePageContext);

  const hasRelatedCpus = relatedCpus?.length && relatedCpus.length > 0;

  if (!hasRelatedCpus) {
    return <></>;
  }

  return (
    <section>
      <h2>Related CPUs</h2>

      <div className="flex flex-row flex-wrap gap-4 font-semibold">
        {relatedCpus.map((product, i) => (
          <Button
            key={i}
            variant={ButtonVariant.Card}
            href={getViewCpuPath(product)}
          >
            {formatProductName(product)}
          </Button>
        ))}
      </div>
    </section>
  );
};
