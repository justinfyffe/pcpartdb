import { formatSpec, getGpuName } from '@client/part';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const ProcessorSummarySentence1 = compileContent({
  deps: ['partName', 'architecture', 'processSize'],
  component: (props) => (
    <>
      {props.partName} uses the {props.architecture} architecture and is based
      on {props.processSize} manufacturing process.
    </>
  ),
});

export const ProcessorSummary = () => {
  const { part } = useContext(ViewPageContext);

  const { specs } = part;

  const params: ContentParams = {
    partName: getGpuName(part),
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
