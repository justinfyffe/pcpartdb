import { formatProductName } from '@pcpartdb/shared';
import { ProductSummary } from 'packages/website/src/client/product/components/ProductSummary/ProductSummary';
import { InArticleAd } from 'packages/website/src/client/shared/components/Ad/InArticleAd';
import { AdUnit } from 'packages/website/src/client/shared/components/Ad/types';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

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
    <section className="mb-0 flex flex-row gap-6 sm:flex-col sm:gap-6">
      <section className="flex-1">
        <h2>{formatProductName(cpu1)} CPU</h2>
        <ProductSummary
          product={cpu1}
          tags={contentTags1}
          params={contentParams1}
        />
      </section>

      <InArticleAd
        unit={AdUnit.ComparePageMidSummaryInArticle}
        className="hidden md:block"
      />

      <section className="flex-1">
        <h2>{formatProductName(cpu2)} CPU</h2>
        <ProductSummary
          product={cpu2}
          tags={contentTags2}
          params={contentParams2}
        />
      </section>
    </section>
  );
};
