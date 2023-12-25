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
  const [gpu1, gpu2] = comparison;

  return (
    <section className="mb-0 flex flex-row gap-8 sm:flex-col sm:gap-4">
      <section className="flex-1">
        <h2>About the {formatProductName(gpu1, { company: false })}</h2>
        <ProductSummary
          product={gpu1}
          tags={contentTags1}
          params={contentParams1}
        />
      </section>

      <InArticleAd
        unit={AdUnit.ComparePageMidSummaryInArticle}
        className="hidden md:block"
      />

      <section className="flex-1">
        <h2>About the {formatProductName(gpu2, { company: false })}</h2>
        <ProductSummary
          product={gpu2}
          tags={contentTags2}
          params={contentParams2}
        />
      </section>
    </section>
  );
};
