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
import {
  GeneralInfoIntro,
  GeneralInfoSummary,
  GeneralInfoTable,
} from './content/general-info';
import { IntroParagraph } from './content/intro';
import {
  PerformanceArchitectureTable,
  PerformanceYearTable,
} from './content/performance';
import { createViewPageContextState, ViewPageContext } from './context';
import { CustomRow, CustomRowLabel, CustomRowValue } from './custom-row';
import {
  HighlightButton,
  HighlightLabel,
  HighlightList,
  HighlightListItem,
  HighlightValue,
} from './highlight-list';
import { ReviewRow } from './review-row';
import { SpecRow } from './spec-row';
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

              <div className="-mb-4">
                <GeneralInfoSummary />
              </div>
            </section>

            <section>
              <h2 className="mb-0 font-semibold">Performance</h2>

              <section className="flex gap-8 mb-4">
                <div className="flex-1">
                  <h3 className="mb-1">Compared to 2021 GPUs</h3>
                  <PerformanceYearTable />
                </div>

                <div className="flex-1">
                  <h3 className="mb-1">Compared to NVIDIA Ampere GPUs</h3>
                  <PerformanceArchitectureTable />
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
                  <h3 className="mb-1">Compared to 2021 GPUs</h3>
                  <Table border responsive>
                    <THead>
                      <Tr>
                        <Th className="border-0"></Th>
                        <Th className="text-left border-0">
                          Relative Performance
                        </Th>
                        <Th className="text-right border-0">Rank</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      <CustomRow highlight>
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
                  <Table border responsive>
                    <THead>
                      <Tr>
                        <Th className="border-0"></Th>
                        <Th className="text-left border-0">
                          Relative Performance
                        </Th>
                        <Th className="text-right border-0">Rank</Th>
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
                      <CustomRow highlight>
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
              <h2 className="mb-0 font-semibold">Benchmarks</h2>

              <p className={classNames('text-content-dimmed')}>
                Performance and rating metrics for the {getProductName(gpu)}.
                Benchmarks are usually the best indicator for determing a GPUs
                performance.
              </p>

              <Table border responsive className="mb-4">
                <TBody>
                  <BenchmarkRow benchmark="g3dMark" />
                  <BenchmarkRow benchmark="g2dMark" />
                  <BenchmarkRow benchmark="timeSpyGraphics" />
                </TBody>
              </Table>

              <p>
                Paragraph about G3D Mark, G2D Mark, 3Dmark Time Spy Graphics
              </p>
            </section>

            <section>
              <h2 className="mb-0 font-semibold">Reviews</h2>

              <p className={classNames('text-content-dimmed')}>
                What consumers and popular publications are saying about the{' '}
                {gpu.name}.
              </p>

              <Table border responsive className="mb-4">
                <TBody>
                  <ReviewRow review="amazon" />
                  <ReviewRow review="pcGamer" />
                  <ReviewRow review="techRadar" />
                  <ReviewRow review="techSpot" />
                  <ReviewRow review="tomsHardware" />
                </TBody>
              </Table>

              <p>
                {getProductName(gpu)} has an average score of 4.5 across popular
                publications tracked in our database.
              </p>
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

                <Table border responsive className="mb-4">
                  <TBody>
                    <SpecRow spec="gpuName" />
                    <SpecRow spec="architecture" />
                    <SpecRow spec="processSize" />
                    <SpecRow spec="transistors" />
                  </TBody>
                </Table>

                <p>
                  {getProductName(gpu)} uses the Ampere architecture and is
                  based on 8 nm manufacturing process.
                </p>
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

                <Table border responsive className="mb-4">
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

                <p>
                  The {gpu.name} is quite large, taking up 3-slots with
                  dimensions of 304 x 137 x 61 mm. The GPU has a Thermal Design
                  Power (TDP) of 450 W and it is recommended to be used with a
                  minimum 850 W PSU.
                </p>
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

                <Table border responsive className="mb-4">
                  <TBody>
                    <SpecRow spec="memorySize" />
                    <SpecRow spec="memoryType" />
                    <SpecRow spec="memoryBandwidth" />
                    <SpecRow spec="memoryClock" />
                    <SpecRow spec="memoryInterface" />
                  </TBody>
                </Table>

                <p>
                  This RDNA 2.0 GPU has 12 GB of GDDR6 memory. This amount of
                  memory is similar to the other GPUs that launched in 2021. It
                  is comparable with the GPUs that launched this year, making it
                  sufficient for most memory requirements.
                </p>

                <p>
                  This memory is clocked 2,000 MHz and has a bandwidth of 384
                  GB/s with a 192 bit interface. This kind of memory performance
                  was among the best in 2021, and is still in-line with
                  mid-range GPUs released today.
                </p>
              </section>

              <section>
                <h3 className="mb-0">Cores &amp; Clock Speeds</h3>

                <p className={classNames('text-content-dimmed')}>
                  {`${gpu.name}'s`} cores, clock speed, and cache. These specs
                  have an impact on how fast the {getProductName(gpu)} can
                  process graphics. Each type of core serves a specific
                  computational purpose.
                </p>

                <Table border responsive className="mb-4">
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

                <p>
                  This card operates at a base clock speed of 2,235 MHz. The
                  16,384 Cores gives it a FP32 performance of 83 TFLOPS and FP64
                  performance of 1,290 GFLOPS.
                </p>
                <p>
                  The 176 Render Output Units (ROPs) gives it a pixel fill rate
                  of 444 GPixel/s. The 512 Texture Mapping Units (TMUs) gives it
                  a texture fill rate of 1,290 GTexel/s.
                </p>
              </section>

              <section>
                <h3 className="mb-0">Theoretical Performance</h3>

                <p className={classNames('text-content-dimmed')}>
                  {`${gpu.name}'s`} computational performance like pixel fill
                  rate, texture fill rate, and floating-point operations per
                  second. This is the calculated performance based on TMUs,
                  ROPs, cores, and clock frequency.
                </p>

                <Table border responsive className="mb-4">
                  <TBody>
                    <SpecRow spec="pixelFillRate" />
                    <SpecRow spec="textureFillRate" />
                    <SpecRow spec="fp32Performance" />
                    <SpecRow spec="fp64Performance" />
                  </TBody>
                </Table>

                <p>Paragraph about theoretical performance.</p>
              </section>

              <section>
                <h3 className="mb-0">API Support</h3>

                <p className={classNames('text-content-dimmed')}>
                  API versions that the {getProductName(gpu)} supports. Older
                  GPUs may not support recent versions.
                </p>

                <Table border responsive className="mb-4">
                  <TBody>
                    <SpecRow spec="directXVersion" />
                    <SpecRow spec="openClVersion" />
                    <SpecRow spec="openGlVersion" />
                    <SpecRow spec="shaderModelVersion" />
                  </TBody>
                </Table>

                <p>Paragraph about theoretical performance.</p>
              </section>
            </section>

            <section>
              <p className="text-xs">
                The rankings, relative performance, and relative value
                represented on this page considers the 300 GPUs that we track in
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
