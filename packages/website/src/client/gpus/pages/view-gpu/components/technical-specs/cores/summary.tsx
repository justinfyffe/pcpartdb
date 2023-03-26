import React, { useContext } from 'react';
import { formatGpuField } from '../../../../../../gpus';
import {
  compileContentComponent,
  ContentContext,
  ContentComponentParams,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const CoresSummarySentence1 = compileContentComponent({
  deps: ['coreClockSpeedBase', 'cores', 'fp32Performance', 'fp64Performance'],
  component: (props) => (
    <>
      This card operates at a base clock speed of {props.coreClockSpeedBase}.
      The {props.cores} Cores gives it a FP32 performance of{' '}
      {props.fp32Performance} and FP64 performance of {props.fp64Performance}.
    </>
  ),
});

export const CoresSummarySentence2 = compileContentComponent({
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

  const params: ContentComponentParams = {
    cores: formatGpuField(gpu.specs?.shaderUnitsCudaCores),
    coreClockSpeedBase: formatGpuField(gpu.specs?.coreClockSpeedBase),
    fp32Performance: formatGpuField(gpu.specs?.fp32Performance),
    fp64Performance: formatGpuField(gpu.specs?.fp64Performance),
    rops: formatGpuField(gpu.specs?.renderOutputUnits),
    pixelFillRate: formatGpuField(gpu.specs?.pixelFillRate),
    tmus: formatGpuField(gpu.specs?.textureMappingUnits),
    textureFillRate: formatGpuField(gpu.specs?.textureFillRate),
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
