'use client';

import { formatOrdinalNumber } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import { RankTag } from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const PerformanceTitle = compileContentComponent(
  {
    tags: [RankTag.Performance, RankTag.Value],
    Component: (props) => <>Benchmark Performance &amp; Value</>,
  },
  {
    tags: [RankTag.Performance],
    Component: (props) => <>Benchmark Performance</>,
  },
);

const PerformanceRankPlacement = compileContentComponent({
  tags: [RankTag.Performance],
  Component: (props) => {
    return (
      <>
        The {props.nameWithNoCompanyNoBrandNoTags} has the{' '}
        {props.performanceRank > 1
          ? formatOrdinalNumber(props.performanceRank as number)
          : ''}{' '}
        best {props.preferredBenchmarkName} score among the{' '}
        {props.countPerformanceRanks.toLocaleString()} benchmarked CPUs in our
        database.
      </>
    );
  },
});

const PerformanceBestDiff = compileContentComponent(
  {
    // Example:
    tags: [RankTag.BestPerformance],
    deps: [],
    Component: (_props) => <></>,
  },
  {
    tags: [RankTag.Performance],
    Component: (props) => (
      <>
        It achieves {props.bestPerformanceDifferencePct}% of the performance of
        the best benchmarked CPU, the {props.bestPerformanceName}.
      </>
    ),
  },
);

const PerformanceValue = compileContentComponent({
  tags: [RankTag.Performance, RankTag.Value],
  Component: (props) => (
    <>
      Its {props.preferredBenchmarkPerformance} score and {props.msrp} launch
      price (MSRP) gives it a performance per dollar of{' '}
      {props.preferredBenchmarkValuePerMsrp}. This is the{' '}
      {props.valueRank > 1 ? props.valueRankOrdinal : ''} best in value for the{' '}
      {props.preferredBenchmarkShortName} benchmark.
    </>
  ),
});

const PerformanceParagraph = compileContentComponent({
  tags: [],
  Component: () => (
    <p>
      <PerformanceRankPlacement /> <PerformanceBestDiff /> <PerformanceValue />
    </p>
  ),
});

interface PerformanceBlurbProps {
  index?: number;
}

export const PerformanceBlurb: FunctionComponent<PerformanceBlurbProps> = (
  props,
) => {
  const { contentTags, contentParams } = useProductContent(props.index);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <h3>
        <PerformanceTitle />
      </h3>
      <PerformanceParagraph />
    </ContentProvider>
  );
};
