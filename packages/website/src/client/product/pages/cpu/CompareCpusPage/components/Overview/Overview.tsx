import { formatProductName } from '@pcpartdb/shared';
import { ProductSummary } from 'packages/website/src/client/product/components/ProductSummary/ProductSummary';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

export const Overview: FunctionComponent = () => {
  const {
    comparison,
    contentTags1,
    contentTags2,
    contentParams1,
    contentParams2,
  } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  return (
    <section className="mb-0">
      <h2>About the {formatProductName(cpu1, { company: false })}</h2>
      <ProductSummary
        product={cpu1}
        tags={contentTags1}
        params={contentParams1}
      />

      <h2>About the {formatProductName(cpu2, { company: false })}</h2>
      <ProductSummary
        product={cpu2}
        tags={contentTags2}
        params={contentParams2}
      />
    </section>
  );
};
