import { GpuDataSource, GpuFieldKey, ProductType } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ScrapedProduct, ScrapeProductDialog } from '../../product';

const FIELDS_TO_SCRAPE: (GpuFieldKey | 'name')[] = [
  'name',

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

interface ScrapeGpuDialogProps {
  sources: Record<string, GpuDataSource>;
  onImport: (data: ScrapedProduct) => void;
}

export const ScrapeGpuDialog: FunctionComponent<ScrapeGpuDialogProps> = (
  props,
) => {
  const { sources, onImport } = props;

  return (
    <ScrapeProductDialog
      productType={ProductType.Gpu}
      dataToScrape={FIELDS_TO_SCRAPE}
      sources={sources}
      onImport={onImport}
    />
  );
};
