import React, { useContext } from 'react';
import { formatGpuField, getGpuName } from '../../../../../gpus';
import {
  compileContentComponent,
  ContentContext,
  ContentParams,
} from '../../../../../shared/content';
import {
  DateFormatter,
  formatOrdinalNumber,
} from '../../../../../shared/format';
import { ViewPageContext } from '../../context';

export const ValueSummarySentence1 = compileContentComponent({
  deps: ['gpuName', 'valueYearRank', 'totalYearGpus', 'launchYear'],
  component: (props) => (
    <>
      The {props.gpuName} has the {props.valueYearRank} best value among{' '}
      {props.totalYearGpus} GPUs that launched in {props.launchYear}.
    </>
  ),
});

export const ValueSummarySentence2 = compileContentComponent({
  deps: ['valueArchitectureRank', 'company', 'architecture'],
  component: (props) => (
    <>
      It is also the {props.valueArchitectureRank} best bang for your buck
      compared to other GPUs in the {props.company} {props.architecture}{' '}
      architecture family.
    </>
  ),
});

export const ValueSummary = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const params: ContentParams = {
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
        <ValueSummarySentence1 /> <ValueSummarySentence2 />
      </p>
    </ContentContext.Provider>
  );
};
