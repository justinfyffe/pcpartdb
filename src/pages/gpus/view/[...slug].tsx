import {
  CalendarIcon,
  ChipIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  StarIcon,
  TableIcon,
} from '@heroicons/react/outline';
import { NextPageContext } from 'next';
import React, { useMemo } from 'react';
import {
  getProductBenchmarks,
  getProductReviews,
  getProductSpecs,
  Product,
} from '../../../types/product';
import { ProductBenchmarkKey } from '../../../types/product-benchmark';
import { ProductReviewKey } from '../../../types/product-review';
import { ProductSpecKey } from '../../../types/product-spec';
import { CompareForm } from '../../../web/compare';
import { ProductImage } from '../../../web/product';
import { productService } from '../../../web/product/product.service';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import {
  Breadcrumb,
  Breadcrumbs,
} from '../../../web/shared/components/breadcrumbs';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { Table, TBody, Td, Tr } from '../../../web/shared/components/table';
import { WebsiteLayout } from '../../../web/shared/layouts/website';
import { classNames } from '../../../web/shared/ui/ui.utils';
import {
  Sidenav,
  SidenavPopularComparisons,
  SidenavPopularProducts,
} from '../../../web/sidenav';

interface ViewGpuPageProps {
  gpu: Product;
}

const ViewGpuPage = (props: ViewGpuPageProps) => {
  const { gpu } = props;

  const specs = useMemo(() => getProductSpecs(gpu), [gpu]);
  const reviews = useMemo(() => getProductReviews(gpu), [gpu]);
  const benchmarks = useMemo(() => getProductBenchmarks(gpu), [gpu]);

  return (
    <WebsiteLayout>
      <Article className="flex flex-wrap gap-6 lg:gap-8 justify-center">
        <ArticleHeader className="flex flex-wrap w-full items-center justify-between gap-3 lg:gap-4">
          <Breadcrumbs className="mb-3">
            <Breadcrumb href="/">Finest PC</Breadcrumb>
            <Breadcrumb href="/gpus">GPUs</Breadcrumb>
            <Breadcrumb>{gpu.name}</Breadcrumb>
          </Breadcrumbs>

          <h1>{gpu.name}</h1>

          <CompareForm values={[gpu.id]} />
        </ArticleHeader>

        <section className="flex-1 flex flex-col gap-6">
          <section className="flex flex-wrap justify-start gap-6 lg:gap-8">
            <div className="flex-1 min-w-[300px]">
              <ProductImage />
            </div>

            <div className="flex-1">
              <ul className={classNames('flex flex-col gap-3 lg:gap-4')}>
                <li
                  className={classNames(
                    'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                  )}
                >
                  <div className={classNames('flex-1 flex gap-2 items-center')}>
                    <div className="mr-1">
                      <ShoppingCartIcon className="w-[20px] lg:w-[30px]"></ShoppingCartIcon>
                    </div>

                    <div
                      className={classNames('font-medium text-xl lg:text-2xl')}
                    >
                      Shop
                    </div>
                  </div>

                  <Button
                    variant={ButtonVariant.Primary}
                    className={classNames(
                      'self-stretch lg:text-lg text-right py-[4px]',
                    )}
                  >
                    Buy
                  </Button>
                </li>

                <li
                  className={classNames(
                    'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                  )}
                >
                  <div className={classNames('flex-1 flex gap-2 items-center')}>
                    <div className="mr-1">
                      <StarIcon className="w-[20px] lg:w-[30px]"></StarIcon>
                    </div>

                    <div
                      className={classNames('font-medium text-xl lg:text-2xl')}
                    >
                      Performance Rating
                    </div>
                  </div>

                  <div
                    className={classNames(
                      'text-md lg:text-lg text-slate-600 text-right',
                    )}
                  >
                    {benchmarks[ProductBenchmarkKey.PerformanceScore]
                      ?.floatValue ?? '--'}
                  </div>
                </li>

                <li
                  className={classNames(
                    'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                  )}
                >
                  <div className={classNames('flex-1 flex gap-2 items-center')}>
                    <div className="mr-1">
                      <CurrencyDollarIcon className="w-[20px] lg:w-[30px]"></CurrencyDollarIcon>
                    </div>

                    <div
                      className={classNames('font-medium text-xl lg:text-2xl')}
                    >
                      Value for Money
                    </div>
                  </div>

                  <div
                    className={classNames(
                      'text-md lg:text-lg text-slate-600 text-right',
                    )}
                  >
                    {benchmarks[ProductBenchmarkKey.ValueScore]?.floatValue ??
                      '--'}
                  </div>
                </li>

                <li
                  className={classNames(
                    'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                  )}
                >
                  <div className={classNames('flex-1 flex gap-2 items-center')}>
                    <div className="mr-1">
                      <ChipIcon className="w-[20px] lg:w-[30px]"></ChipIcon>
                    </div>

                    <div
                      className={classNames('font-medium text-xl lg:text-2xl')}
                    >
                      Cores
                    </div>
                  </div>

                  <div
                    className={classNames(
                      'text-md lg:text-lg text-slate-600 text-right',
                    )}
                  >
                    {specs[ProductSpecKey.CudaCores] != null
                      ? `${
                          specs[ProductSpecKey.CudaCores]?.floatValue
                        } CUDA Cores`
                      : '--'}
                  </div>
                </li>

                <li
                  className={classNames(
                    'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                  )}
                >
                  <div className={classNames('flex-1 flex gap-2 items-center')}>
                    <div className="mr-1">
                      <ClockIcon className="w-[20px] lg:w-[30px]"></ClockIcon>
                    </div>

                    <div
                      className={classNames('font-medium text-xl lg:text-2xl')}
                    >
                      Clock
                    </div>
                  </div>

                  <div
                    className={classNames(
                      'text-md lg:text-lg text-slate-600 text-right',
                    )}
                  >
                    {specs[ProductSpecKey.ClockSpeedBase]?.floatValue} /{' '}
                    {specs[ProductSpecKey.ClockSpeedBoost]?.floatValue}
                  </div>
                </li>

                <li
                  className={classNames(
                    'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                  )}
                >
                  <div className={classNames('flex-1 flex gap-2 items-center')}>
                    <div className="mr-1">
                      <TableIcon className="w-[20px] lg:w-[30px]"></TableIcon>
                    </div>

                    <div
                      className={classNames('font-medium text-xl lg:text-2xl')}
                    >
                      Memory
                    </div>
                  </div>

                  <div
                    className={classNames(
                      'text-md lg:text-lg text-slate-600 text-right',
                    )}
                  >
                    {specs[ProductSpecKey.MemorySize]?.floatValue ?? '--'}{' '}
                    {specs[ProductSpecKey.MemoryType]?.stringValue ?? '--'}
                  </div>
                </li>

                <li
                  className={classNames(
                    'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                  )}
                >
                  <div className={classNames('flex-1 flex gap-2 items-center')}>
                    <div className="mr-1">
                      <CalendarIcon className="w-[20px] lg:w-[30px]"></CalendarIcon>
                    </div>

                    <div
                      className={classNames('font-medium text-xl lg:text-2xl')}
                    >
                      Release Date
                    </div>
                  </div>

                  <div
                    className={classNames(
                      'text-md lg:text-lg text-slate-600 text-right',
                    )}
                  >
                    {specs[ProductSpecKey.ReleaseDate]?.stringValue ?? '--'}
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. A
              iaculis at erat pellentesque adipiscing commodo elit at. Maecenas
              sed enim ut sem viverra. Elementum sagittis vitae et leo duis ut
              diam. In mollis nunc sed id semper risus in hendrerit. Eget sit
              amet tellus cras adipiscing enim. Sit amet consectetur adipiscing
              elit. Interdum velit euismod in pellentesque massa.
            </p>
          </section>

          <section className="flex flex-col gap-6">
            <article>
              <h2 className="mb-3">General Info</h2>

              <p className={classNames('text-content-secondary')}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <Table border responsive>
                <TBody>
                  <Tr>
                    <Td className="min-w-[180px]">Performance Rating</Td>
                    <Td className="min-w-[80px]">82.23</Td>
                  </Tr>
                  <Tr>
                    <Td>Value for Money</Td>
                    <Td>58.32</Td>
                  </Tr>
                  <Tr>
                    <Td>Company</Td>
                    <Td>
                      {specs[ProductSpecKey.Company]?.stringValue ?? '--'}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Generation</Td>
                    <Td>
                      {specs[ProductSpecKey.Generation]?.stringValue ?? '--'}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Market Segment</Td>
                    <Td>
                      {specs[ProductSpecKey.MarketSegment]?.stringValue ?? '--'}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Launch Price</Td>
                    <Td>
                      {specs[ProductSpecKey.LaunchPrice]?.floatValue ?? '--'}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Release Date</Td>
                    <Td>
                      {specs[ProductSpecKey.ReleaseDate]?.stringValue ?? '--'}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Production Status</Td>
                    <Td>
                      {specs[ProductSpecKey.ProductionStatus]?.stringValue ??
                        '--'}
                    </Td>
                  </Tr>
                </TBody>
              </Table>
            </article>

            <article>
              <h2 className="mb-3">Reviews</h2>

              <p className={classNames('text-content-secondary')}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <Table border responsive>
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">
                      {reviews[ProductReviewKey.Amazon]?.source != null ? (
                        <a href={reviews[ProductReviewKey.Amazon].source}>
                          Amazon
                        </a>
                      ) : (
                        <>Amazon</>
                      )}
                    </Td>
                    <Td className="min-w-[80px]">
                      {reviews[ProductReviewKey.Amazon]?.stringValue ?? '--'}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {reviews[ProductReviewKey.TechRadar]?.source != null ? (
                        <a href={reviews[ProductReviewKey.TechRadar].source}>
                          TechRadar
                        </a>
                      ) : (
                        <>TechRadar</>
                      )}
                    </Td>
                    <Td>
                      {reviews[ProductReviewKey.TechRadar]?.stringValue ?? '--'}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {reviews[ProductReviewKey.TomsHardware]?.source !=
                      null ? (
                        <a href={reviews[ProductReviewKey.TomsHardware].source}>
                          Tom&apos;s Hardware
                        </a>
                      ) : (
                        <>Tom&apos;s Hardware</>
                      )}
                    </Td>
                    <Td>
                      {reviews[ProductReviewKey.TomsHardware]?.stringValue ??
                        '--'}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {reviews[ProductReviewKey.TechSpot]?.source != null ? (
                        <a href={reviews[ProductReviewKey.TechSpot].source}>
                          TechSpot
                        </a>
                      ) : (
                        <>TechSpot</>
                      )}
                    </Td>
                    <Td>
                      {reviews[ProductReviewKey.TechSpot]?.stringValue ?? '--'}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {reviews[ProductReviewKey.PcGamer]?.source != null ? (
                        <a href={reviews[ProductReviewKey.PcGamer].source}>
                          PC Gamer
                        </a>
                      ) : (
                        <>PC Gamer</>
                      )}
                    </Td>
                    <Td>
                      {reviews[ProductReviewKey.PcGamer]?.stringValue ?? '--'}
                    </Td>
                  </Tr>
                </TBody>
              </Table>
            </article>

            <article>
              <h2 className="mb-6">Technical Specs</h2>

              <article>
                <h3 className="mb-3">Processor</h3>

                <p className={classNames('text-content-secondary')}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">GPU Name</Td>
                      <Td className="min-w-[80px]">
                        {specs[ProductSpecKey.GpuName]?.stringValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Architecture</Td>
                      <Td>
                        {specs[ProductSpecKey.Architecture]?.stringValue ??
                          '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Foundry</Td>
                      <Td>
                        {specs[ProductSpecKey.Foundry]?.stringValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Process Size</Td>
                      <Td>
                        {specs[ProductSpecKey.Lithography]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Transistors</Td>
                      <Td>
                        {specs[ProductSpecKey.Transistors]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Die Size</Td>
                      <Td>
                        {specs[ProductSpecKey.DieSize]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">Board Compatibility &amp; Dimensions</h3>

                <p className={classNames('text-content-secondary')}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">Slot Width</Td>
                      <Td className="min-w-[80px]">
                        {specs[ProductSpecKey.SlotWidth]?.stringValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Length</Td>
                      <Td>
                        {specs[ProductSpecKey.Length]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Width</Td>
                      <Td>{specs[ProductSpecKey.Width]?.floatValue ?? '--'}</Td>
                    </Tr>
                    <Tr>
                      <Td>Height</Td>
                      <Td>
                        {specs[ProductSpecKey.Height]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Weight</Td>
                      <Td>
                        {specs[ProductSpecKey.Weight]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Bus Interface</Td>
                      <Td>
                        {specs[ProductSpecKey.BusInterface]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>TDP</Td>
                      <Td>{specs[ProductSpecKey.Tdp]?.floatValue ?? '--'}</Td>
                    </Tr>
                    <Tr>
                      <Td>Suggested PSU</Td>
                      <Td>
                        {specs[ProductSpecKey.SuggestedPsu]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Power Connectors</Td>
                      <Td>
                        {specs[ProductSpecKey.PowerConnectors]?.stringValue ??
                          '--'}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">Cores &amp; Clock Speeds</h3>

                <p className={classNames('text-content-secondary')}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">CUDA Cores</Td>
                      <Td className="min-w-[80px]">
                        {specs[ProductSpecKey.CudaCores]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>TMUs</Td>
                      <Td>{specs[ProductSpecKey.Tmus]?.floatValue ?? '--'}</Td>
                    </Tr>
                    <Tr>
                      <Td>ROPs</Td>
                      <Td>{specs[ProductSpecKey.Rops]?.floatValue ?? '--'}</Td>
                    </Tr>
                    <Tr>
                      <Td>Tensor Cores</Td>
                      <Td>
                        {specs[ProductSpecKey.TensorCores]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>RT Cores</Td>
                      <Td>
                        {specs[ProductSpecKey.RtCores]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Base Clock</Td>
                      <Td>
                        {specs[ProductSpecKey.ClockSpeedBase]?.floatValue ??
                          '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Boost Clock</Td>
                      <Td>
                        {specs[ProductSpecKey.ClockSpeedBoost]?.floatValue ??
                          '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>L1 Cache</Td>
                      <Td>
                        {specs[ProductSpecKey.L1Cache]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>L2 Cache</Td>
                      <Td>
                        {specs[ProductSpecKey.L2Cache]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">Theoretical Performance</h3>

                <p className={classNames('text-content-secondary')}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">Pixel Fill Rate</Td>
                      <Td className="min-w-[80px]">
                        {specs[ProductSpecKey.PixelFillRate]?.floatValue ??
                          '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Texture Fill Rate</Td>
                      <Td>
                        {specs[ProductSpecKey.TextureRate]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>FP32 Performance</Td>
                      <Td>
                        {specs[ProductSpecKey.Fp32Performance]?.floatValue ??
                          '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>FP64 Performance</Td>
                      <Td>
                        {specs[ProductSpecKey.Fp64Performance]?.floatValue ??
                          '--'}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">Memory</h3>

                <p className={classNames('text-content-secondary')}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">Memory Size</Td>
                      <Td className="min-w-[80px]">
                        {specs[ProductSpecKey.MemorySize]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="min-w-[180px]">Memory Type</Td>
                      <Td className="min-w-[80px]">
                        {specs[ProductSpecKey.MemoryType]?.stringValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Memory Clock</Td>
                      <Td>--</Td>
                    </Tr>
                    <Tr>
                      <Td>Memory Interface</Td>
                      <Td>
                        {specs[ProductSpecKey.MemoryInterface]?.floatValue ??
                          '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Memory Bandwidth</Td>
                      <Td>
                        {specs[ProductSpecKey.MemoryBandwidth]?.floatValue ??
                          '--'}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">Display Connectivity</h3>

                <p className={classNames('text-content-secondary')}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">Max Resolution</Td>
                      <Td className="min-w-[80px]">
                        {specs[ProductSpecKey.MaxResolution]?.stringValue ??
                          '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Display Ports</Td>
                      <Td>
                        {specs[ProductSpecKey.DisplayPorts]?.stringValue ??
                          '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>HDMI Ports</Td>
                      <Td>
                        {specs[ProductSpecKey.HdmiPorts]?.stringValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>USB-C</Td>
                      <Td>--</Td>
                    </Tr>
                    <Tr>
                      <Td>Dual Link DVI</Td>
                      <Td>--</Td>
                    </Tr>
                    <Tr>
                      <Td>Single Link DVI</Td>
                      <Td>--</Td>
                    </Tr>
                    <Tr>
                      <Td>VGA</Td>
                      <Td>--</Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">API Support</h3>

                <p className={classNames('text-content-secondary')}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">DirextX</Td>
                      <Td className="min-w-[80px]">
                        {specs[ProductSpecKey.DirectXVersion]?.floatValue ??
                          '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>G-Sync / FreeSync</Td>
                      <Td>
                        {specs[ProductSpecKey.GSyncFreeSyncSupport]
                          ?.booleanValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>SLI / Crossfire</Td>
                      <Td>
                        {specs[ProductSpecKey.SliCrossfireSupport]
                          ?.booleanValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>VR Ready</Td>
                      <Td>
                        {specs[ProductSpecKey.VrReady]?.booleanValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>OpenCL</Td>
                      <Td>
                        {specs[ProductSpecKey.OpenClVersion]?.floatValue ??
                          '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>OpenGL</Td>
                      <Td>
                        {specs[ProductSpecKey.OpenGlVersion]?.floatValue ??
                          '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Shader Model</Td>
                      <Td>
                        {specs[ProductSpecKey.ShaderModelVersion]?.floatValue ??
                          '--'}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>
            </article>

            <article>
              <h2 className="mb-3">Benchmarks</h2>

              <p className={classNames('text-content-secondary')}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <Table border responsive>
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">Performance Rating</Td>
                    <Td className="min-w-[80px]">
                      {benchmarks[ProductBenchmarkKey.PerformanceScore]
                        ?.floatValue ?? '--'}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Value for Money</Td>
                    <Td>
                      {benchmarks[ProductBenchmarkKey.ValueScore]?.floatValue ??
                        '--'}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {benchmarks[ProductBenchmarkKey.TimeSpy]?.source !=
                      null ? (
                        <a
                          href={benchmarks[ProductBenchmarkKey.TimeSpy].source}
                        >
                          3DMark Time Spy
                        </a>
                      ) : (
                        <>3DMark Time Spy</>
                      )}
                    </Td>
                    <Td>
                      {benchmarks[ProductBenchmarkKey.TimeSpy]?.floatValue ??
                        '--'}
                    </Td>
                  </Tr>
                </TBody>
              </Table>
            </article>
          </section>
        </section>

        <Sidenav>
          <SidenavPopularProducts />
          <SidenavPopularComparisons />
        </Sidenav>
      </Article>
    </WebsiteLayout>
  );
};

ViewGpuPage.getInitialProps = async (ctx: NextPageContext) => {
  const { slug } = ctx.query as { slug: string };
  const gpu = await productService.get(slug);

  return { gpu };
};

export default ViewGpuPage;
