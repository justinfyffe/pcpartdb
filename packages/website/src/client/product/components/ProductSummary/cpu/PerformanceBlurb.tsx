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

const PerformanceRankPlacement = compileContentComponent({
  tags: [RankTag.Performance],
  component: (props) => (
    <>
      {props.company}&apos;s {props.nameWithNoCompanyNoBrand} delivers the{' '}
      {formatOrdinalNumber(props.performanceRank as number)} best performance
      among the {props.countPerformanceRanks.toLocaleString()} benchmarked
      processors in our database.
    </>
  ),
});
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
        It is approximately {props.bestPerformanceDifferencePct}% as fast as the{' '}
        {props.bestPerformanceName}, the fastest CPU in our database.
      </>
    ),
  },
);

const PerformanceValue = compileContentComponent({
  tags: [SpecsTag.Msrp, RankTag.Performance, RankTag.Value],
  component: (props) => (
    <>
      Its {props.performanceRating} performance rating and {props.msrp} launch
      price gives it a value rating of {props.valueRating}, giving it the{' '}
      {formatOrdinalNumber(props.valueRank)} best value among CPUs in our
      database.
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
