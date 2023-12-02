import { formatProductName, getViewGpuPath } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

export const RelatedGpus: FunctionComponent = () => {
  const { relatedGpus } = useContext(ViewPageContext);

  return (
    <>
      {relatedGpus?.products?.length && (
        <section>
          <h2>Related GPUs</h2>

          <div className="flex flex-row flex-wrap gap-4 font-semibold">
            {relatedGpus.products.map((product, i) => (
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
      )}
    </>
  );
};
