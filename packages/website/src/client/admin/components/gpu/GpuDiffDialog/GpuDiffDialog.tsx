import { GpuFieldKey, ProductDiff, ProductType } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ProductDiffDialog } from '../../product';

const FIELDS_TO_PREVIEW: (GpuFieldKey | 'name' | 'slug')[] = [
  'name',
  'slug',

  'partNumber',
  'company',
  'marketSegment',
  'launchPrice',
  'releaseDate',
  'productionStatus',

  'codename',
  'architecture',
  'processSize',
  'transistors',

  'memorySize',
  'memoryType',
  'memoryClock',
  'memoryInterface',
  'memoryBandwidth',

  'slotWidth',
  'length',
  'width',
  'height',
  'weight',
  'thermalDesignPower',
  'suggestedPsu',
  'busInterface',
  'powerConnectors',
  'outputs',

  'shaderUnitsCudaCores',
  'computeUnitsSmCount',
  'textureMappingUnits',
  'renderOutputUnits',
  'rayTracingCores',
  'coreClockSpeedBase',
  'coreClockSpeedBoost',
  'l1Cache',
  'l2Cache',

  'pixelFillRate',
  'textureFillRate',
  'fp32Performance',
  'fp64Performance',

  'directxVersion',
  'openClVersion',
  'openGlVersion',
  'shaderModelVersion',

  'g3dMark',
  'g2dMark',
  'timespyGraphics',
];

interface GpuDiffDialogProps {
  diff: ProductDiff;
}

export const GpuDiffDialog: FunctionComponent<GpuDiffDialogProps> = (props) => {
  const { diff } = props;

  return (
    <ProductDiffDialog
      productType={ProductType.Gpu}
      diff={diff}
      dataToPreview={FIELDS_TO_PREVIEW}
    />
  );
};
