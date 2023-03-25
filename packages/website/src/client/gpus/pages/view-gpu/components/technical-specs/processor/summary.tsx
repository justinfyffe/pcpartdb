import React, { useContext } from 'react';
import { formatGpuField, getGpuName } from '../../../../../../gpus';
import {
  compileContentComponent,
  ContentContext,
  ContentParams,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const ProcessorSummarySentence1 = compileContentComponent({
  deps: ['gpuName', 'architecture', 'processSize'],
  component: (props) => (
    <>
      {props.gpuName} uses the {props.architecture} architecture and is based on{' '}
      {props.processSize} manufacturing process.
    </>
  ),
});

export const ProcessorSummary = () => {
  const { gpu } = useContext(ViewPageContext);

  const { specs } = gpu;

  const params: ContentParams = {
    gpuName: getGpuName(gpu),
    architecture: formatGpuField(specs.architecture),
    processSize: formatGpuField(specs.processSize),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <ProcessorSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
