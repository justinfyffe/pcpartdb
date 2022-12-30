import {
  getCompareGpusSlug,
  getGpuComparisonName,
  getGpuName,
  getShoppingUrl,
} from '@client/product';
import { CompareProductsForm, ProductImages } from '@client/product/components';
import { useProductCache } from '@client/shared/cache';
import { Breadcrumb, Breadcrumbs, Button } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { getCompareGpusPath, getListGpusPath } from '@client/shared/website';
import { Sidenav, SidenavComparisons, SidenavProducts } from '@client/sidenav';
import { ProductComparison, RelatedProducts } from '@shared/product';
import React from 'react';
import {
  Benchmarks,
  GeneralInfo,
  Intro,
  RelativePerformance,
  RelativeValue,
  TechnicalSpecs,
} from './components';
import { GpuHeader } from './components/gpu-header';
import { ComparePageContext, createComparePageContextState } from './context';
import { ComparePageContentData } from './types';

export interface CompareGpuPageProps {
  comparison: ProductComparison;
  contentData: ComparePageContentData;
  relatedProducts: RelatedProducts;
}

export const CompareGpuPage = (props: CompareGpuPageProps) => {
  const { comparison, contentData, relatedProducts } = props;
  useProductCache(comparison);

  const [gpu1, gpu2] = comparison;

  const context = createComparePageContextState({ comparison, contentData });

  const shoppingUrl1 = getShoppingUrl(gpu1);
  const shoppingUrl2 = getShoppingUrl(gpu2);

  const title = getGpuComparisonName(comparison);
  const keywords = [
    getGpuName(comparison[0]),
    getGpuName(comparison[1]),
    getGpuComparisonName(comparison),
  ];
  const canonical = getCompareGpusPath(
    getCompareGpusSlug(comparison, { ordered: true }),
  );

  return (
    <ComparePageContext.Provider value={context}>
      <WebsiteLayout seo={{ title, keywords, canonical }}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href="/">Home</Breadcrumb>
          <Breadcrumb href={getListGpusPath()}>Graphics Cards</Breadcrumb>
          <Breadcrumb>{title}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap gap-8 mb-8 justify-center">
          <section className="flex flex-wrap w-full">
            <h1 className="font-semibold">{title}</h1>

            <CompareProductsForm values={[gpu1.id, gpu2.id]} />
          </section>

          <article className="flex-1 flex flex-col gap-8">
            <section className="flex md:flex-wrap gap-8 justify-evenly">
              <GpuHeader gpu={gpu1} />
              <GpuHeader gpu={gpu2} />
            </section>

            <Intro />
            <GeneralInfo />
            <RelativePerformance />
            <RelativeValue />
            <Benchmarks />
            <TechnicalSpecs />
          </article>

          <Sidenav>
            <SidenavComparisons comparisons={relatedProducts.comparisons} />
            <SidenavProducts products={relatedProducts.gpus} />
          </Sidenav>
        </div>

        <section>
          <p className="text-xs">
            The ranks on this page considers the{' '}
            {contentData.totalPerformanceRatedGpus} GPUs that we track in our
            database. Check which graphics cards we are tracking on our{' '}
            <a href={getListGpusPath()}>GPU list</a> page.
          </p>
        </section>
      </WebsiteLayout>
    </ComparePageContext.Provider>
  );
};
