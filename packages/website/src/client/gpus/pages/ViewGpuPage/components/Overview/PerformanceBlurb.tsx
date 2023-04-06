import { ContentTag, getViewGpuPath } from '@pcpartdb/shared';
import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import {
  DateFormatter,
  formatOrdinalNumber,
} from '../../../../../shared/format';
import { formatGpuField, getGpuName } from '../../../..';
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
    tags: [ContentTag.BestPerformanceForSegmentYear],
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
  const { gpu, contentData } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const bestPerformanceSegmentGpu = contentData.bestPerformanceGpuForSegment;
    const bestPerformanceDifference = (
      100 *
      (gpu.benchmarks?.performanceScore?.value /
        bestPerformanceSegmentGpu.benchmarks?.performanceScore?.value)
    ).toFixed(2);

    const tags = contentData.contentTags;
    const params = {
      bestPerformanceDifference,
      bestPerformanceSegmentGpuName: getGpuName(bestPerformanceSegmentGpu),
      bestPerformanceSegmentGpuPath: getViewGpuPath(bestPerformanceSegmentGpu),
      company: formatGpuField(gpu.company),
      marketSegment: formatGpuField(gpu.marketSegment).toLowerCase(),
      performanceRankForCompanySegment:
        gpu.ranks?.performanceRankForCompanySegment > 1
          ? formatOrdinalNumber(gpu.ranks?.performanceRankForCompanySegment)
          : '',
      performanceRankForSegmentYear:
        gpu.ranks?.performanceRankForSegmentYear > 1
          ? formatOrdinalNumber(gpu.ranks?.performanceRankForSegmentYear)
          : '',
      performanceRank:
        gpu.ranks?.performanceRank > 1
          ? formatOrdinalNumber(gpu.ranks?.performanceRank)
          : '',
      shortGpuName: getGpuName(gpu, { company: false }),
      totalPerformanceGpus: contentData.totalPerformanceGpus,
      totalPerformanceSegmentYearGpus:
        contentData.totalPerformanceSegmentYearGpus,
      year: formatGpuField(gpu.releaseDate, {
        dateFormatter: DateFormatter.Year,
      }),
    };

    return { tags, params };
  }, [gpu, contentData]);

  if (gpu.benchmarks?.performanceScore == null) {
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
