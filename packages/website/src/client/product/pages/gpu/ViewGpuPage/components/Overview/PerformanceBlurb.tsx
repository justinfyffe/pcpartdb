import { getGpuChipset } from '@pcpartdb/shared';
import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewGpuContentTag } from '../../content';
import { ViewPageContext } from '../../context';

const PerformanceRankPlacement = compileContentComponent({
  deps: ['chipsetShortestName', 'performanceRank', 'totalPerformanceGpus'],
  // The RTX 4070 delivers the 11th best performance among the 123 benchmarked GPUs in our database.
  component: (props) => (
    <>
      The {props.chipsetShortestName} delivers the {props.performanceRank} best
      performance among the {props.totalPerformanceGpus} benchmarked GPUs in our
      database.
    </>
  ),
});
const PerformanceBestDiff = compileContentComponent(
  {
    tags: [ViewGpuContentTag.BestPerformanceForSegment],
    deps: [],
    component: (_props) => <></>,
  },
  {
    deps: [
      'bestPerformanceDifference',
      'bestPerformanceSegmentGpuShortName',
      'marketSegment',
    ],
    // It is approximately 67.18% as fast as the GeForce RTX 4090, the fastest desktop GPU in our database.
    component: (props) => (
      <>
        It is approximately {props.bestPerformanceDifference}% as fast as the{' '}
        {props.bestPerformanceSegmentGpuShortName}, the fastest{' '}
        {props.marketSegment} GPU in our database.
      </>
    ),
  },
);

const PerformanceValue = compileContentComponent({
  tags: [],
  deps: ['chipsetLaunchPrice', 'performanceRating', 'valueRating'],
  // Its 26,638 performance rating and $599 launch price (MSRP) gives it a
  // performance per dollar of 44.47, giving it the 12th best value for desktop GPUs.
  component: (props) => (
    <>
      Its {props.performanceRating} performance rating and{' '}
      {props.chipsetLaunchPrice} launch price (MSRP) gives it a performance per
      dollar of {props.valueRating}, giving it the {props.valueRankForSegment}{' '}
      best value among {props.marketSegment} GPUs in our database.
    </>
  ),
});

export const PerformanceBlurb = () => {
  const { gpu, contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  if (getGpuChipset(gpu).performanceScore == null) {
    return <></>;
  }

  return (
    <ContentContext.Provider value={context}>
      <p>
        <PerformanceRankPlacement /> <PerformanceBestDiff />{' '}
        <PerformanceValue />
      </p>
    </ContentContext.Provider>
  );
};
