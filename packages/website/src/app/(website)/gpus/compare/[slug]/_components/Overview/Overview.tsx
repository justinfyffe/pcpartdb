import { formatProductName, GpuProductComparison } from '@pcpartdb/shared';
import { InArticleAd } from 'packages/website/src/app/_common/components/Ad/InArticleAd';
import { AdUnit } from 'packages/website/src/app/_common/components/Ad/types';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import { EditProductLink } from 'packages/website/src/app/_common/product/components/EditProductLink/EditProductLink';
import { ProductSummary } from 'packages/website/src/app/_common/product/components/ProductSummary/ProductSummary';
import React from 'react';
import { Contents } from '../Contents/Contents';

interface OverviewProps {
  comparison: GpuProductComparison;
}

export function Overview(props: OverviewProps) {
  const { comparison } = props;
  const [gpu1, gpu2] = comparison;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="summary" menu={<Contents />}>
        Summary
      </SectionHeader>

      <section className="mb-0 flex flex-row gap-6 sm:flex-col sm:gap-6">
        <section className="flex-1">
          <h2>
            {formatProductName(gpu1)} GPU{' '}
            <EditProductLink product={gpu1}>(Edit)</EditProductLink>
          </h2>
          <ProductSummary product={gpu1} />
        </section>

        <InArticleAd
          unit={AdUnit.ComparePageMidSummaryInArticle}
          className="hidden md:block"
        />

        <section className="flex-1">
          <h2>
            {formatProductName(gpu2)} GPU{' '}
            <EditProductLink product={gpu2}>(Edit)</EditProductLink>
          </h2>
          <ProductSummary product={gpu2} />
        </section>
      </section>
    </section>
  );
}
