import {
  compileContentComponent,
  ContentContext,
} from 'packages/website/src/client/shared/content';
import React, { useContext } from 'react';
import { CompareCpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

const PerformanceSentence = compileContentComponent(
  {
    tags: [CompareCpusContentTag.SamePerformance],
    deps: [],
    component: (props) => (
      <>
        The {props.shortCpuName1} and {props.shortCpuName2} have nearly
        identical performances in the benchmarks that we track.
      </>
    ),
  },
  {
    tags: [],
    deps: [
      'cpu1PerformanceMoreOrLess',
      'cpu1PerformanceHigherOrLower',
      'cpu1PerformanceDifferencePct',
    ],
    component: (props) => (
      <>
        The {props.shortCpuName1} is a {props.cpu1PerformanceMoreOrLess}{' '}
        powerful processor than the {props.shortCpuName2}, delivering
        approximately {props.cpu1PerformanceDifferencePct}{' '}
        {props.cpu1PerformanceHigherOrLower} performance than the{' '}
        {props.shortestCpuName2} in the benchmarks that we track.
      </>
    ),
  },
);

const ValueSentence = compileContentComponent(
  {
    tags: [CompareCpusContentTag.SamePerformancePerDollar],
    deps: ['performancePerDollar1'],
    component: (props) => (
      <>
        Their performance and launch prices gives them the same performance per
        dollar of {props.performancePerDollar1}.
      </>
    ),
  },
  {
    tags: [],
    deps: [
      'cpu1ValueHigherOrLower',
      'performancePerDollar1',
      'performancePerDollar2',
    ],
    component: (props) => (
      <>
        Based on their performance and launch prices, the{' '}
        {props.shortestCpuName1} has a {props.cpu1ValueHigherOrLower}{' '}
        performance per dollar than the {props.shortestCpuName2}. It has a
        performance per dollar of {props.performancePerDollar1}, while the{' '}
        {props.shortestCpuName2} has a performance per dollar of{' '}
        {props.performancePerDollar2}.
      </>
    ),
  },
);

const PerformanceParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <PerformanceSentence /> <ValueSentence />
    </p>
  ),
});

export const PerformanceBlurb = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <PerformanceParagraph />
    </ContentContext.Provider>
  );
};
