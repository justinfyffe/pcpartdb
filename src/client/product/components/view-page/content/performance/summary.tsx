import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { getOrdinalNumber } from '@shared/content';
import { getProductName } from '@shared/product';
import { formatSpec, SpecDateFormatter } from '@shared/spec';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const PerformanceSummarySentence1 = compileContent({
  deps: ['productName', 'performanceYearRank', 'totalYearGpus', 'launchYear'],
  component: (props) => (
    <>
      The {props.productName} is the {props.performanceYearRank} strongest card
      among the {props.totalYearGpus} GPUs that also launched in{' '}
      {props.launchYear}.
    </>
  ),
});

export const PerformanceSummarySentence2 = compileContent({
  deps: ['performanceArchitectureRank', 'totalArchitectureGpus', 'company'],
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
    productName: getProductName(product),
    company: formatSpec(product.specs?.company),
    launchYear: formatSpec(product.specs?.releaseDate, {
      dateFormatter: SpecDateFormatter.Year,
    }),

    totalYearGpus: contentData.totalYearGpus,
    performanceYearRank: getOrdinalNumber(contentData.performanceYearRank),

    totalArchitectureGpus: contentData.totalArchitectureGpus,
    performanceArchitectureRank: getOrdinalNumber(
      contentData.performanceArchitectureRank,
    ),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <PerformanceSummarySentence1 /> <PerformanceSummarySentence2 />
      </p>
    </ContentContext.Provider>
  );
};
