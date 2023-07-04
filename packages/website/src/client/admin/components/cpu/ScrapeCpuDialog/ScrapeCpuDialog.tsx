import { CpuDataSource, ProductType } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ScrapedProduct, ScrapeProductDialog } from '../../product';

interface ScrapeCpuDialogProps {
  sources: Record<string, CpuDataSource>;
  onImport: (data: ScrapedProduct) => void;
}

export const ScrapeCpuDialog: FunctionComponent<ScrapeCpuDialogProps> = (
  props,
) => {
  const { sources, onImport } = props;

  return (
    <ScrapeProductDialog
      productType={ProductType.Cpu}
      dataToScrape={[
        'name',
        'partNumber',
        'company',
        'marketSegments',
        'launchPrice',
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
        'hasEccMemory',

        'coresCount',
        'threadsCount',
        'performanceCoresCount',
        'efficientCoresCount',
        'clock',
        'turboClock',
        'performanceCoreClock',
        'performanceCoreTurboClock',
        'efficientCoreClock',
        'efficientCoreTurboClock',
        'baseClock',
        'multiplier',
        'isMultiplierUnlocked',

        'tdp',
        'pl1',
        'pl2',
        'ppt',

        'l1Cache',
        'l2Cache',
        'l3Cache',
        'efficientCoreL1Cache',
        'efficientCoreL2Cache',

        'integratedGraphics',
        'extensionsTechnologies',

        'cpuMarkMultiThread',
        'cpuMarkSingleThread',
        'geekbenchMultiCore',
        'geekbenchSingleCore',
      ]}
      sources={sources}
      onImport={onImport}
    />
  );
};
