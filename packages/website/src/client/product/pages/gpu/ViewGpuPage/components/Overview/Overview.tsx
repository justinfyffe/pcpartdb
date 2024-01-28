import { formatProductName } from '@pcpartdb/shared';
import { ProductSummary } from 'packages/website/src/client/product/components/ProductSummary/ProductSummary';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

export const Overview: FunctionComponent = () => {
  const { gpu, contentTags, contentParams } = useContext(ViewPageContext);

  return (
    <section>
      <h2>{formatProductName(gpu)} GPU</h2>
      <ProductSummary product={gpu} tags={contentTags} params={contentParams} />
    </section>
  );
};
