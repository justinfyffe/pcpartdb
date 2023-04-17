import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewGpuContentTag } from '../../content';
import { ViewPageContext } from '../../context';

const PerformanceBlurbSentence1 = compileContentComponent({
  deps: ['shortGpuName', 'performanceRank', 'totalPerformanceGpus'],
  component: (props) => (
    <>
      The {props.shortGpuName} delivers the {props.performanceRank} best
      performance among the {props.totalPerformanceGpus} benchmarked GPUs in our
      database.
    </>
  ),
});

const PerformanceBlurbSentence2 = compileContentComponent({
  deps: ['performanceRankForSegmentYear', 'marketSegment', 'year'],
  component: (props) => (
    <>
      It is the {props.performanceRankForSegmentYear} strongest{' '}
      {props.marketSegment} card that released in {props.year}.
    </>
  ),
});

const PerformanceBlurbSentence3 = compileContentComponent(
  {
    tags: [ViewGpuContentTag.BestPerformanceForSegmentYear],
    component: () => <></>,
  },
  {
    deps: [
      'bestPerformanceDifference',
      'bestPerformanceSegmentGpuName',
      'marketSegment',
    ],
    component: (props) => (
      <>
        It is approximately {props.bestPerformanceDifference}% as fast as the{' '}
        {props.bestPerformanceSegmentGpuName}, the fastest {props.marketSegment}{' '}
        GPU.
      </>
    ),
  },
);

export const PerformanceBlurb = () => {
  const { gpu, contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  if (gpu.performanceScore == null) {
    return <></>;
  }

  return (
    <ContentContext.Provider value={context}>
      <p>
        <PerformanceBlurbSentence1 /> <PerformanceBlurbSentence2 />{' '}
        <PerformanceBlurbSentence3 />
      </p>
    </ContentContext.Provider>
  );
};
