import React, { useContext } from 'react';
import { formatGpuField, getGpuName } from '../../../../../gpus';
import {
  compileContentComponent,
  ContentContext,
  ContentComponentParams,
} from '../../../../../shared/content';
import {
  DateFormatter,
  formatOrdinalNumber,
} from '../../../../../shared/format';
import { ViewPageContext } from '../../context';

export const PerformanceSummarySentence1 = compileContentComponent({
  deps: ['gpuName', 'performanceYearRank', 'totalYearGpus', 'launchYear'],
  component: (props) => (
    <>
      The {props.gpuName} is the {props.performanceYearRank} strongest card
      among {props.totalYearGpus} benchmarked GPUs that launched in{' '}
      {props.launchYear}.
    </>
  ),
});

export const PerformanceSummarySentence2 = compileContentComponent({
  deps: ['performanceArchitectureRank', 'company', 'architecture'],
  component: (props) => (
    <>
      It is also the {props.performanceArchitectureRank} most powerful card in
      the {props.company} {props.architecture} architecture family.
    </>
  ),
});

export const PerformanceSummary = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const params: ContentComponentParams = {
    gpuName: getGpuName(gpu),
    company: formatGpuField(gpu.company),
    architecture: formatGpuField(gpu.specs?.architecture),
    launchYear: formatGpuField(gpu.releaseDate, {
      dateFormatter: DateFormatter.Year,
    }),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <PerformanceSummarySentence1 /> <PerformanceSummarySentence2 />
      </p>
    </ContentContext.Provider>
  );
};
