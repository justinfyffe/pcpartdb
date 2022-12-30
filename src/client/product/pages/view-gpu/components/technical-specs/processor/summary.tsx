import { formatSpec, getGpuName } from '@client/product';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const ProcessorSummarySentence1 = compileContent({
  deps: ['productName', 'architecture', 'processSize'],
  component: (props) => (
    <>
      {props.productName} uses the {props.architecture} architecture and is
      based on {props.processSize} manufacturing process.
    </>
  ),
});

export const ProcessorSummary = () => {
  const { product } = useContext(ViewPageContext);

  const { specs } = product;

  const params: ContentParams = {
    productName: getGpuName(product),
    architecture: formatSpec(specs.architecture),
    processSize: formatSpec(specs.processSize),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <ProcessorSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
