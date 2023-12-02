import { formatProductName } from '@pcpartdb/shared';
import { ProductSummary } from 'packages/website/src/client/product/components/ProductSummary/ProductSummary';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

export const Overview: FunctionComponent = () => {
  const { gpu, contentTags, contentParams } = useContext(ViewPageContext);

  return (
    <section>
      <h2>About the {formatProductName(gpu, { company: false })}</h2>
      <ProductSummary product={gpu} tags={contentTags} params={contentParams} />
    </section>
  );
};
