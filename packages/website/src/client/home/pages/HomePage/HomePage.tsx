import 'reflect-metadata';
import {
  getHomePath,
  getListGpusPath,
  HomeViewModel,
  ListGpusPresetSlug,
} from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import { CompareGpusForm } from '../../../gpus/components';
import { Seo } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';
import { classNames } from '../../../shared/ui';
import {
  ComparisonFeedItem,
  ComparisonFeedTag,
  Feed,
  FeedItems,
  FeedLink,
  FeedLinks,
  GpuFeedItem,
  GpuFeedTag,
} from './components';

export const HomePage = (props: HomeViewModel) => {
  const { nvidiaVsAmdGpus, nvidiaGpus, amdGpus } = props;

  const [bestPerformanceComparison, bestValueComparison, randomComparison] =
    nvidiaVsAmdGpus;
  const [bestPerformanceNvidia, bestValueNvidia, randomNvidia] = nvidiaGpus;
  const [bestPerformanceAmd, bestValueAmd, randomAmd] = amdGpus;

  const pageTitle = 'GPU specifications, benchmarks, and comparisons';
  const seoTitle = `${pageTitle}`;
  const seoDescription =
    'View and compare GPU specs and benchmarks. ' +
    'Our database of PC Parts will help you choose the best parts for your computer.';
  const seoCanonical = useMemo(() => getHomePath(), []);
  const seoKeywords: string[] = [];

  return (
    <WebsiteLayout>
      <Seo
        title={seoTitle}
        keywords={seoKeywords}
        description={seoDescription}
        canonical={seoCanonical}
      />
      <section className="flex flex-col gap-8 justify-center">
        <section className={classNames('flex flex-col justify-center gap-4')}>
          <h1 className="md:text-2xl text-3xl mb-0">{pageTitle}</h1>

          <CompareGpusForm values={[null, null]} />
        </section>

        <Feed>
          <h2>NVIDIA vs AMD GPUs</h2>

          <FeedItems>
            {bestPerformanceComparison != null && (
              <ComparisonFeedItem
                comparison={bestPerformanceComparison}
                tag={ComparisonFeedTag.ComparePerformance}
              />
            )}
            {bestValueComparison != null && (
              <ComparisonFeedItem
                comparison={bestValueComparison}
                tag={ComparisonFeedTag.CompareValue}
              />
            )}
            {randomComparison != null && (
              <ComparisonFeedItem comparison={randomComparison} />
            )}
          </FeedItems>

          <FeedLinks>
            <FeedLink
              href={getListGpusPath(ListGpusPresetSlug.BestPerformance)}
            >
              Best performing GPUs
            </FeedLink>
            <FeedLink href={getListGpusPath(ListGpusPresetSlug.BestValue)}>
              Best value GPUs
            </FeedLink>
          </FeedLinks>
        </Feed>

        <Feed>
          <h2>Popular NVIDIA GPUs</h2>

          <FeedItems>
            {bestPerformanceNvidia != null && (
              <GpuFeedItem
                gpu={bestPerformanceNvidia}
                tag={GpuFeedTag.GreatPerformance}
              />
            )}
            {bestValueNvidia != null && (
              <GpuFeedItem gpu={bestValueNvidia} tag={GpuFeedTag.GreatValue} />
            )}
            {randomNvidia != null && <GpuFeedItem gpu={randomNvidia} />}
          </FeedItems>

          <FeedLinks>
            <FeedLink
              href={getListGpusPath(ListGpusPresetSlug.BestPerformanceNvidia)}
            >
              Best performing NVIDIA GPUs
            </FeedLink>
            <FeedLink
              href={getListGpusPath(ListGpusPresetSlug.BestValueNvidia)}
            >
              Best value NVIDIA GPUs
            </FeedLink>
          </FeedLinks>
        </Feed>

        <Feed>
          <h2>Popular AMD GPUs</h2>

          <FeedItems>
            {bestPerformanceAmd != null && (
              <GpuFeedItem
                gpu={bestPerformanceAmd}
                tag={GpuFeedTag.GreatPerformance}
              />
            )}
            {bestValueAmd != null && (
              <GpuFeedItem gpu={bestValueAmd} tag={GpuFeedTag.GreatValue} />
            )}
            {randomAmd != null && <GpuFeedItem gpu={randomAmd} />}
          </FeedItems>

          <FeedLinks>
            <FeedLink
              href={getListGpusPath(ListGpusPresetSlug.BestPerformanceAmd)}
            >
              Best performing AMD GPUs
            </FeedLink>
            <FeedLink href={getListGpusPath(ListGpusPresetSlug.BestValueAmd)}>
              Best value AMD GPUs
            </FeedLink>
          </FeedLinks>
        </Feed>
      </section>
    </WebsiteLayout>
  );
};

export default HomePage;
