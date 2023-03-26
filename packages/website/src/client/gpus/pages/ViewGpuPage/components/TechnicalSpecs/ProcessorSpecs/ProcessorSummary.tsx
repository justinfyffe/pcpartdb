import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../../shared/content';
import { formatGpuField, getGpuName } from '../../../../..';
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

  const context = useMemo(() => {
    const params: ContentComponentParams = {
      gpuName: getGpuName(gpu),
      architecture: formatGpuField(specs.architecture),
      processSize: formatGpuField(specs.processSize),
    };

    return { params };
  }, [gpu, specs]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <ProcessorSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
