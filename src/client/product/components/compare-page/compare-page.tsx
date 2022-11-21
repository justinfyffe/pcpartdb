import {
  Article,
  ArticleHeader,
  Breadcrumb,
  Breadcrumbs,
  Button,
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import {
  Sidenav,
  SidenavPopularComparisons,
  SidenavPopularProducts,
} from '@client/sidenav';
import { formatBenchmark } from '@shared/benchmark';
import { Product } from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import React, { useMemo } from 'react';
import { CompareProductsForm } from '../compare-products-form';
import { ProductImages } from '../product-images';
import { BenchmarkRow } from './benchmark-row';
import { CustomRow, CustomRowLabel, CustomRowValue } from './custom-row';
import {
  createProductsContextState,
  ProductsContext,
} from './products-context';
import { ReviewRow } from './review-row';
import { SpecRow } from './spec-row';
import { Summary } from './summary';

export interface CompareGpuPageProps {
  gpus: Product[];
}

export const CompareGpuPage = (props: CompareGpuPageProps) => {
  const { gpus } = props;
  console.log(gpus);

  const gpu1 = gpus[0];
  const gpu2 = gpus[1];

  const context = useMemo(
    () => createProductsContextState([gpu1, gpu2]),
    [gpu1, gpu2],
  );

  const meta1 = context.meta[0];
  const benchmarks1 = context.benchmarks[0];
  const meta2 = context.meta[1];
  const benchmarks2 = context.benchmarks[1];

  const pageTitle = `${gpu1.name} vs ${gpu2.name}`;

  return (
    <ProductsContext.Provider value={context}>
      <WebsiteLayout>
        <Article className="flex flex-wrap gap-6 lg:gap-8 justify-center">
          <ArticleHeader className="flex flex-wrap w-full items-center justify-between gap-3 lg:gap-4">
            <Breadcrumbs className="mb-3">
              <Breadcrumb href="/">Home</Breadcrumb>
              <Breadcrumb href="/gpus">GPUs</Breadcrumb>
              <Breadcrumb>{pageTitle}</Breadcrumb>
            </Breadcrumbs>

            <h1>{pageTitle}</h1>

            <CompareProductsForm values={[gpu1.id, gpu2.id]} />
          </ArticleHeader>

          <article className="flex-1 flex flex-col gap-6 max-w-full">
            <section className="flex flex-wrap gap-4 md:flex-nowrap justify-between">
              <div className="flex flex-col gap-3 flex-1 min-w-[210px] max-w-[350px]">
                <div className="flex items-center justify-between">
                  <h2 className="self-start text-2xl font-medium">
                    {gpu1.name}
                  </h2>
                  <Button
                    target="_blank"
                    rel="noreferrer noopener"
                    className="bg-green-500 text-white text-sm"
                  >
                    Buy
                  </Button>
                </div>

                <ProductImages product={gpu1} />
              </div>

              <div className="flex flex-col gap-3 flex-1 min-w-[210px] max-w-[350px]">
                <div className="flex items-center justify-between">
                  <h2 className="self-start text-2xl font-medium">
                    {gpu2.name}
                  </h2>
                  <Button
                    target="_blank"
                    rel="noreferrer noopener"
                    className="bg-green-500 text-white text-sm"
                  >
                    Buy
                  </Button>
                </div>

                <ProductImages product={gpu2} />
              </div>
            </section>

            <section>
              <Summary />
            </section>

            <section className="flex flex-col gap-6">
              <article>
                <h2 className="mb-4">General Info</h2>

                <p className={classNames('text-content-secondary')}>
                  Performance rating, market segment, release date, and launch
                  price for {gpu1.name} and {gpu2.name}.
                </p>

                <Table responsive>
                  <THead>
                    <Tr>
                      <Th></Th>
                      <Th>{gpu1.name}</Th>
                      <Th>{gpu2.name}</Th>
                    </Tr>
                  </THead>
                  <TBody>
                    <CustomRow>
                      <CustomRowLabel>Shop</CustomRowLabel>
                      <CustomRowValue>
                        <a
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-green-600 font-bold"
                        >
                          Check Price
                        </a>
                      </CustomRowValue>
                      <CustomRowValue>
                        <a
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-green-600 font-bold"
                        >
                          Check Price
                        </a>
                      </CustomRowValue>
                    </CustomRow>
                    <CustomRow>
                      <CustomRowLabel>Performance Rating (Rank)</CustomRowLabel>
                      <CustomRowValue>
                        {benchmarks1.performanceScore != null &&
                        meta1.performanceRank != null ? (
                          <>
                            {formatBenchmark(benchmarks1.performanceScore)} (
                            {formatProductMeta(meta1.performanceRank)})
                          </>
                        ) : (
                          <>--</>
                        )}
                      </CustomRowValue>
                      <CustomRowValue>
                        {benchmarks2.performanceScore != null &&
                        meta2.performanceRank != null ? (
                          <>
                            {formatBenchmark(benchmarks2.performanceScore)} (
                            {formatProductMeta(meta2.performanceRank)})
                          </>
                        ) : (
                          <>--</>
                        )}
                      </CustomRowValue>
                    </CustomRow>
                    <CustomRow>
                      <CustomRowLabel>
                        Performance Per Dollar (Rank)
                      </CustomRowLabel>
                      <CustomRowValue>
                        {benchmarks1.valueScore != null &&
                        meta1.valueRank != null ? (
                          <>
                            {formatBenchmark(benchmarks1.valueScore)} (
                            {formatProductMeta(meta1.valueRank)})
                          </>
                        ) : (
                          <>--</>
                        )}
                      </CustomRowValue>
                      <CustomRowValue>
                        {benchmarks2.valueScore != null &&
                        meta2.valueRank != null ? (
                          <>
                            {formatBenchmark(benchmarks2.valueScore)} (
                            {formatProductMeta(meta2.valueRank)})
                          </>
                        ) : (
                          <>--</>
                        )}
                      </CustomRowValue>
                    </CustomRow>
                    <SpecRow spec="company" />
                    <SpecRow spec="marketSegment" />
                    <SpecRow spec="releaseDate" />
                    <SpecRow spec="launchPrice" />
                  </TBody>
                </Table>
              </article>

              <article>
                <h2 className="mb-4">Reviews</h2>

                <p className={classNames('text-content-secondary')}>
                  What others are saying about {gpu1.name} and {gpu2.name}.
                </p>

                <Table responsive>
                  <THead>
                    <Tr>
                      <Th></Th>
                      <Th>{gpu1.name}</Th>
                      <Th>{gpu2.name}</Th>
                    </Tr>
                  </THead>
                  <TBody>
                    <ReviewRow review="amazon" />
                    <ReviewRow review="pcGamer" />
                    <ReviewRow review="techRadar" />
                    <ReviewRow review="techSpot" />
                    <ReviewRow review="tomsHardware" />
                  </TBody>
                </Table>
              </article>

              <article className="flex flex-col gap-6">
                <h2 className="mb-4">Technical Specs</h2>

                <article>
                  <h3 className="mb-4">Processor</h3>

                  <p className={classNames('text-content-secondary')}>
                    Processor chip details for {gpu1.name} and {gpu2.name}
                  </p>

                  <Table responsive>
                    <THead>
                      <Tr>
                        <Th></Th>
                        <Th>{gpu1.name}</Th>
                        <Th>{gpu2.name}</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      <SpecRow spec="gpuName" />
                      <SpecRow spec="architecture" />
                      <SpecRow spec="processSize" />
                      <SpecRow spec="transistors" />
                    </TBody>
                  </Table>
                </article>

                <article>
                  <h3 className="mb-4">Memory</h3>

                  <p className={classNames('text-content-secondary')}>
                    Memory size, bandwidth, and clock speeds for {gpu1.name} and{' '}
                    {gpu2.name}.
                  </p>

                  <Table responsive>
                    <THead>
                      <Tr>
                        <Th></Th>
                        <Th>{gpu1.name}</Th>
                        <Th>{gpu2.name}</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      <SpecRow spec="memorySize" />
                      <SpecRow spec="memoryType" />
                      <SpecRow spec="memoryBandwidth" />
                      <SpecRow spec="memoryClock" />
                      <SpecRow spec="memoryInterface" />
                    </TBody>
                  </Table>
                </article>

                <article>
                  <h3 className="mb-4">Board Compatibility &amp; Dimensions</h3>

                  <p className={classNames('text-content-secondary')}>
                    Dimensions, bus interface, power consumption, and output
                    ports for {gpu1.name} and {gpu2.name}
                  </p>

                  <Table responsive>
                    <THead>
                      <Tr>
                        <Th></Th>
                        <Th>{gpu1.name}</Th>
                        <Th>{gpu2.name}</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      <SpecRow spec="slotWidth" />
                      <SpecRow spec="length" />
                      <SpecRow spec="width" />
                      <SpecRow spec="height" />
                      <SpecRow spec="weight" />
                      <SpecRow spec="busInterface" />
                      <SpecRow spec="thermalDesignPower" />
                      <SpecRow spec="suggestedPsu" />
                      <SpecRow spec="powerConnectors" />
                      <SpecRow spec="outputs" />
                    </TBody>
                  </Table>
                </article>

                <article>
                  <h3 className="mb-4">Cores &amp; Clock Speeds</h3>

                  <p className={classNames('text-content-secondary')}>
                    Cores, clock speed, and cache for {gpu1.name} and{' '}
                    {gpu2.name}
                  </p>

                  <Table responsive>
                    <THead>
                      <Tr>
                        <Th></Th>
                        <Th>{gpu1.name}</Th>
                        <Th>{gpu2.name}</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      <SpecRow spec="shaderUnitsCudaCores" />
                      <SpecRow spec="textureMappingUnits" />
                      <SpecRow spec="renderOutputUnits" />
                      <SpecRow spec="tensorCores" />
                      <SpecRow spec="rayTracingCores" />
                      <SpecRow spec="coreClockSpeedBase" />
                      <SpecRow spec="coreClockSpeedBoost" />
                      <SpecRow spec="l1Cache" />
                      <SpecRow spec="l2Cache" />
                    </TBody>
                  </Table>
                </article>

                <article>
                  <h3 className="mb-4">Theoretical Performance</h3>

                  <p className={classNames('text-content-secondary')}>
                    Computational performance like pixel fill rate, texture fill
                    rate, and floating-point operations per second for the{' '}
                    {gpu1.name} and {gpu2.name}.
                  </p>

                  <Table responsive>
                    <THead>
                      <Tr>
                        <Th></Th>
                        <Th>{gpu1.name}</Th>
                        <Th>{gpu2.name}</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      <SpecRow spec="pixelFillRate" />
                      <SpecRow spec="textureFillRate" />
                      <SpecRow spec="fp32Performance" />
                      <SpecRow spec="fp64Performance" />
                    </TBody>
                  </Table>
                </article>

                <article>
                  <h3 className="mb-4">API Support</h3>

                  <Table responsive>
                    <THead>
                      <Tr>
                        <Th></Th>
                        <Th>{gpu1.name}</Th>
                        <Th>{gpu2.name}</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      <SpecRow spec="directXVersion" />
                      <SpecRow spec="openClVersion" />
                      <SpecRow spec="openGlVersion" />
                      <SpecRow spec="shaderModelVersion" />
                      <SpecRow spec="gSyncFreeSyncSupport" />
                      <SpecRow spec="sliCrossfireSupport" />
                    </TBody>
                  </Table>
                </article>
              </article>

              <article>
                <h2 className="mb-4">Benchmarks</h2>

                <p className={classNames('text-content-secondary')}>
                  Performance and rating metrics for {gpu1.name} and {gpu2.name}
                  . These identify how strong the GPU performs compared to its
                  peers.
                </p>

                <Table responsive>
                  <THead>
                    <Tr>
                      <Th></Th>
                      <Th>{gpu1.name}</Th>
                      <Th>{gpu2.name}</Th>
                    </Tr>
                  </THead>
                  <TBody>
                    <BenchmarkRow benchmark="g3dMark" />
                    <BenchmarkRow benchmark="g2dMark" />
                    <BenchmarkRow benchmark="timeSpyGraphics" />
                  </TBody>
                </Table>
              </article>
            </section>
          </article>

          <Sidenav>
            <SidenavPopularComparisons />
            <SidenavPopularProducts />
          </Sidenav>
        </Article>
      </WebsiteLayout>
    </ProductsContext.Provider>
  );
};
