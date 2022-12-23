import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { getProductName } from '@shared/product';
import { formatSpec, SpecDateFormatter } from '@shared/spec';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const PerformanceSummarySentence1 = compileContent({
  deps: ['productName', 'yearRank', 'yearTotalGpus', 'launchYear'],
  component: (props) => (
    <>
      The {props.productName} is the {props.yearRank} strongest card among the{' '}
      {props.yearTotalGpus} that also launched in {props.launchYear}.
    </>
  ),
});

export const PerformanceSummarySentence2 = compileContent({
  deps: ['architectureRank', 'architectureTotalGpus', 'company', 'companyRank'],
  component: (props) => (
    <>
      Additionally, it is the {props.companyRank} most powerful {props.company}{' '}
      GPU, and {props.architectureRank} in the {props.architecture} architecture
      family.
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
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <PerformanceSummarySentence1 /> <PerformanceSummarySentence2 />
      </p>

      <p></p>
    </ContentContext.Provider>
  );
};
