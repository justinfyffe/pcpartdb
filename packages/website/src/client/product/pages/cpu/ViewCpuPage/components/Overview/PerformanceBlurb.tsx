import { hasProductFieldValue } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewCpuContentTag } from '../../content/getContentTags';
import { ViewPageContext } from '../../context/ViewPageContext';

const PerformanceRankPlacement = compileContentComponent({
  deps: ['shortCpuName', 'performanceRank', 'totalPerformanceCpus'],
  // The Core i7 12345 delivers the 11th best performance among the 123 benchmarked processors in our database.
  component: (props) => (
    <>
      {props.company}&apos;s {props.shortCpuName} delivers the{' '}
      {props.performanceRank} best performance among the{' '}
      {props.totalPerformanceCpus} benchmarked processors in our database.
    </>
  ),
});
const PerformanceBestDiff = compileContentComponent(
  {
    tags: [ViewCpuContentTag.BestPerformance],
    deps: [],
    component: (_props) => <></>,
  },
  {
    deps: ['bestPerformanceDifference', 'bestPerformanceShortCpuName'],
    // It is approximately 67.18% as fast as the Core i7 12345, the fastest desktop CPU in our database.
    component: (props) => (
      <>
        It is approximately {props.bestPerformanceDifference}% as fast as the{' '}
        {props.bestPerformanceShortCpuName}, the fastest CPU in our database.
      </>
    ),
  },
);

const PerformanceValue = compileContentComponent({
  tags: [],
  deps: ['launchPrice', 'performanceRating', 'valueRating'],
  // Its 26,638 performance rating and $599 launch price (MSRP) gives it a
  // performance per dollar of 44.47, giving it the 12th best value for CPUs.
  component: (props) => (
    <>
      Its {props.performanceRating} performance rating and {props.launchPrice}{' '}
      launch price (MSRP) gives it a performance per dollar of{' '}
      {props.valueRating}, giving it the {props.valueRank} best value among CPUs
      in our database.
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

export const PerformanceBlurb = () => {
  const { cpu, contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  if (!hasProductFieldValue(cpu.fields?.performanceRating)) {
    return <></>;
  }

  return (
    <ContentContext.Provider value={context}>
      <PerformanceParagraph />
    </ContentContext.Provider>
  );
};
