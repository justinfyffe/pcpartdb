import { getProductName, getViewGpuSlug } from '@client/product';
import { useProductCache } from '@client/shared/cache';
import { Breadcrumb, Breadcrumbs } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { getViewGpuPath } from '@client/shared/website';
import { Sidenav, SidenavComparisons, SidenavProducts } from '@client/sidenav';
import {
  BoltIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { Product, RelatedProducts } from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import { getShoppingUrl } from '@shared/retail-model';
import { formatSpec } from '@shared/spec';
import React, { useMemo } from 'react';
import { CompareProductsForm } from '../compare-products-form';
import { ProductImages } from '../product-images';
import { BenchmarksIntro, BenchmarksTable } from './content/benchmarks';
import { GeneralInfoIntro, GeneralInfoTable } from './content/general-info';
import { IntroParagraph } from './content/intro';
import {
  PerformanceArchitectureTable,
  PerformanceIntro,
  PerformanceYearTable,
} from './content/performance';
import { ApiIntro, ApiTable } from './content/specs/api';
import {
  CompatibilityIntro,
  CompatibilityTable,
} from './content/specs/compatibility';
import { CoresIntro, CoresTable } from './content/specs/cores';
import { MemoryIntro, MemoryTable } from './content/specs/memory';
import { ProcessorIntro, ProcessorTable } from './content/specs/processor';
import {
  ValueArchitectureTable,
  ValueIntro,
  ValueYearTable,
} from './content/value';
import { createViewPageContextState, ViewPageContext } from './context';
import {
  HighlightButton,
  HighlightLabel,
  HighlightList,
  HighlightListItem,
  HighlightValue,
} from './highlight-list';
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
  const specs = gpu.specs;
  const meta = gpu.metas;

  const title = getProductName(gpu);
  const canonical = getViewGpuPath(getViewGpuSlug(gpu));
  const keywords = [getProductName(gpu)];

  const highlightMemory = useMemo(() => {
    const memorySize = formatSpec(specs.memorySize);
    const memoryType = formatSpec(specs.memoryType);
    return [memorySize, memoryType].filter((value) => value != null).join(' ');
  }, [specs]);

  const highlightSlots = useMemo(() => {
    const slotWidth = formatSpec(specs.slotWidth);
    const height = formatSpec(specs.height);
    return [slotWidth, height].filter((value) => value != null).join(', ');
  }, [specs]);

  const shoppingUrl = useMemo(() => getShoppingUrl(gpu), [gpu]);

  return (
    <ViewPageContext.Provider value={context}>
      <WebsiteLayout seo={{ title, canonical, keywords }}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href="/">Home</Breadcrumb>
          <Breadcrumb href="/gpus">GPUs</Breadcrumb>
          <Breadcrumb>{title}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap justify-center gap-8">
          <section className="flex flex-col w-full">
            <h1 className="md:text-2xl text-3xl">{title}</h1>

            <CompareProductsForm values={[gpu.id]} />
          </section>

          <article className="flex-1 flex flex-col gap-8">
            <section className="flex flex-wrap justify-start gap-8">
              <ProductImages product={gpu} className="flex-1 min-w-80" />

              <HighlightList className="flex-1">
                <HighlightListItem>
                  <HighlightLabel icon={<ShoppingCartIcon />}>
                    Shop
                  </HighlightLabel>

                  <HighlightValue>
                    {shoppingUrl != null ? (
                      <HighlightButton
                        href={shoppingUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="bg-green-500 text-white"
                      >
                        Check Price
                      </HighlightButton>
                    ) : (
                      <>--</>
                    )}
                  </HighlightValue>
                </HighlightListItem>

                <HighlightListItem>
                  <HighlightLabel icon={<StarIcon />}>
                    Performance Rank
                  </HighlightLabel>

                  <HighlightValue>
                    {formatProductMeta(meta.performanceRank) || '--'}
                  </HighlightValue>
                </HighlightListItem>

                <HighlightListItem>
                  <HighlightLabel icon={<CurrencyDollarIcon />}>
                    Value Rank
                  </HighlightLabel>

                  <HighlightValue>
                    {formatProductMeta(meta.valueRank) || '--'}
                  </HighlightValue>
                </HighlightListItem>

                <HighlightListItem>
                  <HighlightLabel icon={<CircleStackIcon />}>
                    Memory
                  </HighlightLabel>

                  <HighlightValue>{highlightMemory}</HighlightValue>
                </HighlightListItem>

                <HighlightListItem>
                  <HighlightLabel icon={<CubeTransparentIcon />}>
                    Slots
                  </HighlightLabel>

                  <HighlightValue>{highlightSlots}</HighlightValue>
                </HighlightListItem>

                <HighlightListItem>
                  <HighlightLabel icon={<BoltIcon />}>TDP</HighlightLabel>

                  <HighlightValue>
                    {formatSpec(specs.thermalDesignPower) || '--'}
                  </HighlightValue>
                </HighlightListItem>

                <HighlightListItem>
                  <HighlightLabel icon={<CalendarDaysIcon />}>
                    Release Date
                  </HighlightLabel>

                  <HighlightValue>
                    {formatSpec(specs.releaseDate) || '--'}
                  </HighlightValue>
                </HighlightListItem>
              </HighlightList>
            </section>

            <section className="-mb-4">
              <IntroParagraph />
            </section>

            <section>
              <h2 className="mb-0 font-semibold">General Info</h2>
              <GeneralInfoIntro />
              <GeneralInfoTable className="mb-4" />
            </section>

            <section>
              <h2 className="mb-0 font-semibold">Relative Performance</h2>
              <PerformanceIntro />

              <section className="flex flex-wrap gap-8 mb-4">
                <div className="flex-1">
                  <PerformanceYearTable />
                </div>

                <div className="flex-1">
                  <PerformanceArchitectureTable />
                </div>
              </section>
            </section>

            <section>
              <h2 className="mb-0 font-semibold">Relative Value</h2>
              <ValueIntro />

              <section className="flex flex-wrap gap-8 mb-4">
                <div className="flex-1">
                  <ValueYearTable />
                </div>

                <div className="flex-1">
                  <ValueArchitectureTable />
                </div>
              </section>
            </section>

            <section>
              <h2 className="mb-0 font-semibold">Benchmarks</h2>
              <BenchmarksIntro />
              <BenchmarksTable className="mb-4" />
            </section>

            <section className="flex flex-col gap-6">
              <h2 className="mb-0 font-semibold">Technical Specs</h2>

              <section>
                <h3 className="mb-0">Processor</h3>
                <ProcessorIntro />
                <ProcessorTable className="mb-4" />
              </section>

              <section>
                <h3 className="mb-0">Board Compatibility &amp; Dimensions</h3>
                <CompatibilityIntro />
                <CompatibilityTable className="mb-4" />
              </section>

              <section>
                <h3 className="mb-0">Memory</h3>
                <MemoryIntro />
                <MemoryTable className="mb-4" />
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
            <SidenavProducts products={relatedProducts.gpus} />
            <SidenavComparisons comparisons={relatedProducts.comparisons} />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ViewPageContext.Provider>
  );
};
