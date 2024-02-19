import { CpuProduct, formatProductName } from '@pcpartdb/shared';
import { EditProductLink } from 'packages/website/src/app/_common/product/components/EditProductLink/EditProductLink';
import { ProductSummary } from 'packages/website/src/app/_common/product/components/ProductSummary/ProductSummary';
import React, { FunctionComponent } from 'react';

interface OverviewProps {
  cpu: CpuProduct;
}

export const Overview: FunctionComponent<OverviewProps> = (
  props: OverviewProps,
) => {
  const { cpu } = props;

  return (
    <section>
      <h2>
        {formatProductName(cpu)} CPU{' '}
        <EditProductLink product={cpu}>(Edit)</EditProductLink>
      </h2>

      <ProductSummary product={cpu} />
    </section>
  );
};
