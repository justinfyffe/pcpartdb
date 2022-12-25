import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { getProductName } from '@shared/product';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CompatibilitySummarySentence1 = compileContent({
  deps: ['productName'],
  component: (props) => (
    <>
      The {props.productName} is quite large, taking up SLOTS with dimensions of
      DIMENSIONS. The GPU has a Thermal Design Power (TDP) of
      THERMAL_DESIGN_POWER and it is recommended to be used with a minimum
      SUGGESTED_PSU PSU.
    </>
  ),
});

export const CompatibilitySummary = () => {
  const { product } = useContext(ViewPageContext);

  const params: ContentParams = {
    productName: getProductName(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <CompatibilitySummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
