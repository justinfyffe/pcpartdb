import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

export const PerformanceIntroSentence1 = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentMarketSegment],
    deps: ['marketSegment1', 'marketSegment2'],
    component: (props) => (
      <>
        Compare {props.shortGpuName1} and {props.shortGpuName2}&apos;s
        performance with similar {props.marketSegment1} and{' '}
        {props.marketSegment2} GPUs. Relative performance provides insight into
        how their benchmarks compare to their peers. This data is based on
        chipset performance.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameMarketSegment],
    deps: ['marketSegment1'],
    component: (props) => (
      <>
        Compare {props.shortGpuName1} and {props.shortGpuName2}&apos;s
        performance with similar {props.marketSegment1} GPUs. Relative
        performance provides insight into how their benchmarks compare to their
        peers. This data is based on chipset performance.
      </>
    ),
  },
  {
    tags: [],
    deps: [],
    component: (props) => (
      <>
        Compare {props.shortGpuName1} and {props.shortGpuName2}&apos;s
        performance with similar GPUs. Relative performance provides insight
        into how their benchmarks compare to their peers. This data is based on
        chipset performance.
      </>
    ),
  },
);

export const PerformanceIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <PerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
