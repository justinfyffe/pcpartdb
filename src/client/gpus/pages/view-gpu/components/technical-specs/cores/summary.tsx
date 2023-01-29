import { formatGpuSpec } from '@client/gpus';
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
  const { gpu } = useContext(ViewPageContext);

  const params: ContentParams = {
    cores: formatGpuSpec(gpu.specs?.shaderUnitsCudaCores),
    coreClockSpeedBase: formatGpuSpec(gpu.specs?.coreClockSpeedBase),
    fp32Performance: formatGpuSpec(gpu.specs?.fp32Performance),
    fp64Performance: formatGpuSpec(gpu.specs?.fp64Performance),
    rops: formatGpuSpec(gpu.specs?.renderOutputUnits),
    pixelFillRate: formatGpuSpec(gpu.specs?.pixelFillRate),
    tmus: formatGpuSpec(gpu.specs?.textureMappingUnits),
    textureFillRate: formatGpuSpec(gpu.specs?.textureFillRate),
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
