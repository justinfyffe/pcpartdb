import { formatProductName, getViewCpuPath } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

export const RelatedCpus: FunctionComponent = () => {
  const { relatedCpus } = useContext(ComparePageContext);

  return (
    <>
      {relatedCpus?.products?.length && (
        <section>
          <h2>Related CPUs</h2>

          <div className="flex flex-row flex-wrap gap-4 font-semibold">
            {relatedCpus.products.map((product, i) => (
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
      )}
    </>
  );
};
