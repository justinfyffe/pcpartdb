import 'reflect-metadata';
import {
  CompareProductsForm,
  ComparisonFeedItem,
  Feed,
  FeedItems,
  FeedLink,
  FeedLinks,
  ProductFeedItem,
  ProductFeedTag,
} from '@client/product';
import { useProductCache } from '@client/shared/cache';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import { Product, ProductsOrderBy } from '@shared/product';
import React, { useMemo } from 'react';

export interface HomePageProps {
  nvidiaVsAmdGpus: [Product, Product][];
  nvidiaGpus: Product[];
  amdGpus: Product[];
}

export const HomePage = (props: HomePageProps) => {
  const { nvidiaVsAmdGpus, nvidiaGpus, amdGpus } = props;
  const comparisonGpus = useMemo(
    () => nvidiaVsAmdGpus.flat(),
    [nvidiaVsAmdGpus],
  );
  useProductCache(comparisonGpus, nvidiaGpus, amdGpus);

  const [bestPerformanceNvidia, bestValueNvidia] = nvidiaGpus;
  const [bestPerformanceAmd, bestValueAmd] = amdGpus;

  return (
    <WebsiteLayout>
      <section className="flex flex-col gap-8 justify-center">
        <section className={classNames('flex flex-col justify-center gap-4')}>
          <h1 className="md:text-2xl text-3xl mb-0">
            GPU Specifications, Benchmarks, and Comparisons
          </h1>

          <CompareProductsForm values={[null, null]} />

          <section className="flex flex-col gap-1 text-xs">
            <div className="flex gap-2">
              Popular Comparisons:
              <ul className="flex gap-3">
                <li>
                  <a href="#">NVIDIA RTX 3090 vs NVIDIA RTX 3080</a>,
                </li>
                <li>
                  <a href="#">NVIDIA RTX 3080 vs NVIDIA RTX 3070</a>
                </li>
              </ul>
            </div>
            <div className="flex gap-2">
              Popular GPUs:
              <ul className="flex gap-3">
                <li>
                  <a href="#">NVIDIA RTX 3090</a>,
                </li>
                <li>
                  <a href="#">NVIDIA RTX 3080</a>
                </li>
              </ul>
            </div>
          </section>
        </section>

        <Feed>
          <h2>NVIDIA vs AMD GPUs</h2>

          <FeedItems>
            {nvidiaVsAmdGpus.map(([nvidiaGpu, amdGpu], i) => (
              <ComparisonFeedItem key={i} products={[nvidiaGpu, amdGpu]} />
            ))}
          </FeedItems>

          <FeedLinks>
            <FeedLink href="/gpus/list">All GPUs</FeedLink>
            <FeedLink
              href={`/gpus/list?sort=${ProductsOrderBy.PerformanceRating}`}
            >
              Best Performing GPUs
            </FeedLink>
            <FeedLink href={`/gpus/list?sort=${ProductsOrderBy.ValueRating}`}>
              Best Value GPUs
            </FeedLink>
          </FeedLinks>
        </Feed>

        <Feed>
          <h2>Popular NVIDIA GPUs</h2>

          <FeedItems>
            {bestPerformanceNvidia != null && (
              <ProductFeedItem
                product={bestPerformanceNvidia}
                tag={ProductFeedTag.GreatPerformance}
              />
            )}
            {bestValueNvidia != null && (
              <ProductFeedItem
                product={bestValueNvidia}
                tag={ProductFeedTag.GreatValue}
              />
            )}
          </FeedItems>

          <FeedLinks>
            <FeedLink href="/gpus/list?company=nvidia">
              All NVIDIA GPUs
            </FeedLink>
            <FeedLink
              href={`/gpus/list?company=nvidia&sort=${ProductsOrderBy.PerformanceRating}`}
            >
              Best Performing NVIDIA GPUs
            </FeedLink>
            <FeedLink
              href={`/gpus/list?company=nvidia&sort=${ProductsOrderBy.ValueRating}`}
            >
              Best Value NVIDIA GPUs
            </FeedLink>
          </FeedLinks>
        </Feed>

        <Feed>
          <h2>Popular AMD GPUs</h2>

          <FeedItems>
            {bestPerformanceAmd != null && (
              <ProductFeedItem
                product={bestPerformanceAmd}
                tag={ProductFeedTag.GreatPerformance}
              />
            )}
            {bestValueAmd != null && (
              <ProductFeedItem
                product={bestValueAmd}
                tag={ProductFeedTag.GreatValue}
              />
            )}
          </FeedItems>

          <FeedLinks>
            <FeedLink href="/gpus/list?company=amd">All AMD GPUs</FeedLink>
            <FeedLink
              href={`/gpus/list?company=amd&sort=${ProductsOrderBy.PerformanceRating}`}
            >
              Best Performing AMD GPUs
            </FeedLink>
            <FeedLink
              href={`/gpus/list?company=amd&sort=${ProductsOrderBy.ValueRating}`}
            >
              Best Value AMD GPUs
            </FeedLink>
          </FeedLinks>
        </Feed>
      </section>
    </WebsiteLayout>
  );
};

export default HomePage;
