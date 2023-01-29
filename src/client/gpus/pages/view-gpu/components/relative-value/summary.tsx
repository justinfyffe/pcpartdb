import { formatGpuSpec, getGpuName } from '@client/gpus';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { DateFormatter, formatOrdinalNumber } from '@client/shared/format';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const ValueSummarySentence1 = compileContent({
  deps: ['gpuName', 'valueYearRank', 'totalYearGpus', 'launchYear'],
  component: (props) => (
    <>
      The {props.gpuName} has the {props.valueYearRank} best value among{' '}
      {props.totalYearGpus} GPUs that launched in {props.launchYear}.
    </>
  ),
});

export const ValueSummarySentence2 = compileContent({
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
    company: formatGpuSpec(gpu.specs?.company),
    architecture: formatGpuSpec(gpu.specs?.architecture),
    launchYear: formatGpuSpec(gpu.specs?.releaseDate, {
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
