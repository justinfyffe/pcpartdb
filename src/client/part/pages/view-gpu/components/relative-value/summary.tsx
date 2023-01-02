import { formatSpec, getGpuName } from '@client/part';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { DateFormatter, formatOrdinalNumber } from '@client/shared/format';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const ValueSummarySentence1 = compileContent({
  deps: ['partName', 'valueYearRank', 'totalYearGpus', 'launchYear'],
  component: (props) => (
    <>
      The {props.partName} has the {props.valueYearRank} best value among{' '}
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
  const { part, contentData } = useContext(ViewPageContext);

  const params: ContentParams = {
    partName: getGpuName(part),
    company: formatSpec(part.specs?.company),
    architecture: formatSpec(part.specs?.architecture),
    launchYear: formatSpec(part.specs?.releaseDate, {
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
