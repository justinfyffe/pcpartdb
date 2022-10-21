import {
  Article,
  ArticleHeader,
  Breadcrumb,
  Breadcrumbs,
  Button,
  ButtonVariant,
  Table,
  TBody,
  Td,
  Tr,
} from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import {
  Sidenav,
  SidenavPopularComparisons,
  SidenavPopularProducts,
} from '@client/sidenav';
import {
  CalendarIcon,
  ChipIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  StarIcon,
  TableIcon,
} from '@heroicons/react/outline';
import {
  getProductBenchmarks,
  getProductMeta,
  getProductReviews,
  getProductSpecs,
  Product,
} from '@shared/product';
import {
  formatProductBenchmark,
  ProductBenchmarkKey,
} from '@shared/product-benchmark';
import { formatProductMeta, ProductMetaKey } from '@shared/product-meta';
import { ProductReviewKey } from '@shared/product-review';
import {
  formatProductSpec,
  MarketSegment,
  ProductSpecKey,
  productSpecValue,
} from '@shared/product-spec';
import { NextPageContext } from 'next';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { productService } from '../../product-service';
import { CompareProductsForm } from '../compare-products-form';
import { ProductImages } from '../product-images';

interface ViewGpuPageProps {
  gpu: Product;
}

export const ViewGpuPage = (props: ViewGpuPageProps) => {
  const { gpu } = props;

  const specs = useMemo(() => getProductSpecs(gpu), [gpu]);
  const meta = useMemo(() => getProductMeta(gpu), [gpu]);
  const reviews = useMemo(() => getProductReviews(gpu), [gpu]);
  const benchmarks = useMemo(() => getProductBenchmarks(gpu), [gpu]);

  return (
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
                      Performance Rank
                    </div>
                  </div>

                  <div
                    className={classNames(
                      'text-md lg:text-lg text-slate-600 text-right',
                    )}
                  >
                    {formatProductMeta(meta[ProductMetaKey.PerformanceRank])}
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
                      Value Rank
                    </div>
                  </div>

                  <div
                    className={classNames(
                      'text-md lg:text-lg text-slate-600 text-right',
                    )}
                  >
                    {formatProductMeta(meta[ProductMetaKey.ValueRank])}
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
                    {formatProductSpec(specs[ProductSpecKey.ClockSpeedBase])} /{' '}
                    {formatProductSpec(specs[ProductSpecKey.ClockSpeedBoost])}
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
                    {formatProductSpec(specs[ProductSpecKey.ReleaseDate])}
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <ReactMarkdown>
              {formatProductMeta(meta[ProductMetaKey.Description]) as string}
            </ReactMarkdown>
          </section>

          <section className="flex flex-col gap-6">
            <article>
              <h2 className="mb-3">General Info</h2>

              <p className={classNames('text-content-secondary')}>
                {`${gpu.name}'s`} architecture, market segment, release date,
                and price.
              </p>

              <Table border responsive>
                <TBody>
                  <Tr>
                    <Td className="min-w-[180px]">Performance Rating (Rank)</Td>
                    <Td className="min-w-[80px]">
                      {formatProductBenchmark(
                        benchmarks[ProductBenchmarkKey.PerformanceScore],
                        { decimals: 0 },
                      )}{' '}
                      ({meta[ProductMetaKey.PerformanceRank]?.integerValue})
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Performance Per Dollar (Rank)</Td>
                    <Td>
                      {formatProductBenchmark(
                        benchmarks[ProductBenchmarkKey.ValueScore],
                      )}{' '}
                      ({formatProductMeta(meta[ProductMetaKey.ValueRank])})
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Company</Td>
                    <Td>{formatProductSpec(specs[ProductSpecKey.Company])}</Td>
                  </Tr>
                  <Tr>
                    <Td>Generation</Td>
                    <Td>
                      {formatProductSpec(specs[ProductSpecKey.Generation])}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Market Segment</Td>
                    <Td>
                      {formatProductSpec(specs[ProductSpecKey.MarketSegment])}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Launch Price</Td>
                    <Td>
                      {formatProductSpec(specs[ProductSpecKey.LaunchPrice])}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Release Date</Td>
                    <Td>
                      {formatProductSpec(specs[ProductSpecKey.ReleaseDate])}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Production Status</Td>
                    <Td>
                      {formatProductSpec(
                        specs[ProductSpecKey.ProductionStatus],
                      )}
                    </Td>
                  </Tr>
                </TBody>
              </Table>
            </article>

            <article>
              <h2 className="mb-3">Reviews</h2>

              <p className={classNames('text-content-secondary')}>
                What others are saying about {gpu.name}.
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
                  {`${gpu.name}'s`} processor chip details.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">GPU Name</Td>
                      <Td className="min-w-[80px]">
                        {formatProductSpec(specs[ProductSpecKey.GpuName])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Architecture</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.Architecture])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Foundry</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.Foundry])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Process Size</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.Lithography])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Transistors</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.Transistors])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Die Size</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.DieSize])}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">Board Compatibility &amp; Dimensions</h3>

                <p className={classNames('text-content-secondary')}>
                  {`${gpu.name}'s`} dimensions, bus interface, and power
                  consumption.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">Slot Width</Td>
                      <Td className="min-w-[80px]">
                        {formatProductSpec(specs[ProductSpecKey.SlotWidth])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Length</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.Length], {
                          decimals: 0,
                        })}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Width</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.Width], {
                          decimals: 0,
                        })}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Height</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.Height], {
                          decimals: 0,
                        })}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Weight</Td>
                      <Td>{formatProductSpec(specs[ProductSpecKey.Weight])}</Td>
                    </Tr>
                    <Tr>
                      <Td>Bus Interface</Td>
                      <Td>
                        {specs[ProductSpecKey.BusInterface]?.floatValue ?? '--'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>TDP</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.Tdp], {
                          decimals: 0,
                        })}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Suggested PSU</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.SuggestedPsu], {
                          decimals: 0,
                        })}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Power Connectors</Td>
                      <Td>
                        {formatProductSpec(
                          specs[ProductSpecKey.PowerConnectors],
                        )}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">Cores &amp; Clock Speeds</h3>

                <p className={classNames('text-content-secondary')}>
                  {`${gpu.name}'s`} cores, clock speed, and cache.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">CUDA Cores</Td>
                      <Td className="min-w-[80px]">
                        {formatProductSpec(specs[ProductSpecKey.CudaCores])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>TMUs</Td>
                      <Td>{formatProductSpec(specs[ProductSpecKey.Tmus])}</Td>
                    </Tr>
                    <Tr>
                      <Td>ROPs</Td>
                      <Td>{formatProductSpec(specs[ProductSpecKey.Rops])}</Td>
                    </Tr>
                    <Tr>
                      <Td>Tensor Cores</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.TensorCores])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>RT Cores</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.RtCores])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Base Clock</Td>
                      <Td>
                        {formatProductSpec(
                          specs[ProductSpecKey.ClockSpeedBase],
                        )}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Boost Clock</Td>
                      <Td>
                        {formatProductSpec(
                          specs[ProductSpecKey.ClockSpeedBoost],
                        )}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>L1 Cache</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.L1Cache])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>L2 Cache</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.L2Cache])}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">Theoretical Performance</h3>

                <p className={classNames('text-content-secondary')}>
                  {`${gpu.name}'s`} computational performance like pixel fill
                  rate, texture fill rate, and floating-point operations per
                  second.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">Pixel Fill Rate</Td>
                      <Td className="min-w-[80px]">
                        {formatProductSpec(specs[ProductSpecKey.PixelFillRate])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Texture Fill Rate</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.TextureRate])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>FP32 Performance</Td>
                      <Td>
                        {formatProductSpec(
                          specs[ProductSpecKey.Fp32Performance],
                        )}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>FP64 Performance</Td>
                      <Td>
                        {formatProductSpec(
                          specs[ProductSpecKey.Fp64Performance],
                        )}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">Memory</h3>

                <p className={classNames('text-content-secondary')}>
                  {`${gpu.name}'s`} memory size, bandwidth, and clock speeds.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">Memory Size</Td>
                      <Td className="min-w-[80px]">
                        {formatProductSpec(specs[ProductSpecKey.MemorySize])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="min-w-[180px]">Memory Type</Td>
                      <Td className="min-w-[80px]">
                        {formatProductSpec(specs[ProductSpecKey.MemoryType])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Memory Clock</Td>
                      <Td>--</Td>
                    </Tr>
                    <Tr>
                      <Td>Memory Interface</Td>
                      <Td>
                        {formatProductSpec(
                          specs[ProductSpecKey.MemoryInterface],
                        )}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Memory Bandwidth</Td>
                      <Td>
                        {formatProductSpec(
                          specs[ProductSpecKey.MemoryBandwidth],
                        )}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">Display Connectivity</h3>

                <p className={classNames('text-content-secondary')}>
                  {`${gpu.name}'s`} resolution and output ports.
                </p>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">Max Resolution</Td>
                      <Td className="min-w-[80px]">
                        {formatProductSpec(specs[ProductSpecKey.MaxResolution])}
                      </Td>
                    </Tr>
                    {productSpecValue(specs[ProductSpecKey.MarketSegment]) ===
                      MarketSegment.Desktop && (
                      <>
                        <Tr>
                          <Td>Display Ports</Td>
                          <Td>
                            {formatProductSpec(
                              specs[ProductSpecKey.DisplayPorts],
                            )}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>HDMI Ports</Td>
                          <Td>
                            {formatProductSpec(specs[ProductSpecKey.HdmiPorts])}
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
                      </>
                    )}
                  </TBody>
                </Table>
              </article>

              <article>
                <h3 className="mb-3">API Support</h3>

                <Table border responsive>
                  <TBody>
                    <Tr>
                      <Td className="min-w-[180px]">DirextX</Td>
                      <Td className="min-w-[80px]">
                        {formatProductSpec(
                          specs[ProductSpecKey.DirectXVersion],
                        )}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>G-Sync / FreeSync</Td>
                      <Td>
                        {formatProductSpec(
                          specs[ProductSpecKey.GSyncFreeSyncSupport],
                        )}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>SLI / Crossfire</Td>
                      <Td>
                        {formatProductSpec(
                          specs[ProductSpecKey.SliCrossfireSupport],
                        )}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>VR Ready</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.VrReady])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>OpenCL</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.OpenClVersion])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>OpenGL</Td>
                      <Td>
                        {formatProductSpec(specs[ProductSpecKey.OpenGlVersion])}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Shader Model</Td>
                      <Td>
                        {formatProductSpec(
                          specs[ProductSpecKey.ShaderModelVersion],
                        )}
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
              </article>
            </article>

            <article>
              <h2 className="mb-3">Benchmarks</h2>

              <p className={classNames('text-content-secondary')}>
                {`${gpu.name}'s`} performance and rating metrics. These identify
                how strong the GPU performs compared to its peers.
              </p>

              <Table border responsive>
                <TBody>
                  <Tr>
                    <Td>
                      {benchmarks[ProductBenchmarkKey.G3dMark]?.source !=
                      null ? (
                        <a
                          href={benchmarks[ProductBenchmarkKey.G3dMark].source}
                        >
                          G3D Mark
                        </a>
                      ) : (
                        <>G3D Mark</>
                      )}
                    </Td>
                    <Td>
                      {formatProductBenchmark(
                        benchmarks[ProductBenchmarkKey.G3dMark],
                        { decimals: 0 },
                      )}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {benchmarks[ProductBenchmarkKey.G2dMark]?.source !=
                      null ? (
                        <a
                          href={benchmarks[ProductBenchmarkKey.G2dMark].source}
                        >
                          G2D Mark
                        </a>
                      ) : (
                        <>G2D Mark</>
                      )}
                    </Td>
                    <Td>
                      {formatProductBenchmark(
                        benchmarks[ProductBenchmarkKey.G2dMark],
                        { decimals: 0 },
                      )}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {benchmarks[ProductBenchmarkKey.TimeSpyGraphics]
                        ?.source != null ? (
                        <a
                          href={
                            benchmarks[ProductBenchmarkKey.TimeSpyGraphics]
                              .source
                          }
                        >
                          3DMark Time Spy Graphics
                        </a>
                      ) : (
                        <>3DMark Time Spy Graphics</>
                      )}
                    </Td>
                    <Td>
                      {formatProductBenchmark(
                        benchmarks[ProductBenchmarkKey.TimeSpyGraphics],
                        { decimals: 0 },
                      )}
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
