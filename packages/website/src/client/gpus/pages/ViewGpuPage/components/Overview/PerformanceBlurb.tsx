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
  deps: ['gpuName', 'performanceRank', 'totalPerformanceGpus'],
  component: (props) => (
    <>
      The {props.gpuName} delivers the {props.performanceRank} best performance
      among the {props.totalPerformanceGpus} benchmarked GPUs in our database.
    </>
  ),
});

const PerformanceBlurbSentence2 = compileContentComponent({
  deps: [
    'company',
    'performanceRankForCompanySegment',
    'performanceRankForSegmentYear',
    'marketSegment',
    'year',
  ],
  component: (props) => (
    <>
      It is {props.company}&apos;s {props.performanceRankForCompanySegment}{' '}
      strongest {props.marketSegment} card and had the{' '}
      {props.performanceRankForSegmentYear} best performance rating of the{' '}
      {props.marketSegment} graphics cards that released in {props.year}.
    </>
  ),
});

const PerformanceBlurbSentence3 = compileContentComponent({
  deps: [
    'bestPerformanceDifference',
    'bestPerformanceSegmentGpuName',
    'bestPerformanceSegmentGpuPath',
    'shortGpuName',
  ],
  component: (props) => (
    <>
      Its performance rating is {props.bestPerformanceDifference}% of the top
      rated GPU, the{' '}
      <a href={props.bestPerformanceSegmentGpuPath as string}>
        {props.bestPerformanceSegmentGpuName}
      </a>
      .
    </>
  ),
});

export const PerformanceBlurb = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const bestPerformanceSegmentGpu = contentData.bestPerformanceGpuForSegment;
    // const bestPerformanceDifference = (
    //   100 *
    //   (bestPerformanceSegmentGpu.benchmarks?.performanceScore?.value /
    //     gpu.benchmarks?.performanceScore?.value -
    //     1)
    // ).toFixed(2);
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
      gpuName: getGpuName(gpu),
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

  return (
    <ContentContext.Provider value={context}>
      <p>
        <PerformanceBlurbSentence1 /> <PerformanceBlurbSentence2 />{' '}
        <PerformanceBlurbSentence3 />
      </p>
    </ContentContext.Provider>
  );
};
