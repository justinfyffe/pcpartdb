import {
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
        <Breadcrumbs className="mb-4">
          <Breadcrumb href="/">Home</Breadcrumb>
          <Breadcrumb href="/gpus">GPUs</Breadcrumb>
          <Breadcrumb>{pageTitle}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap gap-8 justify-center">
          <section className="flex flex-wrap w-full">
            <h1 className="font-semibold">{pageTitle}</h1>

            <CompareProductsForm values={[gpu1.id, gpu2.id]} />
          </section>

          <article className="flex-1 flex flex-col gap-8">
            <section className="flex md:flex-wrap gap-8 justify-evenly">
              <div className="flex-1 flex flex-col gap-4 min-w-52.5 max-w-87.5">
                <div className="flex gap-2 items-center justify-between">
                  <h2 className="md:text-2xl text-3xl mb-0">{gpu1.name}</h2>

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

              <div className="flex-1 flex flex-col gap-4 min-w-52.5 max-w-87.5">
                <div className="flex gap-2 items-center justify-between">
                  <h2 className="md:text-2xl text-3xl mb-0">{gpu2.name}</h2>

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
              <section>
                <h2>General Info</h2>

                <p className={classNames('text-content-dimmed')}>
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
              </section>

              <section>
                <h2>Reviews</h2>

                <p className={classNames('text-content-dimmed')}>
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
              </section>

              <section className="flex flex-col gap-6">
                <h2>Technical Specs</h2>

                <section>
                  <h3>Processor</h3>

                  <p className={classNames('text-content-dimmed')}>
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
                </section>

                <section>
                  <h3>Memory</h3>

                  <p className={classNames('text-content-dimmed')}>
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
                </section>

                <section>
                  <h3>Board Compatibility &amp; Dimensions</h3>

                  <p className={classNames('text-content-dimmed')}>
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
                </section>

                <section>
                  <h3>Cores &amp; Clock Speeds</h3>

                  <p className={classNames('text-content-dimmed')}>
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
                </section>

                <section>
                  <h3>Theoretical Performance</h3>

                  <p className={classNames('text-content-dimmed')}>
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
                </section>

                <section>
                  <h3>API Support</h3>

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
                </section>
              </section>

              <section>
                <h2>Benchmarks</h2>

                <p className={classNames('text-content-dimmed')}>
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
              </section>
            </section>
          </article>

          <Sidenav>
            <SidenavPopularComparisons />
            <SidenavPopularProducts />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ProductsContext.Provider>
  );
};
