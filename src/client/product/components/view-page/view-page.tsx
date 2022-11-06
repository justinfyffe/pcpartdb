import {
  Article,
  ArticleHeader,
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
  const retailModels = context.metas.retailModels.value;

  return (
    <ProductContext.Provider value={context}>
      <WebsiteLayout>
        <Article className="flex flex-wrap gap-6 lg:gap-8 justify-center">
          <ArticleHeader className="flex flex-wrap w-full items-center justify-between gap-3 lg:gap-4">
            <Breadcrumbs className="mb-3">
              <Breadcrumb href="/">Home</Breadcrumb>
              <Breadcrumb href="/gpus">GPUs</Breadcrumb>
              <Breadcrumb>{gpu.name}</Breadcrumb>
            </Breadcrumbs>

            <h1>{gpu.name}</h1>

            <CompareProductsForm values={[gpu.id]} />
          </ArticleHeader>

          <section className="flex-1 flex flex-col gap-6">
            <section className="flex flex-wrap justify-start gap-6 lg:gap-8">
              <div className="flex-1 min-w-[300px]">
                <ProductImages product={gpu} />
              </div>

              <div className="flex-1">
                <HighlightList>
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

                    <HighlightValue>
                      {formatSpec(specs.memorySize)}{' '}
                      {formatSpec(specs.memoryType)}
                    </HighlightValue>
                  </HighlightListItem>

                  <HighlightListItem>
                    <HighlightLabel icon={<CubeTransparentIcon />}>
                      Dimensions
                    </HighlightLabel>

                    <HighlightValue>
                      {formatSpec(specs.length, {
                        suffix: false,
                      })}
                      {' x '}
                      {formatSpec(specs.width, {
                        suffix: false,
                      })}
                      {' x '}
                      {formatSpec(specs.height, {
                        suffix: false,
                      })}{' '}
                      mm
                    </HighlightValue>
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
              </div>
            </section>

            <Summary />

            <section className="flex flex-col gap-6">
              <section>
                <h2 className="mb-3">General Info</h2>

                <p className={classNames('text-content-secondary')}>
                  {`${gpu.name}'s`} performance rating, market segment, release
                  date, and launch price.
                </p>

                <Table responsive>
                  <TBody>
                    <CustomRow>
                      <CustomRowLabel>Performance Rating (Rank)</CustomRowLabel>
                      <CustomRowValue>
                        <>
                          {formatBenchmark(benchmarks.performanceScore)} (
                          {formatProductMeta(meta.performanceRank)})
                        </>
                      </CustomRowValue>
                    </CustomRow>
                    <CustomRow>
                      <CustomRowLabel>
                        Performance Per Dollar (Rank)
                      </CustomRowLabel>
                      <CustomRowValue>
                        <>
                          {formatBenchmark(benchmarks.valueScore)} (
                          {formatProductMeta(meta.valueRank)})
                        </>
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
                <h2 className="mb-3">Reviews</h2>

                <p className={classNames('text-content-secondary')}>
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
                <h2 className="mb-6">Technical Specs</h2>

                <section>
                  <h3 className="mb-3">Processor</h3>

                  <p className={classNames('text-content-secondary')}>
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
                  <h3 className="mb-3">Memory</h3>

                  <p className={classNames('text-content-secondary')}>
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
                  <h3 className="mb-3">Board Compatibility &amp; Dimensions</h3>

                  <p className={classNames('text-content-secondary')}>
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
                  <h3 className="mb-3">Cores &amp; Clock Speeds</h3>

                  <p className={classNames('text-content-secondary')}>
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
                  <h3 className="mb-3">Theoretical Performance</h3>

                  <p className={classNames('text-content-secondary')}>
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
                  <h3 className="mb-3">API Support</h3>

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
                <h2 className="mb-3">Benchmarks</h2>

                <p className={classNames('text-content-secondary')}>
                  {`${gpu.name}'s`} performance and rating metrics. These
                  identify how strong the GPU performs compared to its peers.
                </p>

                <Table responsive>
                  <TBody>
                    <BenchmarkRow benchmark="g3dMark" />
                    <BenchmarkRow benchmark="g2dMark" />
                    <BenchmarkRow benchmark="timeSpyGraphics" />
                  </TBody>
                </Table>
              </section>
            </section>
          </section>

          <Sidenav>
            <SidenavPopularProducts />
            <SidenavPopularComparisons />
          </Sidenav>
        </Article>
      </WebsiteLayout>
    </ProductContext.Provider>
  );
};
