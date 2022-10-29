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
import { BenchmarkKey, formatBenchmark } from '@shared/benchmark';
import { Product } from '@shared/product';
import { formatProductMeta, ProductMetaKey } from '@shared/product-meta';
import { ReviewKey } from '@shared/review';
import { formatSpec, SpecKey } from '@shared/spec';
import { NextPageContext } from 'next';
import React, { useMemo } from 'react';
import { productService } from '../../product-service';
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

interface ViewGpuPageProps {
  gpu: Product;
}

export const ViewGpuPage = (props: ViewGpuPageProps) => {
  const { gpu } = props;

  const context = useMemo(() => createProductContextState(gpu), [gpu]);
  const specs = context.specs;
  const meta = context.meta;
  const benchmarks = context.benchmarks;

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
                      <HighlightButton className="bg-green-500 text-white">
                        Check Price
                      </HighlightButton>
                    </HighlightValue>
                  </HighlightListItem>

                  <HighlightListItem>
                    <HighlightLabel icon={<StarIcon />}>
                      Performance Rank
                    </HighlightLabel>

                    <HighlightValue>
                      {formatProductMeta(meta[ProductMetaKey.PerformanceRank])}
                    </HighlightValue>
                  </HighlightListItem>

                  <HighlightListItem>
                    <HighlightLabel icon={<CurrencyDollarIcon />}>
                      Value Rank
                    </HighlightLabel>

                    <HighlightValue>
                      {formatProductMeta(meta[ProductMetaKey.ValueRank])}
                    </HighlightValue>
                  </HighlightListItem>

                  <HighlightListItem>
                    <HighlightLabel icon={<CircleStackIcon />}>
                      Memory
                    </HighlightLabel>

                    <HighlightValue>
                      {formatSpec(specs[SpecKey.MemorySize])}{' '}
                      {formatSpec(specs[SpecKey.MemoryType])}
                    </HighlightValue>
                  </HighlightListItem>

                  <HighlightListItem>
                    <HighlightLabel icon={<CubeTransparentIcon />}>
                      Dimensions
                    </HighlightLabel>

                    <HighlightValue>
                      {formatSpec(specs[SpecKey.Length], {
                        suffix: false,
                      })}
                      {' x '}
                      {formatSpec(specs[SpecKey.Width], {
                        suffix: false,
                      })}
                      {' x '}
                      {formatSpec(specs[SpecKey.Height], {
                        suffix: false,
                      })}{' '}
                      mm
                    </HighlightValue>
                  </HighlightListItem>

                  <HighlightListItem>
                    <HighlightLabel icon={<BoltIcon />}>TDP</HighlightLabel>

                    <HighlightValue>
                      {formatSpec(specs[SpecKey.ThermalDesignPower])}
                    </HighlightValue>
                  </HighlightListItem>

                  <HighlightListItem>
                    <HighlightLabel icon={<CalendarDaysIcon />}>
                      Release Date
                    </HighlightLabel>

                    <HighlightValue>
                      {formatSpec(specs[SpecKey.ReleaseDate])}
                    </HighlightValue>
                  </HighlightListItem>
                </HighlightList>
              </div>
            </section>

            <section>
              <Summary />
            </section>

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
                        {formatBenchmark(
                          benchmarks[BenchmarkKey.PerformanceScore],
                        )}{' '}
                        (
                        {formatProductMeta(
                          meta[ProductMetaKey.PerformanceRank],
                        )}
                        )
                      </CustomRowValue>
                    </CustomRow>
                    <CustomRow>
                      <CustomRowLabel>
                        Performance Per Dollar (Rank)
                      </CustomRowLabel>
                      <CustomRowValue>
                        {formatBenchmark(benchmarks[BenchmarkKey.ValueScore])} (
                        {formatProductMeta(meta[ProductMetaKey.ValueRank])})
                      </CustomRowValue>
                    </CustomRow>
                    <SpecRow spec={SpecKey.Company} />
                    <SpecRow spec={SpecKey.MarketSegment} />
                    <SpecRow spec={SpecKey.ReleaseDate} />
                    <SpecRow spec={SpecKey.LaunchPriceMsrp} />
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
                    <ReviewRow review={ReviewKey.Amazon} />
                    <ReviewRow review={ReviewKey.PcGamer} />
                    <ReviewRow review={ReviewKey.TechRadar} />
                    <ReviewRow review={ReviewKey.TechSpot} />
                    <ReviewRow review={ReviewKey.TomsHardware} />
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
                      <SpecRow spec={SpecKey.GpuName} />
                      <SpecRow spec={SpecKey.Architecture} />
                      <SpecRow spec={SpecKey.ProcessSize} />
                      <SpecRow spec={SpecKey.Transistors} />
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
                      <SpecRow spec={SpecKey.MemorySize} />
                      <SpecRow spec={SpecKey.MemoryType} />
                      <SpecRow spec={SpecKey.MemoryBandwidth} />
                      <SpecRow spec={SpecKey.MemoryClock} />
                      <SpecRow spec={SpecKey.MemoryInterface} />
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
                      <SpecRow spec={SpecKey.SlotWidth} />
                      <SpecRow spec={SpecKey.Length} />
                      <SpecRow spec={SpecKey.Width} />
                      <SpecRow spec={SpecKey.Height} />
                      <SpecRow spec={SpecKey.Weight} />
                      <SpecRow spec={SpecKey.BusInterface} />
                      <SpecRow spec={SpecKey.ThermalDesignPower} />
                      <SpecRow spec={SpecKey.SuggestedPsu} />
                      <SpecRow spec={SpecKey.PowerConnectors} />
                      <SpecRow spec={SpecKey.Outputs} />
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
                      <SpecRow spec={SpecKey.ShaderUnitsCudaCores} />
                      <SpecRow spec={SpecKey.TextureMappingUnits} />
                      <SpecRow spec={SpecKey.RenderOutputUnits} />
                      <SpecRow spec={SpecKey.TensorCores} />
                      <SpecRow spec={SpecKey.RayTracingCores} />
                      <SpecRow spec={SpecKey.CoreClockSpeedBase} />
                      <SpecRow spec={SpecKey.CoreClockSpeedBoost} />
                      <SpecRow spec={SpecKey.L1Cache} />
                      <SpecRow spec={SpecKey.L2Cache} />
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
                      <SpecRow spec={SpecKey.PixelFillRate} />
                      <SpecRow spec={SpecKey.TextureFillRate} />
                      <SpecRow spec={SpecKey.Fp32Performance} />
                      <SpecRow spec={SpecKey.Fp64Performance} />
                    </TBody>
                  </Table>
                </section>

                <section>
                  <h3 className="mb-3">API Support</h3>

                  <Table responsive>
                    <TBody>
                      <SpecRow spec={SpecKey.DirectXVersion} />
                      <SpecRow spec={SpecKey.OpenClVersion} />
                      <SpecRow spec={SpecKey.OpenGlVersion} />
                      <SpecRow spec={SpecKey.ShaderModelVersion} />
                      <SpecRow spec={SpecKey.GSyncFreeSyncSupport} />
                      <SpecRow spec={SpecKey.SliCrossfireSupport} />
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
                    <BenchmarkRow benchmark={BenchmarkKey.G3dMark} />
                    <BenchmarkRow benchmark={BenchmarkKey.G2dMark} />
                    <BenchmarkRow benchmark={BenchmarkKey.TimeSpyGraphics} />
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

ViewGpuPage.getInitialProps = async (ctx: NextPageContext) => {
  const { slug } = ctx.query as { slug: string };
  const gpu = await productService.get(slug);

  return { gpu };
};
