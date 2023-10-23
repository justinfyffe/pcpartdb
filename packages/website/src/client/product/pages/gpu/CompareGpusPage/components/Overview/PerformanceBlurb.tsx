import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context/ComparePageContext';

const PerformanceIntro = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentPerformance],
    deps: [
      'gpu1PerformanceMoreOrLess',
      'gpu1PerformanceMoreOrLess',
      'gpu1PerformanceDifferencePct',
    ],
    // The GeForce RTX 2070 is a less powerful graphics card than the Radeon RX 7900,
    // delivering approximately 15% less performance than the RX 7900 in the
    // benchmarks that we track.
    component: (props) => (
      <>
        The {props.shortGpuName1} is a {props.gpu1PerformanceMoreOrLess}{' '}
        powerful graphics card than the {props.shortGpuName2}, delivering
        approximately {props.gpu1PerformanceDifferencePct}{' '}
        {props.gpu1PerformanceMoreOrLess} performance than the{' '}
        {props.shortestGpuName2} in the benchmarks that we track.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SamePerformance],
    deps: [],
    // The GeForce RTX 2070 and Radeon RX 7900 have nearly identical performances in the
    // benchmarks that we track.
    component: (props) => (
      <>
        The {props.shortGpuName1} and {props.shortGpuName2} have nearly
        identical performances in the benchmarks that we track.
      </>
    ),
  },
);

const PerformanceValue = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentPerformancePerDollar],
    deps: [
      'gpu1ValueHigherOrLower',
      'performancePerDollar1',
      'performancePerDollar2',
    ],
    // Based on their performance and launch prices, the RTX 2070 has worse
    // performance per dollar than the RX 7900. It has a performance per dollar of 23.45,
    // while the RX 7900 has a performance per dollar of 34.56.
    component: (props) => (
      <>
        Based on their performance and launch prices, the{' '}
        {props.shortestGpuName1} has a {props.gpu1ValueHigherOrLower}{' '}
        performance per dollar than the {props.shortestGpuName2}. It has a value
        rating of {props.performancePerDollar1}, while the{' '}
        {props.shortestGpuName2} has a value rating of{' '}
        {props.performancePerDollar2}.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SamePerformancePerDollar],
    deps: ['performancePerDollar1'],
    // Their performance and launch prices gives them the same performance per
    // dollar of 44.47.
    component: (props) => (
      <>
        Their performance and launch prices gives them the same performance per
        dollar of {props.performancePerDollar1}.
      </>
    ),
  },
);

const PerformanceParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <PerformanceIntro /> <PerformanceValue />
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
