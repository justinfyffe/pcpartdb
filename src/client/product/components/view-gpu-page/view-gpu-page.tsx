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
  BoltIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { Product } from '@shared/product';
import {
  formatProductBenchmark,
  ProductBenchmarkKey,
} from '@shared/product-benchmark';
import { formatProductMeta, ProductMetaKey } from '@shared/product-meta';
import { ProductReviewKey } from '@shared/product-review';
import { formatProductSpec, ProductSpecKey } from '@shared/product-spec';
import { NextPageContext } from 'next';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { productService } from '../../product-service';
import { CompareProductsForm } from '../compare-products-form';
import { createProductContextState, ProductContext } from '../product-context';
import { ProductImages } from '../product-images';
import { BenchmarkRow } from './benchmark-row';
import { CustomRow } from './custom-row';
import { ReviewRow } from './review-row';
import { SpecRow } from './spec-row';

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
                <ul className={classNames('flex flex-col gap-3 lg:gap-4')}>
                  <li
                    className={classNames(
                      'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                    )}
                  >
                    <div
                      className={classNames('flex-1 flex gap-2 items-center')}
                    >
                      <div className="mr-1">
                        <ShoppingCartIcon className="w-[20px] lg:w-[30px]"></ShoppingCartIcon>
                      </div>

                      <div
                        className={classNames(
                          'font-medium text-xl lg:text-2xl',
                        )}
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
                      Check Price
                    </Button>
                  </li>

                  <li
                    className={classNames(
                      'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                    )}
                  >
                    <div
                      className={classNames('flex-1 flex gap-2 items-center')}
                    >
                      <div className="mr-1">
                        <StarIcon className="w-[20px] lg:w-[30px]"></StarIcon>
                      </div>

                      <div
                        className={classNames(
                          'font-medium text-xl lg:text-2xl',
                        )}
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
                    <div
                      className={classNames('flex-1 flex gap-2 items-center')}
                    >
                      <div className="mr-1">
                        <CurrencyDollarIcon className="w-[20px] lg:w-[30px]"></CurrencyDollarIcon>
                      </div>

                      <div
                        className={classNames(
                          'font-medium text-xl lg:text-2xl',
                        )}
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
                    <div
                      className={classNames('flex-1 flex gap-2 items-center')}
                    >
                      <div className="mr-1">
                        <CircleStackIcon className="w-[20px] lg:w-[30px]"></CircleStackIcon>
                      </div>

                      <div
                        className={classNames(
                          'font-medium text-xl lg:text-2xl',
                        )}
                      >
                        Memory
                      </div>
                    </div>

                    <div
                      className={classNames(
                        'text-md lg:text-lg text-slate-600 text-right',
                      )}
                    >
                      {formatProductSpec(specs[ProductSpecKey.MemorySize])}{' '}
                      {formatProductSpec(specs[ProductSpecKey.MemoryType])}
                    </div>
                  </li>

                  <li
                    className={classNames(
                      'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                    )}
                  >
                    <div
                      className={classNames('flex-1 flex gap-2 items-center')}
                    >
                      <div className="mr-1">
                        <CubeTransparentIcon className="w-[20px] lg:w-[30px]"></CubeTransparentIcon>
                      </div>

                      <div
                        className={classNames(
                          'font-medium text-xl lg:text-2xl',
                        )}
                      >
                        Dimensions
                      </div>
                    </div>

                    <div
                      className={classNames(
                        'text-md lg:text-lg text-slate-600 text-right',
                      )}
                    >
                      {formatProductSpec(specs[ProductSpecKey.Length], {
                        suffix: false,
                      })}
                      {' x '}
                      {formatProductSpec(specs[ProductSpecKey.Width], {
                        suffix: false,
                      })}
                      {' x '}
                      {formatProductSpec(specs[ProductSpecKey.Height], {
                        suffix: false,
                      })}{' '}
                      mm
                    </div>
                  </li>

                  <li
                    className={classNames(
                      'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                    )}
                  >
                    <div
                      className={classNames('flex-1 flex gap-2 items-center')}
                    >
                      <div className="mr-1">
                        <BoltIcon className="w-[20px] lg:w-[30px]"></BoltIcon>
                      </div>

                      <div
                        className={classNames(
                          'font-medium text-xl lg:text-2xl',
                        )}
                      >
                        TDP
                      </div>
                    </div>

                    <div
                      className={classNames(
                        'text-md lg:text-lg text-slate-600 text-right',
                      )}
                    >
                      {formatProductSpec(specs[ProductSpecKey.Tdp])}
                    </div>
                  </li>

                  <li
                    className={classNames(
                      'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                    )}
                  >
                    <div
                      className={classNames('flex-1 flex gap-2 items-center')}
                    >
                      <div className="mr-1">
                        <CalendarDaysIcon className="w-[20px] lg:w-[30px]"></CalendarDaysIcon>
                      </div>

                      <div
                        className={classNames(
                          'font-medium text-xl lg:text-2xl',
                        )}
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
              <section>
                <h2 className="mb-3">General Info</h2>

                <p className={classNames('text-content-secondary')}>
                  {`${gpu.name}'s`} performance rating, market segment, release
                  date, and price.
                </p>

                <Table border responsive>
                  <TBody>
                    <CustomRow label="Performance Rating (Rank)">
                      {formatProductBenchmark(
                        benchmarks[ProductBenchmarkKey.PerformanceScore],
                      )}{' '}
                      ({formatProductMeta(meta[ProductMetaKey.PerformanceRank])}
                      )
                    </CustomRow>
                    <CustomRow label="Performance Per Dollar (Rank)">
                      {formatProductBenchmark(
                        benchmarks[ProductBenchmarkKey.ValueScore],
                      )}{' '}
                      ({formatProductMeta(meta[ProductMetaKey.ValueRank])})
                    </CustomRow>
                    <SpecRow spec={ProductSpecKey.Company} />
                    <SpecRow spec={ProductSpecKey.MarketSegment} />
                    <SpecRow spec={ProductSpecKey.ReleaseDate} />
                    <SpecRow spec={ProductSpecKey.LaunchPrice} />
                  </TBody>
                </Table>
              </section>

              <section>
                <h2 className="mb-3">Reviews</h2>

                <p className={classNames('text-content-secondary')}>
                  What others are saying about {gpu.name}.
                </p>

                <Table border responsive>
                  <TBody>
                    <ReviewRow review={ProductReviewKey.Amazon} />
                    <ReviewRow review={ProductReviewKey.PcGamer} />
                    <ReviewRow review={ProductReviewKey.TechRadar} />
                    <ReviewRow review={ProductReviewKey.TechSpot} />
                    <ReviewRow review={ProductReviewKey.TomsHardware} />
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

                  <Table border responsive>
                    <TBody>
                      <SpecRow spec={ProductSpecKey.GpuName} />
                      <SpecRow spec={ProductSpecKey.Architecture} />
                      <SpecRow spec={ProductSpecKey.Lithography} />
                      <SpecRow spec={ProductSpecKey.Transistors} />
                    </TBody>
                  </Table>
                </section>

                <section>
                  <h3 className="mb-3">Memory</h3>

                  <p className={classNames('text-content-secondary')}>
                    {`${gpu.name}'s`} memory size, bandwidth, and clock speeds.
                  </p>

                  <Table border responsive>
                    <TBody>
                      <SpecRow spec={ProductSpecKey.MemorySize} />
                      <SpecRow spec={ProductSpecKey.MemoryType} />
                      <SpecRow spec={ProductSpecKey.MemoryBandwidth} />
                      <Tr>
                        <Td>Memory Clock</Td>
                        <Td>--</Td>
                      </Tr>
                      <SpecRow spec={ProductSpecKey.MemoryInterface} />
                    </TBody>
                  </Table>
                </section>

                <section>
                  <h3 className="mb-3">Board Compatibility &amp; Dimensions</h3>

                  <p className={classNames('text-content-secondary')}>
                    {`${gpu.name}'s`} dimensions, bus interface, and power
                    consumption.
                  </p>

                  <Table border responsive>
                    <TBody>
                      <SpecRow spec={ProductSpecKey.SlotWidth} />
                      <SpecRow spec={ProductSpecKey.Length} />
                      <SpecRow spec={ProductSpecKey.Width} />
                      <SpecRow spec={ProductSpecKey.Height} />
                      <SpecRow spec={ProductSpecKey.Weight} />
                      <SpecRow spec={ProductSpecKey.BusInterface} />
                      <SpecRow spec={ProductSpecKey.Tdp} />
                      <SpecRow spec={ProductSpecKey.SuggestedPsu} />
                      <SpecRow spec={ProductSpecKey.PowerConnectors} />
                    </TBody>
                  </Table>
                </section>

                <section>
                  <h3 className="mb-3">Display Connectivity</h3>

                  <p className={classNames('text-content-secondary')}>
                    {`${gpu.name}'s`} resolution and output ports.
                  </p>

                  <Table border responsive>
                    <TBody>
                      <SpecRow spec={ProductSpecKey.DisplayPorts} />
                      <SpecRow spec={ProductSpecKey.HdmiPorts} />
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
                </section>

                <section>
                  <h3 className="mb-3">Cores &amp; Clock Speeds</h3>

                  <p className={classNames('text-content-secondary')}>
                    {`${gpu.name}'s`} cores, clock speed, and cache.
                  </p>

                  <Table border responsive>
                    <TBody>
                      <SpecRow spec={ProductSpecKey.CudaCores} />
                      <SpecRow spec={ProductSpecKey.Tmus} />
                      <SpecRow spec={ProductSpecKey.Rops} />
                      <SpecRow spec={ProductSpecKey.TensorCores} />
                      <SpecRow spec={ProductSpecKey.RtCores} />
                      <SpecRow spec={ProductSpecKey.ClockSpeedBase} />
                      <SpecRow spec={ProductSpecKey.ClockSpeedBoost} />
                      <SpecRow spec={ProductSpecKey.L1Cache} />
                      <SpecRow spec={ProductSpecKey.L2Cache} />
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

                  <Table border responsive>
                    <TBody>
                      <SpecRow spec={ProductSpecKey.PixelFillRate} />
                      <SpecRow spec={ProductSpecKey.TextureRate} />
                      <SpecRow spec={ProductSpecKey.Fp32Performance} />
                      <SpecRow spec={ProductSpecKey.Fp64Performance} />
                    </TBody>
                  </Table>
                </section>

                <section>
                  <h3 className="mb-3">API Support</h3>

                  <Table border responsive>
                    <TBody>
                      <SpecRow spec={ProductSpecKey.DirectXVersion} />
                      <SpecRow spec={ProductSpecKey.GSyncFreeSyncSupport} />
                      <SpecRow spec={ProductSpecKey.SliCrossfireSupport} />
                      <SpecRow spec={ProductSpecKey.OpenClVersion} />
                      <SpecRow spec={ProductSpecKey.OpenGlVersion} />
                      <SpecRow spec={ProductSpecKey.ShaderModelVersion} />
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

                <Table border responsive>
                  <TBody>
                    <BenchmarkRow benchmark={ProductBenchmarkKey.G3dMark} />
                    <BenchmarkRow benchmark={ProductBenchmarkKey.G2dMark} />
                    <BenchmarkRow
                      benchmark={ProductBenchmarkKey.TimeSpyGraphics}
                    />
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
