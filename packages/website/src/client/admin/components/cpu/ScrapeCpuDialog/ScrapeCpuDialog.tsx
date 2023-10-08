import { BenchmarKey, ProductSource, ProductType } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ScrapeProductDialog } from '../../product/ScrapeProductDialog/ScrapeProductDialog';
import { ScrapedProduct } from '../../product/ScrapeProductDialog/types';

interface ScrapeCpuDialogProps {
  sources: Partial<ProductSource>[];
  onImport: (data: ScrapedProduct) => void;
}

export const ScrapeCpuDialog: FunctionComponent<ScrapeCpuDialogProps> = (
  props,
) => {
  const { sources, onImport } = props;

  return (
    <ScrapeProductDialog
      productType={ProductType.Cpu}
      fieldsToScrape={[
        'partNumber',
        'marketSegment',
        'msrp',
        'releaseDate',
        'productionStatus',
        'bundledCooler',

        'socket',
        'foundry',
        'processSize',
        'transistors',
        'tCaseMax',
        'tjMax',

        'architecture',
        'codename',
        'generation',
        'pciExpress',
        'chipsets',

        'memorySupport',
        'memoryChannels',
        'eccMemory',

        'cores',
        'threads',
        'pCores',
        'eCores',
        'clock',
        'turboClock',
        'pCoreClock',
        'pCoreTurboClock',
        'eCoreClock',
        'eCoreTurboClock',
        'baseClock',
        'multiplier',
        'multiplierUnlocked',

        'tdp',
        'pl1',
        'pl2',
        'ppt',

        'l1Cache',
        'l2Cache',
        'l3Cache',
        'eCoreL1Cache',
        'eCoreL2Cache',

        'integratedGraphics',
        'extensionsTechnologies',
      ]}
      benchmarksToScrape={[
        BenchmarKey.CpuMarkMultiThread,
        BenchmarKey.CpuMarkSingleThread,
        BenchmarKey.GeekBenchMultiCore,
        BenchmarKey.GeekBenchSingleCore,
      ]}
      sources={sources}
      onImport={onImport}
    />
  );
};
