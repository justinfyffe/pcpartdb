import { CpuProduct, formatProductName } from '@pcpartdb/shared';
import { ReadMore } from 'packages/website/src/app/_common/components/ReadMore/ReadMore';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
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
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="summary">Summary</SectionHeader>

      <div className="flex flex-col gap-0">
        <h2>
          About the {formatProductName(cpu)} CPU{' '}
          <EditProductLink product={cpu}>(Edit)</EditProductLink>
        </h2>

        <ReadMore mobileOnly>
          <ProductSummary product={cpu} />
        </ReadMore>
      </div>
    </section>
  );
};
