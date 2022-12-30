import { getGpuName } from '@client/product';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { getOrdinalNumber } from '@client/shared/format';
import { formatSpec, SpecDateFormatter } from '@shared/spec';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const PerformanceSummarySentence1 = compileContent({
  deps: ['productName', 'performanceYearRank', 'totalYearGpus', 'launchYear'],
  component: (props) => (
    <>
      The {props.productName} is the {props.performanceYearRank} strongest card
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
  const { product, contentData } = useContext(ViewPageContext);

  const params: ContentParams = {
    productName: getGpuName(product),
    company: formatSpec(product.specs?.company),
    architecture: formatSpec(product.specs?.architecture),
    launchYear: formatSpec(product.specs?.releaseDate, {
      dateFormatter: SpecDateFormatter.Year,
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
