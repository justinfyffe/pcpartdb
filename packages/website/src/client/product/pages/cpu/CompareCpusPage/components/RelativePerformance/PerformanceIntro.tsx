import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { CompareCpusContentTag } from '../../content';
import { ComparePageContext } from '../../context/ComparePageContext';

export const PerformanceIntroParagraph = compileContentComponent(
  {
    tags: [CompareCpusContentTag.DifferentMarketSegment],
    deps: ['marketSegment1', 'marketSegment2'],
    component: (props) => (
      <p className="text-dimmed">
        Compare {props.shortCpuName1} and {props.shortCpuName2}&apos;s
        performance with similar {props.marketSegment1} and{' '}
        {props.marketSegment2} CPUs. Relative performance provides insight into
        how its benchmarks compare to its peers.
      </p>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameMarketSegment],
    deps: ['marketSegment1'],
    component: (props) => (
      <p className="text-dimmed">
        Compare {props.shortCpuName1} and {props.shortCpuName2}&apos;s
        performance with similar {props.marketSegment1} CPUs. Relative
        performance provides insight into how its benchmarks compare to its
        peers.
      </p>
    ),
  },
  {
    tags: [],
    deps: [],
    component: (props) => (
      <p className="text-dimmed">
        Compare {props.shortCpuName1} and {props.shortCpuName2}&apos;s
        performance with similar CPUs. Relative performance provides insight
        into how its benchmarks compare to its peers.
      </p>
    ),
  },
);

export const PerformanceIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <PerformanceIntroParagraph />
    </ContentContext.Provider>
  );
};
