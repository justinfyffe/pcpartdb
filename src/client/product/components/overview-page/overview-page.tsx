import { useProductCache } from '@client/shared/cache';
import { Breadcrumb, Breadcrumbs, Card } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import {
  getProductDetailsPath,
  getProductName,
  Product,
  ProductComparison,
  ProductsSort,
  RelatedProducts,
} from '@shared/product';
import { formatSpec } from '@shared/spec';
import React, { useMemo } from 'react';
import {
  CompareProductsForm,
  CompareProductsFormLinks,
} from '../compare-products-form';
import {
  ComparisonFeedItem,
  Feed,
  FeedItems,
  FeedLink,
  FeedLinks,
  ProductFeedItem,
} from '../feed';

export interface OverviewGpusPageProps {
  gpusByPerformance: Product[];
  gpusByValue: Product[];

  relatedProducts: RelatedProducts;
}

export const OverviewGpusPage = (props: OverviewGpusPageProps) => {
  const { gpusByPerformance, gpusByValue, relatedProducts } = props;
  useProductCache(gpusByPerformance, gpusByValue);

  const title = 'Compare GPU Specifications, Benchmarks, and Comparisons';
  const canonical = '/gpus';
  const keywords: string[] = [];

  const popularComparisons = useMemo(() => {
    return [
      [gpusByPerformance[0], gpusByPerformance[1]],
      [gpusByValue[0], gpusByValue[1]],
      [gpusByPerformance[1], gpusByPerformance[2]],
    ] as ProductComparison[];
  }, [gpusByPerformance, gpusByValue]);

  const popularGpus = useMemo(() => {
    return gpusByPerformance.slice(0, 3);
  }, [gpusByPerformance]);

  return (
    <WebsiteLayout seo={{ title, keywords, canonical }}>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb>GPUs</Breadcrumb>
      </Breadcrumbs>

      <section className="flex flex-col gap-8 justify-center">
        <section className={classNames('flex flex-col justify-center gap-4')}>
          <h1 className="md:text-2xl text-3xl mb-0">
            Compare GPU Specifications, Benchmarks, and Comparisons
          </h1>

          <CompareProductsForm values={[null, null]} />
          <CompareProductsFormLinks relatedProducts={relatedProducts} />
        </section>

        <section
          className={classNames(
            'grid grid-cols-2 grid-rows-[auto] gap-8 w-full',
          )}
        >
          <Card as="article" className="gap-0">
            <h2
              className={classNames('font-medium text-2xl text-slate-700 mb-0')}
            >
              Best Gaming GPUs by Performance
            </h2>

            <p className={classNames('text-gray-400')}>
              Sorted by highest performance benchmarks
            </p>

            <ul className={classNames('flex flex-col gap-4 mb-4')}>
              {gpusByPerformance.map((gpu, i) => (
                <a
                  key={gpu.id}
                  href={getProductDetailsPath(gpu)}
                  className="text-inherit"
                >
                  <li
                    className={classNames(
                      'bg-slate-200 flex gap-4 items-center justify-between px-4 py-2 rounded shadow',
                    )}
                  >
                    <div
                      className={classNames(
                        'flex items-center justify-center h-ful text-2xl font-medium',
                      )}
                    >
                      #{i + 1}
                    </div>
                    <div className={classNames('flex-1 font-medium text-2xl')}>
                      {getProductName(gpu)}
                    </div>
                    <div
                      className={classNames(
                        'flex flex-col items-end justify-between text-lg',
                      )}
                    >
                      <div>{formatSpec(gpu.specs?.launchPrice)}</div>
                      <div>{formatSpec(gpu.specs?.releaseDate)}</div>
                    </div>
                  </li>
                </a>
              ))}
            </ul>

            <div className={classNames('self-end')}>
              <a
                href={`/gpus/list?sort=${ProductsSort.PerformanceRating}`}
                className={classNames('text-indigo-400')}
              >
                View all GPUs by performance
              </a>
            </div>
          </Card>

          <Card as="article" className="gap-0">
            <h2
              className={classNames('font-medium text-2xl text-slate-700 mb-0')}
            >
              Best Gaming GPUs by Value
            </h2>

            <p className={classNames('text-gray-400')}>
              Sorted by performance benchmark per dollar
            </p>

            <ul className={classNames('flex flex-col gap-4 mb-4')}>
              {gpusByValue.map((gpu, i) => (
                <a
                  key={gpu.id}
                  href={getProductDetailsPath(gpu)}
                  className="text-inherit"
                >
                  <li
                    key={gpu.id}
                    className={classNames(
                      'bg-slate-200 flex gap-4 items-center justify-between px-4 py-2 rounded shadow',
                    )}
                  >
                    <div
                      className={classNames(
                        'flex items-center justify-center h-full text-2xl font-medium',
                      )}
                    >
                      #{i + 1}
                    </div>
                    <div className={classNames('flex-1 font-medium text-2xl')}>
                      {getProductName(gpu)}
                    </div>
                    <div
                      className={classNames(
                        'flex flex-col items-end justify-between text-lg',
                      )}
                    >
                      <div>{formatSpec(gpu.specs?.launchPrice)}</div>
                      <div>{formatSpec(gpu.specs?.releaseDate)}</div>
                    </div>
                  </li>
                </a>
              ))}
            </ul>

            <div className={classNames('self-end')}>
              <a
                href={`/gpus/list?sort=${ProductsSort.ValueRating}`}
                className={classNames('text-indigo-400')}
              >
                View all GPUs by performance per dollar
              </a>
            </div>
          </Card>
        </section>

        <Feed>
          <h2>Popular Comparisons</h2>

          <FeedItems>
            {popularComparisons.map((comparison, i) => (
              <ComparisonFeedItem key={i} products={comparison} />
            ))}
          </FeedItems>
        </Feed>

        <Feed>
          <h2>Popular GPUs</h2>

          <FeedItems>
            {popularGpus.map((gpu, i) => (
              <ProductFeedItem key={i} product={gpu} />
            ))}
          </FeedItems>

          <FeedLinks>
            <FeedLink href="/gpus/list">All GPUs</FeedLink>
            <FeedLink
              href={`/gpus/list?sort=${ProductsSort.PerformanceRating}`}
            >
              Best Performing GPUs
            </FeedLink>
            <FeedLink href={`/gpus/list?sort=${ProductsSort.ValueRating}`}>
              Best Value GPUs
            </FeedLink>
          </FeedLinks>
        </Feed>
      </section>
    </WebsiteLayout>
  );
};
