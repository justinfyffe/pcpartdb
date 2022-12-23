import { useProductCache } from '@client/shared/cache';
import {
  Breadcrumb,
  Breadcrumbs,
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
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
import { formatBenchmark } from '@shared/benchmark';
import {
  getProductDetailsPath,
  getProductName,
  Product,
  RelatedProducts,
} from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import { getShoppingUrl } from '@shared/retail-model';
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

export interface ViewGpuPageProps {
  gpu: Product;

  relatedProducts: RelatedProducts;
}

export const ViewGpuPage = (props: ViewGpuPageProps) => {
  const { gpu, relatedProducts } = props;
  useProductCache(gpu);

  const context = useMemo(() => createProductContextState(gpu), [gpu]);
  const specs = context.specs;
  const meta = context.metas;
  const benchmarks = context.benchmarks;

  const title = gpu.name;
  const canonical = getProductDetailsPath(gpu);
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
    <ProductContext.Provider value={context}>
      <WebsiteLayout seo={{ title, canonical, keywords }}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href="/">Home</Breadcrumb>
          <Breadcrumb href="/gpus">GPUs</Breadcrumb>
          <Breadcrumb>{gpu.name}</Breadcrumb>
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

            <section>
              <h2 className="mb-0 font-semibold">General Info</h2>

              <p className={classNames('text-content-dimmed')}>
                {`${gpu.name}'s`} basic details like its performance rating,
                market segment, release date, and launch price. Check
                availability and price for the {getProductName(gpu)}.
              </p>

              <Table responsive className="mb-4">
                <TBody>
                  <CustomRow>
                    <CustomRowLabel>Shop</CustomRowLabel>
                    <CustomRowValue>
                      {shoppingUrl != null ? (
                        <a
                          href={shoppingUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-green-600 font-bold"
                        >
                          Check Price
                        </a>
                      ) : (
                        <>--</>
                      )}
                    </CustomRowValue>
                  </CustomRow>
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

              <p>
                The Test GPU 1 is a Desktop AMD GPU that launched during Q1
                2021. It is targeted towards the mid-range PC market with a MSRP
                of $399.
              </p>

              <p>
                The AMD Radeon RX 6700 is the 14th best performing graphics card
                out of the 300 GPUs in our database. It is the 4th best in value
                graphics card.
              </p>
            </section>

            <section>
              <h2 className="mb-0 font-semibold">Performance</h2>

              <section className="flex gap-8 mb-4">
                <div className="flex-1">
                  <h3 className="mb-1">Compared to 2021 GPUs</h3>
                  <Table responsive>
                    <THead>
                      <Tr>
                        <Th></Th>
                        <Th className="text-left">Relative Performance</Th>
                        <Th className="text-right">Rank</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          120%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          7
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          118%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          8
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          110%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          9
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          100%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          10
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          90%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          11
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          87%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          12
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          80%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          13
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          74%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          14
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          65%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          15
                        </CustomRowValue>
                      </CustomRow>
                    </TBody>
                  </Table>
                </div>

                <div className="flex-1">
                  <h3 className="mb-1">Compared to NVIDIA Ampere GPUs</h3>
                  <Table responsive>
                    <THead>
                      <Tr>
                        <Th></Th>
                        <Th className="text-left">Relative Performance</Th>
                        <Th className="text-right">Rank</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          120%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          7
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          118%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          8
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          110%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          9
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          100%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          10
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          90%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          11
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          87%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          12
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          80%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          13
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          74%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          14
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          65%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          15
                        </CustomRowValue>
                      </CustomRow>
                    </TBody>
                  </Table>
                </div>
              </section>

              <p>
                The Test GPU 1 is the 3rd most performant GPU in our database.
                It is also 30% stronger than the GPU with the best value, the
                Test GPU 2.
              </p>
              <p>
                This graphics card is the 5th strongest card among the 43 GPUs
                that also launched in 2021. Additionally, it is the 2nd most
                powerful AMD GPU, and 4thin the RDNA 2.0 architecture family.
              </p>
            </section>

            <section>
              <h2 className="mb-0 font-semibold">Value</h2>

              <section className="flex gap-8 mb-4">
                <div className="flex-1">
                  <h3 className="mb-1">Relative to 2021 GPUs</h3>
                  <Table responsive>
                    <THead>
                      <Tr>
                        <Th></Th>
                        <Th className="text-left">Relative Performance</Th>
                        <Th className="text-right">Rank</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          120%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          7
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          118%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          8
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          110%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          9
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          100%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          10
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          90%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          11
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          87%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          12
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          80%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          13
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          74%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          14
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          65%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          15
                        </CustomRowValue>
                      </CustomRow>
                    </TBody>
                  </Table>
                </div>

                <div className="flex-1">
                  <h3 className="mb-1">Relative to NVIDIA Ampere GPUs</h3>
                  <Table responsive>
                    <THead>
                      <Tr>
                        <Th></Th>
                        <Th className="text-left">Relative Performance</Th>
                        <Th className="text-right">Rank</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          120%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          7
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          118%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          8
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          110%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          9
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          100%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          10
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          90%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          11
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          87%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          12
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          80%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          13
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          74%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          14
                        </CustomRowValue>
                      </CustomRow>
                      <CustomRow>
                        <CustomRowLabel>RTX 3060</CustomRowLabel>
                        <CustomRowValue className="text-left">
                          65%
                        </CustomRowValue>
                        <CustomRowValue className="text-right">
                          15
                        </CustomRowValue>
                      </CustomRow>
                    </TBody>
                  </Table>
                </div>
              </section>

              <p>
                The Test GPU 1 is the 3rd most performant GPU in our database.
                It is also 30% stronger than the GPU with the best value, the
                Test GPU 2.
              </p>
              <p>
                This graphics card is the 5th strongest card among the 43 GPUs
                that also launched in 2021. Additionally, it is the 2nd most
                powerful AMD GPU, and 4thin the RDNA 2.0 architecture family.
              </p>
            </section>

            <section>
              <h2 className="mb-0 font-semibold">Reviews</h2>

              <p className={classNames('text-content-dimmed')}>
                What consumers and popular publications are saying about the{' '}
                {gpu.name}.
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
              <h2 className="mb-0 font-semibold">Benchmarks</h2>

              <p className={classNames('text-content-dimmed')}>
                Performance and rating metrics for the {getProductName(gpu)}.
                Benchmarks are usually the best indicator for determing a GPUs
                performance.
              </p>

              <Table responsive>
                <TBody>
                  <BenchmarkRow benchmark="g3dMark" />
                  <BenchmarkRow benchmark="g2dMark" />
                  <BenchmarkRow benchmark="timeSpyGraphics" />
                </TBody>
              </Table>
            </section>

            <section className="flex flex-col gap-6">
              <h2 className="mb-0 font-semibold">Technical Specs</h2>

              <section>
                <h3 className="mb-0">Processor</h3>

                <p className={classNames('text-content-dimmed')}>
                  {`${gpu.name}'s`} processor chip details like its code name
                  and architecture. Modern architectures are more performant and
                  efficient at computing than their predecessors.
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
                <h3 className="mb-0">Board Compatibility &amp; Dimensions</h3>

                <p className={classNames('text-content-dimmed')}>
                  {`${gpu.name}'s`} dimensions, bus interface, power
                  consumption, and output ports. These specs are useful for
                  verifying that the {getProductName(gpu)} fits within your case
                  and is compatible with your motherboard, power supply, and
                  monitor.
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
                <h3 className="mb-0">Memory</h3>

                <p className={classNames('text-content-dimmed')}>
                  {`${gpu.name}'s`} memory size, bandwidth, and clock speeds.
                  GPU memory stores graphics data like frames, textures, and
                  shadows which helps display rendered images. These specs are
                  critical for graphics-intense applications like gaming and 3D
                  modeling.
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
                <h3 className="mb-0">Cores &amp; Clock Speeds</h3>

                <p className={classNames('text-content-dimmed')}>
                  {`${gpu.name}'s`} cores, clock speed, and cache. These specs
                  have an impact on how fast the {getProductName(gpu)} can
                  process graphics. Each type of core serves a specific
                  computational purpose.
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
                <h3 className="mb-0">Theoretical Performance</h3>

                <p className={classNames('text-content-dimmed')}>
                  {`${gpu.name}'s`} computational performance like pixel fill
                  rate, texture fill rate, and floating-point operations per
                  second. This is the calculated performance based on TMUs,
                  ROPs, cores, and clock frequency.
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
                <h3 className="mb-0">API Support</h3>

                <p className={classNames('text-content-dimmed')}>
                  API versions that the {getProductName(gpu)} supports. Older
                  GPUs may not support recent versions.
                </p>

                <Table responsive>
                  <TBody>
                    <SpecRow spec="directXVersion" />
                    <SpecRow spec="openClVersion" />
                    <SpecRow spec="openGlVersion" />
                    <SpecRow spec="shaderModelVersion" />
                  </TBody>
                </Table>
              </section>
            </section>
          </article>

          <Sidenav>
            <SidenavProducts products={relatedProducts.gpus} />
            <SidenavComparisons comparisons={relatedProducts.comparisons} />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ProductContext.Provider>
  );
};
