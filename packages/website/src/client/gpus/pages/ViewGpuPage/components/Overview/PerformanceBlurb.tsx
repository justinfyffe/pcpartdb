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
  deps: ['company', 'performanceCompanyRank'],
  component: (props) => (
    <>
      It has the {props.performanceCompanyRank} highest performance rating among{' '}
      {props.company} GPUs.
    </>
  ),
});

const PerformanceBlurbSentence3 = compileContentComponent(
  {
    tags: [ContentTag.BestPerformanceYear],
    deps: ['performanceYearRank', 'totalPerformanceYearGpus', 'year'],
    component: (props) => (
      <>
        Its performance rating is the highest among the{' '}
        {props.totalPerformanceYearGpus} GPUs released in {props.year}.
      </>
    ),
  },
  {
    deps: ['performanceYearRank', 'totalPerformanceYearGpus', 'year'],
    component: (props) => (
      <>
        Its performance rating puts it at {props.performanceYearRank} among the{' '}
        {props.totalPerformanceYearGpus} GPUs released in {props.year}.
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
      performanceCompanyRank:
        gpu.ranks?.performanceCompanyRank > 1
          ? formatOrdinalNumber(gpu.ranks?.performanceCompanyRank)
          : '',
      performanceYearRank: formatOrdinalNumber(gpu.ranks?.performanceYearRank),
      performanceRank:
        gpu.ranks?.performanceRank > 1
          ? formatOrdinalNumber(gpu.ranks?.performanceRank)
          : '',
      totalPerformanceGpus: contentData.totalPerformanceGpus,
      totalPerformanceYearGpus: contentData.totalPerformanceYearGpus,
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
