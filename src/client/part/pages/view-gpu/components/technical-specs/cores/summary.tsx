import { formatSpec } from '@client/part';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CoresSummarySentence1 = compileContent({
  deps: ['coreClockSpeedBase', 'cores', 'fp32Performance', 'fp64Performance'],
  component: (props) => (
    <>
      This card operates at a base clock speed of {props.coreClockSpeedBase}.
      The {props.cores} Cores gives it a FP32 performance of{' '}
      {props.fp32Performance} and FP64 performance of {props.fp64Performance}.
    </>
  ),
});

export const CoresSummarySentence2 = compileContent({
  deps: ['rops', 'pixelFillRate', 'tmus', 'textureFillRate'],
  component: (props) => (
    <>
      The {props.rops} Render Output Units (ROPs) gives it a pixel fill rate of
      {props.pixelFillRate}. The {props.tmus} Texture Mapping Units (TMUs) gives
      it a texture fill rate of {props.textureFillRate}.
    </>
  ),
});

export const CoresSummary = () => {
  const { part } = useContext(ViewPageContext);

  const params: ContentParams = {
    cores: formatSpec(part.specs?.shaderUnitsCudaCores),
    coreClockSpeedBase: formatSpec(part.specs?.coreClockSpeedBase),
    fp32Performance: formatSpec(part.specs?.fp32Performance),
    fp64Performance: formatSpec(part.specs?.fp64Performance),
    rops: formatSpec(part.specs?.renderOutputUnits),
    pixelFillRate: formatSpec(part.specs?.pixelFillRate),
    tmus: formatSpec(part.specs?.textureMappingUnits),
    textureFillRate: formatSpec(part.specs?.textureFillRate),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <CoresSummarySentence1 />
      </p>
      <p>
        <CoresSummarySentence2 />
      </p>
    </ContentContext.Provider>
  );
};
