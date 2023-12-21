import { formatOrdinalNumber } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { FunctionComponent } from 'react';
import { RankTag } from '../../../content/tags';

const PerformanceRankPlacement = compileContentComponent({
  tags: [RankTag.Performance],
  component: (props) => {
    return (
      <>
        The {props.nameWithNoCompany} has the{' '}
        {props.performanceRank > 1
          ? formatOrdinalNumber(props.performanceRank as number)
          : ''}{' '}
        highest {props.preferredBenchmarkName} score among the{' '}
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
    component: (_props) => <></>,
  },
  {
    tags: [RankTag.Performance],
    component: (props) => (
      <>
        It achieves {props.bestPerformanceDifferencePct}% of the performance of
        the best benchmarked CPU, the {props.bestPerformanceName}.
      </>
    ),
  },
);

const PerformanceValue = compileContentComponent({
  tags: [RankTag.Performance, RankTag.Value],
  component: (props) => (
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
  component: () => (
    <p>
      <PerformanceRankPlacement /> <PerformanceBestDiff /> <PerformanceValue />
    </p>
  ),
});

interface PerformanceBlurbProps {
  tags?: ContentTags;
  params?: ContentParams;
}

export const PerformanceBlurb: FunctionComponent<PerformanceBlurbProps> = (
  props,
) => {
  const { tags, params } = props;
  const context = { tags, params };

  return (
    <ContentContext.Provider value={context}>
      <PerformanceParagraph />
    </ContentContext.Provider>
  );
};
