import { BenchmarKey, ProductDiff, ProductType } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ProductDiffDialog } from '../../product/ProductDiffDialog/ProductDiffDialog';

interface CpuDiffDialogProps {
  diff: ProductDiff;
}

export const CpuDiffDialog: FunctionComponent<CpuDiffDialogProps> = (props) => {
  const { diff } = props;

  return (
    <ProductDiffDialog
      productType={ProductType.Cpu}
      diff={diff}
      dataToPreview={[
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
      benchmarksToPreview={[
        BenchmarKey.CpuMarkMultiThread,
        BenchmarKey.CpuMarkSingleThread,
        BenchmarKey.GeekBenchMultiCore,
        BenchmarKey.GeekBenchSingleCore,
      ]}
    />
  );
};
