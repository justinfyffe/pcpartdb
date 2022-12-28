import { useProductCache } from '@client/shared/cache';
import { Breadcrumb, Breadcrumbs, Button } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { Sidenav, SidenavComparisons, SidenavProducts } from '@client/sidenav';
import {
  getProductComparisonName,
  getProductComparisonPath,
  getProductName,
  ProductComparison,
  RelatedProducts,
} from '@shared/product';
import { getShoppingUrl } from '@shared/retail-model';
import React from 'react';
import { CompareProductsForm } from '../compare-products-form';
import { ProductImages } from '../product-images';
import { BenchmarksIntro, BenchmarksTable } from './content/benchmarks';
import { GeneralInfoIntro, GeneralInfoTable } from './content/general-info';
import { IntroParagraph } from './content/intro';
import { PerformanceIntro, PerformanceTable } from './content/performance';
import { ApiIntro, ApiTable } from './content/specs/api';
import {
  CompatibilityIntro,
  CompatibilityTable,
} from './content/specs/compatibility';
import { CoresIntro, CoresTable } from './content/specs/cores';
import { MemoryIntro, MemoryTable } from './content/specs/memory';
import { ProcessorIntro, ProcessorTable } from './content/specs/processor';
import { ValueIntro, ValueTable } from './content/value';
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

  const title = getProductComparisonName(comparison);
  const keywords = [
    getProductName(comparison[0]),
    getProductName(comparison[1]),
    getProductComparisonName(comparison),
  ];
  const canonical = getProductComparisonPath(comparison);

  return (
    <ComparePageContext.Provider value={context}>
      <WebsiteLayout seo={{ title, keywords, canonical }}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href="/">Home</Breadcrumb>
          <Breadcrumb href="/gpus">GPUs</Breadcrumb>
          <Breadcrumb>{title}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap gap-8 justify-center">
          <section className="flex flex-wrap w-full">
            <h1 className="font-semibold">{title}</h1>

            <CompareProductsForm values={[gpu1.id, gpu2.id]} />
          </section>

          <article className="flex-1 flex flex-col gap-8">
            <section className="flex md:flex-wrap gap-8 justify-evenly">
              <div className="flex-1 flex flex-col gap-4 min-w-52.5 max-w-87.5">
                <div className="flex gap-2 items-center justify-between">
                  <h2 className="md:text-2xl text-3xl mb-0">
                    {getProductName(gpu1)}
                  </h2>

                  {shoppingUrl1 != null && (
                    <Button
                      href={shoppingUrl1}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="bg-green-500 text-white text-sm"
                    >
                      Buy
                    </Button>
                  )}
                </div>

                <ProductImages product={gpu1} />
              </div>

              <div className="flex-1 flex flex-col gap-4 min-w-52.5 max-w-87.5">
                <div className="flex gap-2 items-center justify-between">
                  <h2 className="md:text-2xl text-3xl mb-0">
                    {getProductName(gpu2)}
                  </h2>

                  {shoppingUrl2 && (
                    <Button
                      href={shoppingUrl2}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="bg-green-500 text-white text-sm"
                    >
                      Buy
                    </Button>
                  )}
                </div>

                <ProductImages product={gpu2} />
              </div>
            </section>

            <section className="-mb-4">
              <IntroParagraph />
            </section>

            <section>
              <h2 className="mb-0">General Info</h2>
              <GeneralInfoIntro />
              <GeneralInfoTable className="mb-4" />
            </section>

            <section>
              <h2 className="mb-0 font-semibold">Relative Performance</h2>
              <PerformanceIntro />
              <PerformanceTable className="mb-4" />
            </section>

            <section>
              <h2 className="mb-0 font-semibold">Relative Value</h2>
              <ValueIntro />
              <ValueTable className="mb-4" />
            </section>

            <section>
              <h2 className="mb-0">Benchmarks</h2>
              <BenchmarksIntro />
              <BenchmarksTable className="mb-4" />
            </section>

            <section className="flex flex-col gap-6">
              <h2 className="mb-0">Technical Specs</h2>

              <section>
                <h3 className="mb-0">Processor</h3>
                <ProcessorIntro />
                <ProcessorTable className="mb-4" />
              </section>

              <section>
                <h3 className="mb-0">Memory</h3>
                <MemoryIntro />
                <MemoryTable className="mb-4" />
              </section>

              <section>
                <h3 className="mb-0">Board Compatibility &amp; Dimensions</h3>
                <CompatibilityIntro />
                <CompatibilityTable className="mb-4" />
              </section>

              <section>
                <h3 className="mb-0">Cores &amp; Clock Speeds</h3>
                <CoresIntro />
                <CoresTable className="mb-4" />
              </section>

              <section>
                <h3 className="mb-0">API Support</h3>
                <ApiIntro />
                <ApiTable className="mb-4" />
              </section>
            </section>

            <section>
              <p className="text-xs">
                The ranks on this page considers the{' '}
                {contentData.totalPerformanceRatedGpus} GPUs that we track in
                our database. Check which graphics cards we are tracking on our{' '}
                <a href="/gpus">GPU list</a> page.
              </p>
            </section>
          </article>

          <Sidenav>
            <SidenavComparisons comparisons={relatedProducts.comparisons} />
            <SidenavProducts products={relatedProducts.gpus} />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ComparePageContext.Provider>
  );
};
