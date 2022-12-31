import 'reflect-metadata';
import { CompareProductsForm } from '@client/product/components';
import { ListPresetSlug } from '@client/product/pages';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import { getListGpusPath } from '@client/shared/website';
import { Product, ProductComparison } from '@shared/product';
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

  const [bestPerformanceNvidia, bestValueNvidia, randomNvidia] = nvidiaGpus;
  const [bestPerformanceAmd, bestValueAmd, randomAmd] = amdGpus;

  const title = 'GPU specifications, benchmarks, and comparisons';
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
            <FeedLink href={getListGpusPath(ListPresetSlug.BestPerformance)}>
              Best performing GPUs
            </FeedLink>
            <FeedLink href={getListGpusPath(ListPresetSlug.BestValue)}>
              Best value GPUs
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
            {randomNvidia != null && <ProductFeedItem product={randomNvidia} />}
          </FeedItems>

          <FeedLinks>
            <FeedLink
              href={getListGpusPath(ListPresetSlug.BestPerformanceNvidia)}
            >
              Best performing NVIDIA GPUs
            </FeedLink>
            <FeedLink href={getListGpusPath(ListPresetSlug.BestValueNvidia)}>
              Best value NVIDIA GPUs
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
            {randomAmd != null && <ProductFeedItem product={randomAmd} />}
          </FeedItems>

          <FeedLinks>
            <FeedLink href={getListGpusPath(ListPresetSlug.BestPerformanceAmd)}>
              Best performing AMD GPUs
            </FeedLink>
            <FeedLink href={getListGpusPath(ListPresetSlug.BestValueAmd)}>
              Best value AMD GPUs
            </FeedLink>
          </FeedLinks>
        </Feed>
      </section>
    </WebsiteLayout>
  );
};

export default HomePage;
