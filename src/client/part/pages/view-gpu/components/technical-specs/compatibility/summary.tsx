import { formatDimensions, formatSpec, getGpuName } from '@client/part';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CompatibilitySummarySentence1 = compileContent({
  deps: ['partName', 'slotWidth', 'dimensions', 'tdp', 'suggestedPsu'],
  component: (props) => (
    <>
      The {props.partName} is quite large, being a {props.slotWidth} card with
      dimensions of {props.dimensions}. The GPU has a Thermal Design Power (TDP)
      of {props.tdp} and it is recommended to be used with a minimum{' '}
      {props.suggestedPsu} PSU.
    </>
  ),
});

export const CompatibilitySummary = () => {
  const { part } = useContext(ViewPageContext);

  const params: ContentParams = {
    partName: getGpuName(part),
    slotWidth: formatSpec(part.specs?.slotWidth),
    dimensions: formatDimensions(part),
    tdp: formatSpec(part.specs?.thermalDesignPower),
    suggestedPsu: formatSpec(part.specs?.suggestedPsu),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <CompatibilitySummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
