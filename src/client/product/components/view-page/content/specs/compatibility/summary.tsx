import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { getProductName } from '@shared/product';
import { formatDimensions, formatSpec } from '@shared/spec';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CompatibilitySummarySentence1 = compileContent({
  deps: ['productName', 'slotWidth', 'dimensions', 'tdp', 'suggestedPsu'],
  component: (props) => (
    <>
      The {props.productName} is quite large, being a {props.slotWidth} card
      with dimensions of {props.dimensions}. The GPU has a Thermal Design Power
      (TDP) of {props.tdp} and it is recommended to be used with a minimum{' '}
      {props.suggestedPsu} PSU.
    </>
  ),
});

export const CompatibilitySummary = () => {
  const { product } = useContext(ViewPageContext);

  const params: ContentParams = {
    productName: getProductName(product),
    slotWidth: formatSpec(product.specs?.slotWidth),
    dimensions: formatDimensions(product),
    tdp: formatSpec(product.specs?.thermalDesignPower),
    suggestedPsu: formatSpec(product.specs?.suggestedPsu),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <CompatibilitySummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
