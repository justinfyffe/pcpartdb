import {
  BenchmarKey,
  GpuFieldKey,
  ProductSource,
  ProductType,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ScrapeProductDialog } from '../../product/ScrapeProductDialog/ScrapeProductDialog';
import { ScrapedProduct } from '../../product/ScrapeProductDialog/types';

const FIELDS_TO_SCRAPE: GpuFieldKey[] = [
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

const BENCHMARKS_TO_SCRAPE: BenchmarKey[] = [
  BenchmarKey.G3dMark,
  BenchmarKey.G2dMark,
  BenchmarKey.TimespyGraphics,
];

interface ScrapeGpuDialogProps {
  sources: Partial<ProductSource>[];
  onImport: (data: ScrapedProduct) => void;
}

export const ScrapeGpuDialog: FunctionComponent<ScrapeGpuDialogProps> = (
  props,
) => {
  const { sources, onImport } = props;

  return (
    <ScrapeProductDialog
      productType={ProductType.Gpu}
      fieldsToScrape={FIELDS_TO_SCRAPE}
      benchmarksToScrape={BENCHMARKS_TO_SCRAPE}
      sources={sources}
      onImport={onImport}
    />
  );
};
