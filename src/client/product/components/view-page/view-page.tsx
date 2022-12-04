import {
  Breadcrumb,
  Breadcrumbs,
  Table,
  TBody,
} from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import {
  Sidenav,
  SidenavPopularComparisons,
  SidenavPopularProducts,
} from '@client/sidenav';
import {
  BoltIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { formatBenchmark } from '@shared/benchmark';
import { Product } from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import { formatSpec } from '@shared/spec';
import React, { useMemo } from 'react';
import { CompareProductsForm } from '../compare-products-form';
import { ProductImages } from '../product-images';
import { BenchmarkRow } from './benchmark-row';
import { CustomRow, CustomRowLabel, CustomRowValue } from './custom-row';
import {
  HighlightButton,
  HighlightLabel,
  HighlightList,
  HighlightListItem,
  HighlightValue,
} from './highlight-list';
import { createProductContextState, ProductContext } from './product-context';
import { ReviewRow } from './review-row';
import { SpecRow } from './spec-row';
import { Summary } from './summary';

export interface ViewGpuPageProps {
  gpu: Product;
}

export const ViewGpuPage = (props: ViewGpuPageProps) => {
  const { gpu } = props;

  const context = useMemo(() => createProductContextState(gpu), [gpu]);
  const specs = context.specs;
  const meta = context.metas;
  const benchmarks = context.benchmarks;
  const retailModels = context.metas.retailModels?.value;

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

  return (
    <ProductContext.Provider value={context}>
      <WebsiteLayout>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href="/">Home</Breadcrumb>
          <Breadcrumb href="/gpus">GPUs</Breadcrumb>
          <Breadcrumb>{gpu.name}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap justify-center gap-6">
          <section className="flex flex-col w-full">
            <h1 className="md:text-2xl text-3xl">{gpu.name}</h1>

            <CompareProductsForm values={[gpu.id]} />
          </section>

          <article className="flex-1 flex flex-col gap-6">
            <section className="flex flex-wrap justify-start gap-6">
              <ProductImages product={gpu} className="flex-1 min-w-80" />

              <HighlightList className="flex-1">
                <HighlightListItem>
                  <HighlightLabel icon={<ShoppingCartIcon />}>
                    Shop
                  </HighlightLabel>

                  <HighlightValue>
                    {retailModels != null && retailModels.length > 0 ? (
                      <HighlightButton
                        href={retailModels[0].amazonUrl}
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

            <Summary />

            <section>
              <h2>General Info</h2>

              <p className={classNames('text-content-dimmed')}>
                {`${gpu.name}'s`} performance rating, market segment, release
                date, and launch price.
              </p>

              <Table responsive>
                <TBody>
                  <CustomRow>
                    <CustomRowLabel>Performance Rating (Rank)</CustomRowLabel>
                    <CustomRowValue>
                      {benchmarks.performanceScore != null &&
                      meta.performanceRank != null ? (
                        <>
                          {formatBenchmark(benchmarks.performanceScore)} (
                          {formatProductMeta(meta.performanceRank)})
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
                      {benchmarks.valueScore != null &&
                      meta.valueRank != null ? (
                        <>
                          {formatBenchmark(benchmarks.valueScore)} (
                          {formatProductMeta(meta.valueRank)})
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
                What others are saying about {gpu.name}.
              </p>

              <Table responsive>
                <TBody>
                  <ReviewRow review="amazon" />
                  <ReviewRow review="pcGamer" />
                  <ReviewRow review="techRadar" />
                  <ReviewRow review="techSpot" />
                  <ReviewRow review="tomsHardware" />
                </TBody>
              </Table>
            </section>

            <section>
              <h2>Technical Specs</h2>

              <section>
                <h3>Processor</h3>

                <p className={classNames('text-content-dimmed')}>
                  {`${gpu.name}'s`} processor chip details.
                </p>

                <Table responsive>
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
                  {`${gpu.name}'s`} memory size, bandwidth, and clock speeds.
                </p>

                <Table responsive>
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
                  {`${gpu.name}'s`} dimensions, bus interface, power
                  consumption, and output ports.
                </p>

                <Table responsive>
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
                  {`${gpu.name}'s`} cores, clock speed, and cache.
                </p>

                <Table responsive>
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
                  {`${gpu.name}'s`} computational performance like pixel fill
                  rate, texture fill rate, and floating-point operations per
                  second.
                </p>

                <Table responsive>
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
                {`${gpu.name}'s`} performance and rating metrics. These identify
                how strong the GPU performs compared to its peers.
              </p>

              <Table responsive>
                <TBody>
                  <BenchmarkRow benchmark="g3dMark" />
                  <BenchmarkRow benchmark="g2dMark" />
                  <BenchmarkRow benchmark="timeSpyGraphics" />
                </TBody>
              </Table>
            </section>
          </article>

          <Sidenav>
            <SidenavPopularProducts />
            <SidenavPopularComparisons />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ProductContext.Provider>
  );
};
