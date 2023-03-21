import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { formatGpuDimensions, formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

const DimensionsBlurbSentence1 = compileContentComponent({
  deps: ['dimensions', 'gpuName', 'height', 'slotWidth'],
  component: (props) => (
    <>
      The {props.gpuName} has dimensions measuring {props.dimensions}. The
      graphics card takes up {props.slotWidth} PCIe slots. This is in-line with
      most GPUs as dual-slot cards are the most common among modern graphics
      cards.
    </>
  ),
});

export const DimensionsBlurb = () => {
  const { gpu } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      dimensions: formatGpuDimensions(gpu),
      gpuName: getGpuName(gpu),
      height: formatGpuField(gpu.specs?.height),
      slotWidth: formatGpuField(gpu.specs?.slotWidth),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <DimensionsBlurbSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
