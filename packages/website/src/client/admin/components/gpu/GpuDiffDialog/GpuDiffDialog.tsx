import {
  BenchmarKey,
  GpuFieldKey,
  ProductDiff,
  ProductType,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ProductDiffDialog } from '../../product/ProductDiffDialog/ProductDiffDialog';

const FIELDS_TO_PREVIEW: GpuFieldKey[] = [
  'partNumber',
  'marketSegment',
  'msrp',
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
  'tdp',
  'suggestedPsu',
  'busInterface',
  'powerConnectors',
  'outputs',

  'gpuCores',
  'computeUnits',
  'tmus',
  'rops',
  'rtCores',
  'gpuCoreBaseClock',
  'gpuCoreBoostClock',
  'l1Cache',
  'l2Cache',

  'pixelRate',
  'textureRate',
  'fp32',
  'fp64',

  'directxVersion',
  'openClVersion',
  'openGlVersion',
  'shaderModelVersion',
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
      benchmarksToPreview={[
        BenchmarKey.G3dMark,
        BenchmarKey.G2dMark,
        BenchmarKey.TimespyGraphics,
      ]}
    />
  );
};
