import { formatSpec, getGpuName } from '@client/part';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { DateFormatter, formatOrdinalNumber } from '@client/shared/format';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const PerformanceSummarySentence1 = compileContent({
  deps: ['partName', 'performanceYearRank', 'totalYearGpus', 'launchYear'],
  component: (props) => (
    <>
      The {props.partName} is the {props.performanceYearRank} strongest card
      among {props.totalYearGpus} benchmarked GPUs that launched in{' '}
      {props.launchYear}.
    </>
  ),
});

export const PerformanceSummarySentence2 = compileContent({
  deps: ['performanceArchitectureRank', 'company', 'architecture'],
  component: (props) => (
    <>
      It is also the {props.performanceArchitectureRank} most powerful card in
      the {props.company} {props.architecture} architecture family.
    </>
  ),
});

export const PerformanceSummary = () => {
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
        <PerformanceSummarySentence1 /> <PerformanceSummarySentence2 />
      </p>
    </ContentContext.Provider>
  );
};
