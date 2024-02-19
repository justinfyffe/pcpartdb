import { formatProductName, GpuProduct } from '@pcpartdb/shared';
import { EditProductLink } from 'packages/website/src/app/_common/product/components/EditProductLink/EditProductLink';
import { ProductSummary } from 'packages/website/src/app/_common/product/components/ProductSummary/ProductSummary';
import React, { FunctionComponent } from 'react';

interface OverviewProps {
  gpu: GpuProduct;
}

export const Overview: FunctionComponent<OverviewProps> = (
  props: OverviewProps,
) => {
  const { gpu } = props;

  return (
    <section>
      <h2>
        {formatProductName(gpu)} GPU{' '}
        <EditProductLink product={gpu}>(Edit)</EditProductLink>
      </h2>
      <ProductSummary product={gpu} />
    </section>
  );
};
