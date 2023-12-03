import { formatOrdinalNumber } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { FunctionComponent } from 'react';
import { RankTag, SpecsTag } from '../../../content/tags';

// TODO

const PerformanceRankPlacement = compileContentComponent(
  {
    tags: [RankTag.PerformanceForMarketSegment],
    component: (props) => {
      return (
        <>
          Our combined performance rating estimates that it is{' '}
          {formatOrdinalNumber(props.performanceRankForMarketSegment as number)}{' '}
          in performance compared to the{' '}
          {props.countPerformanceRanksForMarketSegment.toLocaleString()} rated{' '}
          {props.marketSegment} CPUs in our database.
        </>
      );
    },
  },
  {
    tags: [RankTag.Performance],
    component: (props) => (
      <>
        Our combined performance rating estimates that it is{' '}
        {formatOrdinalNumber(props.performanceRank as number)} in performance
        compared to the {props.countPerformanceRanks.toLocaleString()}{' '}
        benchmarked processors in our database.
      </>
    ),
  },
);
const PerformanceBestDiff = compileContentComponent(
  {
    tags: [RankTag.BestPerformance],
    deps: [],
    component: (_props) => <></>,
  },
  {
    tags: [RankTag.Performance],
    // It is approximately 67.18% as fast as the Core i7 12345, the fastest desktop CPU in our database.
    component: (props) => (
      <>
        It is approximately {props.bestPerformanceDifferencePct}% as strong as
        the {props.bestPerformanceName}, the most powerful CPU in our database.
      </>
    ),
  },
);

const PerformanceValue = compileContentComponent({
  tags: [SpecsTag.Msrp, RankTag.Performance, RankTag.Value],
  component: (props) => (
    <>
      Its {props.performanceRating} performance score and {props.msrp} launch
      price gives it a value rating of {props.valueRating}, making it{' '}
      {formatOrdinalNumber(props.valueRank)} in performance per dollar.
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
