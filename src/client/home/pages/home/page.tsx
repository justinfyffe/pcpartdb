import 'reflect-metadata';
import { CompareProductsForm } from '@client/product/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import { Product, ProductComparison, ProductsSort } from '@shared/product';
import React from 'react';
import {
  ComparisonFeedItem,
  Feed,
  FeedItems,
  FeedLink,
  FeedLinks,
  ProductFeedItem,
  ProductFeedTag,
} from './components/feed';

export interface HomePageProps {
  nvidiaVsAmdGpus: ProductComparison[];
  nvidiaGpus: Product[];
  amdGpus: Product[];
}

export const HomePage = (props: HomePageProps) => {
  const { nvidiaVsAmdGpus, nvidiaGpus, amdGpus } = props;

  const [bestPerformanceNvidia, bestValueNvidia] = nvidiaGpus;
  const [bestPerformanceAmd, bestValueAmd] = amdGpus;

  const title = 'GPU Specifications, Benchmarks, and Comparisons';
  const canonical = '/';
  const keywords: string[] = [];

  return (
    <WebsiteLayout seo={{ title, keywords, canonical }}>
      <section className="flex flex-col gap-8 justify-center">
        <section className={classNames('flex flex-col justify-center gap-4')}>
          <h1 className="md:text-2xl text-3xl mb-0">{title}</h1>

          <CompareProductsForm values={[null, null]} />
        </section>

        <Feed>
          <h2>NVIDIA vs AMD GPUs</h2>

          <FeedItems>
            {nvidiaVsAmdGpus.map(([nvidiaGpu, amdGpu], i) => (
              <ComparisonFeedItem key={i} products={[nvidiaGpu, amdGpu]} />
            ))}
          </FeedItems>

          <FeedLinks>
            <FeedLink href="/gpus">All GPUs</FeedLink>
            <FeedLink href={`/gpus?sort=${ProductsSort.PerformanceRating}`}>
              Best Performing GPUs
            </FeedLink>
            <FeedLink href={`/gpus?sort=${ProductsSort.ValueRating}`}>
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
            <FeedLink href="/gpus?company=nvidia">All NVIDIA GPUs</FeedLink>
            <FeedLink
              href={`/gpus?company=nvidia&sort=${ProductsSort.PerformanceRating}`}
            >
              Best Performing NVIDIA GPUs
            </FeedLink>
            <FeedLink
              href={`/gpus?company=nvidia&sort=${ProductsSort.ValueRating}`}
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
            <FeedLink href="/gpus?company=amd">All AMD GPUs</FeedLink>
            <FeedLink
              href={`/gpus?company=amd&sort=${ProductsSort.PerformanceRating}`}
            >
              Best Performing AMD GPUs
            </FeedLink>
            <FeedLink
              href={`/gpus?company=amd&sort=${ProductsSort.ValueRating}`}
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
