import { CpuDiff, ProductType } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ProductDiffDialog } from '../../product/ProductDiffDialog/ProductDiffDialog';

interface CpuDiffDialogProps {
  diff: CpuDiff;
}

export const CpuDiffDialog: FunctionComponent<CpuDiffDialogProps> = (props) => {
  const { diff } = props;

  return (
    <ProductDiffDialog
      productType={ProductType.Cpu}
      diff={diff}
      dataToPreview={[
        'name',
        'slug',

        'partNumber',
        'company',
        'marketSegment',
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
    />
  );
};
