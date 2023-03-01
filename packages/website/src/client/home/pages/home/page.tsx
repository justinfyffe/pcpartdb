import 'reflect-metadata';
import { CompareGpusForm } from '@pcpartdb/website/client/gpus/components';
import { ListPresetSlug } from '@pcpartdb/website/client/gpus/pages';
import { WebsiteLayout } from '@pcpartdb/website/client/shared/layouts';
import { classNames } from '@pcpartdb/website/client/shared/ui';
import { getListGpusPath } from '@pcpartdb/website/client/shared/website';
import { Gpu, GpuComparison } from '@pcpartdb/website/shared/gpus';
import React from 'react';
import {
  ComparisonFeedItem,
  ComparisonFeedTag,
  Feed,
  FeedItems,
  FeedLink,
  FeedLinks,
  GpuFeedItem,
  GpuFeedTag,
} from './components/feed';

export interface HomePageProps {
  nvidiaVsAmdGpus: GpuComparison[];
  nvidiaGpus: Gpu[];
  amdGpus: Gpu[];
}

export const HomePage = (props: HomePageProps) => {
  const { nvidiaVsAmdGpus, nvidiaGpus, amdGpus } = props;

  const [bestPerformanceComparison, bestValueComparison, randomComparison] =
    nvidiaVsAmdGpus;
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
