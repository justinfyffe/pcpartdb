import { BenchmarkKey, ProductDiff, ProductType } from '@pcpartdb/shared';
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
        'dieSize',
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

        'smp',
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
        BenchmarkKey._7Zip_18_03_Multi_Thread,
        BenchmarkKey._7Zip_18_03_Single_Thread,

        BenchmarkKey._3dMark_06_Cpu,
        BenchmarkKey._3dMark_11_Performance_Physics,
        BenchmarkKey._3dMark_Fire_Strike_Standard_Physics,
        BenchmarkKey._3dMark_Cloud_Gate_Physics,
        BenchmarkKey._3dMark_Ice_Storm_Extreme_Physics,
        BenchmarkKey._3dMark_Ice_Storm_Physics,
        BenchmarkKey._3dMark_Ice_Storm_Unlimited_Physics,
        BenchmarkKey._3dMark_Time_Spy_Cpu,

        BenchmarkKey.Cinebench_R11_5_Multi_Core,
        BenchmarkKey.Cinebench_R11_5_Single_Core,
        BenchmarkKey.Cinebench_R15_Multi_Core,
        BenchmarkKey.Cinebench_R15_Single_Core,
        BenchmarkKey.Cinebench_R20_Multi_Core,
        BenchmarkKey.Cinebench_R20_Single_Core,
        BenchmarkKey.Cinebench_R23_Multi_Core,
        BenchmarkKey.Cinebench_R23_Single_Core,

        BenchmarkKey.Geekbench_6_2_Multi_Core,
        BenchmarkKey.Geekbench_6_2_Single_Core,
        BenchmarkKey.Geekbench_5_4_Multi_Core,
        BenchmarkKey.Geekbench_5_4_Single_Core,
        BenchmarkKey.Geekbench_5_0_Multi_Core,
        BenchmarkKey.Geekbench_5_0_Single_Core,
        BenchmarkKey.Geekbench_4_4_Multi_Core,
        BenchmarkKey.Geekbench_4_4_Single_Core,

        BenchmarkKey.PassMark_CpuMark_Multi_Thread,
        BenchmarkKey.PassMark_CpuMark_Single_Thread,
      ]}
    />
  );
};
