import { ContentTag } from '@pcpartdb/shared';
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
      The {props.gpuName} is the {props.performanceRank} best performing GPU
      among the {props.totalPerformanceGpus} benchmarked graphics cards in our
      database.
    </>
  ),
});

const PerformanceBlurbSentence2 = compileContentComponent({
  deps: ['company', 'performanceSegmentCompanyRank', 'marketSegment'],
  component: (props) => (
    <>
      It has the {props.performanceSegmentCompanyRank} highest performance
      rating among {props.marketSegment} {props.company} GPUs.
    </>
  ),
});

const PerformanceBlurbSentence3 = compileContentComponent(
  {
    tags: [ContentTag.BestPerformanceSegmentYear],
    deps: ['totalPerformanceSegmentYearGpus', 'year', 'marketSegment'],
    component: (props) => (
      <>
        Its performance rating is the highest among the {props.marketSegment}{' '}
        {props.totalPerformanceSegmentYearGpus} GPUs released in {props.year}.
      </>
    ),
  },
  {
    deps: [
      'performanceSegmentYearRank',
      'totalPerformanceSegmentYearGpus',
      'year',
      'marketSegment',
    ],
    component: (props) => (
      <>
        Its performance rating puts it at {props.performanceSegmentYearRank}{' '}
        among the {props.totalPerformanceSegmentYearGpus} {props.marketSegment}{' '}
        GPUs released in {props.year}.
      </>
    ),
  },
);

export const PerformanceBlurb = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const tags = contentData.contentTags;
    const params = {
      company: formatGpuField(gpu.company),
      gpuName: getGpuName(gpu),
      marketSegment: formatGpuField(gpu.marketSegment).toLowerCase(),
      performanceSegmentCompanyRank:
        gpu.ranks?.performanceSegmentCompanyRank > 1
          ? formatOrdinalNumber(gpu.ranks?.performanceSegmentCompanyRank)
          : '',
      performanceSegmentYearRank: formatOrdinalNumber(
        gpu.ranks?.performanceSegmentYearRank,
      ),
      performanceRank:
        gpu.ranks?.performanceRank > 1
          ? formatOrdinalNumber(gpu.ranks?.performanceRank)
          : '',
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
