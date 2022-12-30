import { getGpuName, getViewGpuSlug } from '@client/product';
import { CompareProductsForm, ProductImages } from '@client/product/components';
import { useProductCache } from '@client/shared/cache';
import { Breadcrumb, Breadcrumbs } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { getListGpusPath, getViewGpuPath } from '@client/shared/website';
import { Sidenav, SidenavComparisons, SidenavProducts } from '@client/sidenav';
import { Product, RelatedProducts } from '@shared/product';
import React from 'react';
import {
  Benchmarks,
  GeneralInfo,
  Highlights,
  Intro,
  RelativePerformance,
  RelativeValue,
  TechnicalSpecs,
} from './components';
import { createViewPageContextState, ViewPageContext } from './context';
import { ViewPageContentData } from './types';

export interface ViewGpuPageProps {
  gpu: Product;

  contentData: ViewPageContentData;
  relatedProducts: RelatedProducts;
}

export const ViewGpuPage = (props: ViewGpuPageProps) => {
  const { gpu, relatedProducts, contentData } = props;
  useProductCache(gpu);

  const context = createViewPageContextState({ product: gpu, contentData });

  const title = getGpuName(gpu);
  const canonical = getViewGpuPath(getViewGpuSlug(gpu));
  const keywords = [getGpuName(gpu)];

  return (
    <ViewPageContext.Provider value={context}>
      <WebsiteLayout seo={{ title, canonical, keywords }}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href="/">Home</Breadcrumb>
          <Breadcrumb href={getListGpusPath()}>Graphics Cards</Breadcrumb>
          <Breadcrumb>{title}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <section className="flex flex-col w-full">
            <h1 className="md:text-2xl text-3xl">{title}</h1>
            <CompareProductsForm values={[gpu.id]} />
          </section>

          <article className="flex-1 flex flex-col gap-8">
            <section className="flex flex-wrap justify-start gap-8">
              <ProductImages product={gpu} className="flex-1 min-w-80" />
              <Highlights className="flex-1" />
            </section>

            <Intro />
            <GeneralInfo />
            <RelativePerformance />
            <RelativeValue />
            <Benchmarks />
            <TechnicalSpecs />
          </article>

          <Sidenav>
            <SidenavProducts products={relatedProducts.gpus} />
            <SidenavComparisons comparisons={relatedProducts.comparisons} />
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
    </ViewPageContext.Provider>
  );
};
