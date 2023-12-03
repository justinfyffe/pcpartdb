import { formatOrdinalNumber } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React from 'react';
import { RankTag } from '../../../content/tags';

const PerformanceRankPlacement = compileContentComponent(
  {
    // Example: The RTX 4070 chipset delivers the 11th best performance
    //          among the 123 benchmarked desktop GPUs in our database.
    tags: [RankTag.PerformanceForMarketSegment],
    component: (props) => {
      return (
        <>
          Our combined performance rating estimates that its chipset, the{' '}
          {props.chipsetNameWithNoCompanyNoBrand}, is{' '}
          {formatOrdinalNumber(props.performanceRankForMarketSegment as number)}{' '}
          in performance compared to the{' '}
          {props.countPerformanceRanksForMarketSegment.toLocaleString()} rated{' '}
          {props.marketSegment} GPUs in our database.
        </>
      );
    },
  },
  {
    // Example: The RTX 4070 chipset delivers the 11th best performance
    //          among the 123 benchmarked GPUs in our database.
    tags: [RankTag.Performance],
    component: (props) => {
      return (
        <>
          Our combined performance rating estimates that its chipset, the{' '}
          {props.chipsetNameWithNoCompanyNoBrand} is{' '}
          {formatOrdinalNumber(props.performanceRank as number)} in performance
          compared to the {props.countPerformanceRanks.toLocaleString()} rated
          GPUs in our database.
        </>
      );
    },
  },
);

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
        It is approximately {props.bestPerformanceDifferencePct}% as strong as
        the {props.bestPerformanceName}, the most powerful GPU in our database.
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
      Its {props.performanceRating} performance score and {props.msrp} launch
      price (MSRP) gives it a value rating of {props.valueRating}, making it the{' '}
      {formatOrdinalNumber(props.valueRank)} in performance per dollar.
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
