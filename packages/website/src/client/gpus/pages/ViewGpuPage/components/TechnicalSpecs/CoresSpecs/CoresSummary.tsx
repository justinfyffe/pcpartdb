import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../../shared/content';
import { formatGpuField } from '../../../../..';
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

  const context = useMemo(() => {
    const params: ContentComponentParams = {
      cores: formatGpuField(gpu.shaderUnitsCudaCores),
      coreClockSpeedBase: formatGpuField(gpu.coreClockSpeedBase),
      fp32Performance: formatGpuField(gpu.fp32Performance),
      fp64Performance: formatGpuField(gpu.fp64Performance),
      rops: formatGpuField(gpu.renderOutputUnits),
      pixelFillRate: formatGpuField(gpu.pixelFillRate),
      tmus: formatGpuField(gpu.textureMappingUnits),
      textureFillRate: formatGpuField(gpu.textureFillRate),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <CoresSummarySentence1 />
      </p>
      <p>
        <CoresSummarySentence2 />
      </p>
    </ContentContext.Provider>
  );
};
