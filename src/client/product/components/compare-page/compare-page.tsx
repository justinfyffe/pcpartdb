import {
  Article,
  ArticleHeader,
  Breadcrumb,
  Breadcrumbs,
  Table,
  TBody,
  Td,
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
import { BenchmarkKey, formatBenchmark } from '@shared/benchmark';
import { Product } from '@shared/product';
import { formatProductMeta, ProductMetaKey } from '@shared/product-meta';
import { ReviewKey } from '@shared/review';
import { SpecKey } from '@shared/spec';
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
              <Breadcrumb href="/">PC Parts DB</Breadcrumb>
              <Breadcrumb href="/gpus">GPUs</Breadcrumb>
              <Breadcrumb>{pageTitle}</Breadcrumb>
            </Breadcrumbs>

            <h1>{pageTitle}</h1>

            <CompareProductsForm values={[gpu1.id, gpu2.id]} />
          </ArticleHeader>

          <article className="flex-1 flex flex-col gap-6 max-w-full">
            <section className="flex flex-wrap gap-4 md:flex-nowrap justify-between">
              <div className="flex flex-col gap-3 flex-1 min-w-[210px] max-w-[350px]">
                <h2 className="self-start text-2xl font-medium">{gpu1.name}</h2>
                <ProductImages product={gpu1} />
              </div>

              <div className="flex flex-col gap-3 flex-1 min-w-[210px] max-w-[350px]">
                <h2 className="self-start text-2xl font-medium">{gpu2.name}</h2>
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
                      <CustomRowLabel>Performance Rating (Rank)</CustomRowLabel>
                      <CustomRowValue>
                        {formatBenchmark(
                          benchmarks1[BenchmarkKey.PerformanceScore],
                        )}{' '}
                        (
                        {formatProductMeta(
                          meta1[ProductMetaKey.PerformanceRank],
                        )}
                        )
                      </CustomRowValue>
                      <CustomRowValue>
                        {formatBenchmark(
                          benchmarks2[BenchmarkKey.PerformanceScore],
                        )}{' '}
                        (
                        {formatProductMeta(
                          meta2[ProductMetaKey.PerformanceRank],
                        )}
                        )
                      </CustomRowValue>
                    </CustomRow>
                    <CustomRow>
                      <CustomRowLabel>
                        Performance Per Dollar (Rank)
                      </CustomRowLabel>
                      <CustomRowValue>
                        {formatBenchmark(benchmarks1[BenchmarkKey.ValueScore])}{' '}
                        ({formatProductMeta(meta1[ProductMetaKey.ValueRank])})
                      </CustomRowValue>
                      <CustomRowValue>
                        {formatBenchmark(benchmarks2[BenchmarkKey.ValueScore])}{' '}
                        ({formatProductMeta(meta2[ProductMetaKey.ValueRank])})
                      </CustomRowValue>
                    </CustomRow>
                    <Tr>
                      <Td>Company</Td>
                      <Td>NVIDIA</Td>
                      <Td>NVIDIA</Td>
                    </Tr>
                    <Tr>
                      <Td>Market Segment</Td>
                      <Td>Desktop</Td>
                      <Td>Desktop</Td>
                    </Tr>
                    <Tr>
                      <Td>Release Date</Td>
                      <Td>Q4 2022</Td>
                      <Td>Q3 2022</Td>
                    </Tr>
                    <Tr>
                      <Td>Launch Price (MSRP)</Td>
                      <Td>$1,499</Td>
                      <Td>$999</Td>
                    </Tr>
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
                    <ReviewRow review={ReviewKey.Amazon} />
                    <ReviewRow review={ReviewKey.PcGamer} />
                    <ReviewRow review={ReviewKey.TechRadar} />
                    <ReviewRow review={ReviewKey.TechSpot} />
                    <ReviewRow review={ReviewKey.TomsHardware} />
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
                      <SpecRow spec={SpecKey.GpuName} />
                      <SpecRow spec={SpecKey.Architecture} />
                      <SpecRow spec={SpecKey.ProcessSize} />
                      <SpecRow spec={SpecKey.Transistors} />
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
                      <SpecRow spec={SpecKey.MemorySize} />
                      <SpecRow spec={SpecKey.MemoryType} />
                      <SpecRow spec={SpecKey.MemoryBandwidth} />
                      <SpecRow spec={SpecKey.MemoryClock} />
                      <SpecRow spec={SpecKey.MemoryInterface} />
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
                      <SpecRow spec={SpecKey.PixelFillRate} />
                      <SpecRow spec={SpecKey.TextureFillRate} />
                      <SpecRow spec={SpecKey.Fp32Performance} />
                      <SpecRow spec={SpecKey.Fp64Performance} />
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
                      <SpecRow spec={SpecKey.DirectXVersion} />
                      <SpecRow spec={SpecKey.OpenClVersion} />
                      <SpecRow spec={SpecKey.OpenGlVersion} />
                      <SpecRow spec={SpecKey.ShaderModelVersion} />
                      <SpecRow spec={SpecKey.GSyncFreeSyncSupport} />
                      <SpecRow spec={SpecKey.SliCrossfireSupport} />
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
                    <BenchmarkRow benchmark={BenchmarkKey.G3dMark} />
                    <BenchmarkRow benchmark={BenchmarkKey.G2dMark} />
                    <BenchmarkRow benchmark={BenchmarkKey.TimeSpyGraphics} />
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
