import 'reflect-metadata';
import { ComparePartsForm } from '@client/part/components';
import { ListPresetSlug } from '@client/part/pages';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import { getListGpusPath } from '@client/shared/website';
import { Part, PartComparison } from '@shared/part';
import React from 'react';
import {
  ComparisonFeedItem,
  Feed,
  FeedItems,
  FeedLink,
  FeedLinks,
  PartFeedItem,
  PartFeedTag,
} from './components/feed';

export interface HomePageProps {
  nvidiaVsAmdGpus: PartComparison[];
  nvidiaGpus: Part[];
  amdGpus: Part[];
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

          <ComparePartsForm values={[null, null]} />
        </section>

        <Feed>
          <h2>NVIDIA vs AMD GPUs</h2>

          <FeedItems>
            {nvidiaVsAmdGpus.map(([nvidiaGpu, amdGpu], i) => (
              <ComparisonFeedItem key={i} parts={[nvidiaGpu, amdGpu]} />
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
              <PartFeedItem
                part={bestPerformanceNvidia}
                tag={PartFeedTag.GreatPerformance}
              />
            )}
            {bestValueNvidia != null && (
              <PartFeedItem
                part={bestValueNvidia}
                tag={PartFeedTag.GreatValue}
              />
            )}
            {randomNvidia != null && <PartFeedItem part={randomNvidia} />}
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
              <PartFeedItem
                part={bestPerformanceAmd}
                tag={PartFeedTag.GreatPerformance}
              />
            )}
            {bestValueAmd != null && (
              <PartFeedItem part={bestValueAmd} tag={PartFeedTag.GreatValue} />
            )}
            {randomAmd != null && <PartFeedItem part={randomAmd} />}
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
