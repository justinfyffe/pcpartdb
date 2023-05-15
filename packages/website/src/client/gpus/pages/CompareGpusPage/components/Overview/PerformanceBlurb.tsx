import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

const PerformanceIntro = compileContentComponent(
  {
    tags: [
      CompareGpusContentTag.DifferentChipset,
      CompareGpusContentTag.DifferentPerformance,
    ],
    deps: [
      'gpu1PerformanceMoreOrLess',
      'gpu1PerformanceHigherOrLower',
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
        {props.gpu1PerformanceHigherOrLower} performance than the{' '}
        {props.shortestGpuName2} in the benchmarks that we track.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.DifferentChipset,
      CompareGpusContentTag.SamePerformance,
    ],
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

  {
    tags: [CompareGpusContentTag.SameChipset],
    deps: [],
    // The ROG STRIX RTX 4070 GAMING OC and DUAL RTX 4070 WHITE are based on the same chipset,
    // giving them nearly identical performances. It may vary slightly based on their specs like
    // clock speed and memory.
    component: (props) => (
      <>
        The {props.shortGpuName1} and {props.shortGpuName2} are based on the
        same chipset, giving them nearly identical performances. It may vary
        slightly based on their specs like clock speed and memory.
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
        performance per dollar than the {props.shortestGpuName2}. It has a
        performance per dollar of {props.performancePerDollar1}, while the{' '}
        {props.shortestGpuName2} has a performance per dollar of{' '}
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
