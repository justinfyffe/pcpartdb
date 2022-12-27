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

export const ValueSummarySentence1 = compileContent({
  deps: ['productName', 'valueYearRank', 'totalYearGpus', 'launchYear'],
  component: (props) => (
    <>
      The {props.productName} has the {props.valueYearRank} best value among{' '}
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
  const { product, contentData } = useContext(ViewPageContext);

  const params: ContentParams = {
    productName: getProductName(product),
    company: formatSpec(product.specs?.company),
    architecture: formatSpec(product.specs?.architecture),
    launchYear: formatSpec(product.specs?.releaseDate, {
      dateFormatter: SpecDateFormatter.Year,
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
