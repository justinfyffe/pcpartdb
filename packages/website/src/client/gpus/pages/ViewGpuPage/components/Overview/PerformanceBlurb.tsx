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
  deps: [
    'company',
    'performanceCompanyRank',
    'performanceYearRank',
    'totalPerformanceYearGpus',
    'year',
  ],
  component: (props) => (
    <>
      It is the {props.performanceCompanyRank} most powerful {props.company}{' '}
      GPU, and is the {props.performanceYearRank} most powerful among the{' '}
      {props.totalPerformanceYearGpus} GPUs released in {props.year}.
    </>
  ),
});

export const PerformanceBlurb = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      company: formatGpuField(gpu.company),
      gpuName: getGpuName(gpu),
      performanceCompanyRank: formatOrdinalNumber(
        gpu.ranks?.performanceCompanyRank,
      ),
      performanceYearRank: formatOrdinalNumber(gpu.ranks?.performanceYearRank),
      performanceRank: formatOrdinalNumber(gpu.ranks?.performanceRank),
      totalPerformanceGpus: contentData.totalPerformanceGpus,
      totalPerformanceYearGpus: contentData.totalPerformanceYearGpus,
      year: formatGpuField(gpu.releaseDate, {
        dateFormatter: DateFormatter.Year,
      }),
    };

    return { params };
  }, [gpu, contentData]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <PerformanceBlurbSentence1 /> <PerformanceBlurbSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
