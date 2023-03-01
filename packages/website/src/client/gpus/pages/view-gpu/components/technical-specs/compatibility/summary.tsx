import {
  formatGpuDimensions,
  formatGpuField,
  getGpuName,
} from '@pcpartdb/website/client/gpus';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@pcpartdb/website/client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CompatibilitySummarySentence1 = compileContent({
  deps: ['gpuName', 'slotWidth', 'dimensions', 'tdp', 'suggestedPsu'],
  component: (props) => (
    <>
      The {props.gpuName} is quite large, being a {props.slotWidth} card with
      dimensions of {props.dimensions}. The GPU has a Thermal Design Power (TDP)
      of {props.tdp} and it is recommended to be used with a minimum{' '}
      {props.suggestedPsu} PSU.
    </>
  ),
});

export const CompatibilitySummary = () => {
  const { gpu } = useContext(ViewPageContext);

  const params: ContentParams = {
    gpuName: getGpuName(gpu),
    slotWidth: formatGpuField(gpu.specs?.slotWidth),
    dimensions: formatGpuDimensions(gpu),
    tdp: formatGpuField(gpu.specs?.thermalDesignPower),
    suggestedPsu: formatGpuField(gpu.specs?.suggestedPsu),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <CompatibilitySummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
