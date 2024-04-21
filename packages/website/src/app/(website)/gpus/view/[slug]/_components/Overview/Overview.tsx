import { formatProductName, GpuProduct } from '@pcpartdb/shared';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import { EditProductLink } from 'packages/website/src/app/_common/product/components/EditProductLink/EditProductLink';
import { ProductSummary } from 'packages/website/src/app/_common/product/components/ProductSummary/ProductSummary';
import React, { FunctionComponent } from 'react';
import { Contents } from '../Contents/Contents';

interface OverviewProps {
  gpu: GpuProduct;
}

export const Overview: FunctionComponent<OverviewProps> = (
  props: OverviewProps,
) => {
  const { gpu } = props;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="summary" menu={<Contents />}>
        Summary
      </SectionHeader>

      <h2>
        {formatProductName(gpu)} GPU{' '}
        <EditProductLink product={gpu}>(Edit)</EditProductLink>
      </h2>
      <ProductSummary product={gpu} />
    </section>
  );
};
