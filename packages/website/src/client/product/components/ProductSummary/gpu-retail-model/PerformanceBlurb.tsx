import { formatOrdinalNumber } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React from 'react';
import { RankTag } from '../../../content/tags';

const PerformanceRankPlacement = compileContentComponent({
  // Example: The RTX 4070 chipset delivers the 11th best performance
  //          among the 123 benchmarked GPUs in our database.
  tags: [RankTag.Performance],
  component: (props) => {
    return (
      <>
        This graphics card is a retail model for the{' '}
        {props.chipsetNameWithNoCompany} chipset, which has the{' '}
        {props.performanceRank > 1
          ? formatOrdinalNumber(props.performanceRank as number)
          : ''}{' '}
        highest {props.preferredBenchmarkName} score among the{' '}
        {props.countPerformanceRanks.toLocaleString()} benchmarked GPUs in our
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
    // Example: It is approximately 67.18% as fast as the GeForce RTX 4090,
    //          the most powerful GPU in our database.
    tags: [RankTag.Performance],
    component: (props) => (
      <>
        It achieves {props.bestPerformanceDifferencePct}% of the performance of
        the best benchmarked GPU, the {props.bestPerformanceName}.
      </>
    ),
  },
);

const PerformanceValue = compileContentComponent({
  tags: [RankTag.Performance, RankTag.Value],
  // Its 99.8 performance rating and $599 launch price (MSRP) gives it a
  // value rating of 44.47, making it the 12th best in performance per dollar.
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
  deps: [],
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

export const PerformanceBlurb = (props: PerformanceBlurbProps) => {
  const { tags, params } = props;
  const context = { tags, params };

  return (
    <ContentContext.Provider value={context}>
      <PerformanceParagraph />
    </ContentContext.Provider>
  );
};
