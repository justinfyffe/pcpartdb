import { CpuProductComparison, formatProductName } from '@pcpartdb/shared';
import { InArticleAd } from 'packages/website/src/app/_common/components/Ad/InArticleAd';
import { AdUnit } from 'packages/website/src/app/_common/components/Ad/types';
import { ReadMore } from 'packages/website/src/app/_common/components/ReadMore/ReadMore';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import { EditProductLink } from 'packages/website/src/app/_common/product/components/EditProductLink/EditProductLink';
import { ProductSummary } from 'packages/website/src/app/_common/product/components/ProductSummary/ProductSummary';
import React from 'react';

interface OverviewProps {
  comparison: CpuProductComparison;
}

export function Overview(props: OverviewProps) {
  const { comparison } = props;
  const [cpu1, cpu2] = comparison;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="summary">Summary</SectionHeader>

      <section className="mb-0 flex flex-row gap-6 sm:flex-col">
        <section className="flex-1">
          <h2>
            {formatProductName(cpu1)} CPU{' '}
            <EditProductLink product={cpu1}>(Edit)</EditProductLink>
          </h2>

          <ReadMore mobileOnly>
            <ProductSummary product={cpu1} index={0} />
          </ReadMore>
        </section>

        <InArticleAd
          unit={AdUnit.ComparePageMidSummaryInArticle}
          className="hidden md:block"
        />

        <section className="flex-1">
          <h2>
            {formatProductName(cpu2)} CPU{' '}
            <EditProductLink product={cpu2}>(Edit)</EditProductLink>
          </h2>

          <ReadMore mobileOnly>
            <ProductSummary product={cpu2} index={1} />
          </ReadMore>
        </section>
      </section>
    </section>
  );
}
