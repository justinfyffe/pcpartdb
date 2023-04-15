import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../../shared/content';
import {
  formatGpuDimensions,
  formatGpuField,
  getGpuName,
} from '../../../../..';
import { ViewPageContext } from '../../../context';

export const CompatibilitySummarySentence1 = compileContentComponent({
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

  const context = useMemo(() => {
    const params: ContentComponentParams = {
      gpuName: getGpuName(gpu),
      slotWidth: formatGpuField(gpu.slotWidth),
      dimensions: formatGpuDimensions(gpu),
      tdp: formatGpuField(gpu.thermalDesignPower),
      suggestedPsu: formatGpuField(gpu.suggestedPsu),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <CompatibilitySummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
