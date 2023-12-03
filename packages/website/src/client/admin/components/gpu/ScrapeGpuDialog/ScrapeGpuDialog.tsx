import {
  BenchmarkKey,
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
  'memoryClockEffective',
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

const BENCHMARKS_TO_SCRAPE: BenchmarkKey[] = [
  // 3DMark
  BenchmarkKey._3dMark_Cloud_Gate_Graphics,
  BenchmarkKey._3dMark_Cloud_Gate_Score,
  BenchmarkKey._3dMark_Fire_Strike_Standard_Graphics,
  BenchmarkKey._3dMark_Fire_Strike_Standard_Score,
  BenchmarkKey._3dMark_Night_Raid_Graphics,
  BenchmarkKey._3dMark_Night_Raid_Score,
  BenchmarkKey._3dMark_Timespy_Graphics,
  BenchmarkKey._3dMark_Timespy_Score,
  BenchmarkKey._3dMark_Ice_Storm_Graphics,
  BenchmarkKey._3dMark_Ice_Storm_Unlimited_Graphics,
  BenchmarkKey._3dMark_Ice_Storm_Extreme_Graphics,
  BenchmarkKey._3dMark_Wild_Life_Unlimited,
  BenchmarkKey._3dMark_Wild_Life_Extreme_Unlimited,
  BenchmarkKey._3dMark_11_Performance_Gpu,
  BenchmarkKey._3dMark_11_Performance_Score,
  BenchmarkKey._3dMark_Vantage_Perf,
  BenchmarkKey._3dMark_06_Standard,
  BenchmarkKey._3dMark_05_Standard,
  BenchmarkKey._3dMark_03_Standard,
  BenchmarkKey._3dMark_2001SE_Standard,

  // Cinebench
  BenchmarkKey.Cinebench_R15_OpenGl_64_Bit,
  BenchmarkKey.Cinebench_R11_5_OpenGl_64_Bit,
  BenchmarkKey.Cinebench_R10_Shading_32_Bit,

  // ComputeMark
  BenchmarkKey.ComputeMark_2_1_Result,

  // Geekbench
  BenchmarkKey.Geekbench_6_2_Gpu_OpenCl,
  BenchmarkKey.Geekbench_6_2_Gpu_Vulkan,

  // LuxMark
  BenchmarkKey.LuxMark_2_0_Room_Gpu,
  BenchmarkKey.LuxMark_2_0_Sala_Gpu,

  // PassMark
  BenchmarkKey.PassMark_G3dMark,
  BenchmarkKey.PassMark_G2dMark,

  // SPECviewperf 2020
  BenchmarkKey.Specvp2020_3dsMax_07_4k,
  BenchmarkKey.Specvp2020_Catia_06_4k,
  BenchmarkKey.Specvp2020_Creo_03_4k,
  BenchmarkKey.Specvp2020_Energy_03_4k,
  BenchmarkKey.Specvp2020_Maya_06_4k,
  BenchmarkKey.Specvp2020_Medical_03_4k,
  BenchmarkKey.Specvp2020_Snx_03_4k,
  BenchmarkKey.Specvp2020_Sw_05_4k,

  // SPECviewperf 13
  BenchmarkKey.Specvp13_3dsMax_06,
  BenchmarkKey.Specvp13_Catia_05,
  BenchmarkKey.Specvp13_Creo_02,
  BenchmarkKey.Specvp13_Energy_02,
  BenchmarkKey.Specvp13_Maya_05,
  BenchmarkKey.Specvp13_Medical_02,
  BenchmarkKey.Specvp13_Showcase_02,
  BenchmarkKey.Specvp13_Snx_03,
  BenchmarkKey.Specvp13_Sw_04,

  // SPECviewperf 12
  BenchmarkKey.Specvp12_3dsMax_05,
  BenchmarkKey.Specvp12_Catia_04,
  BenchmarkKey.Specvp12_Creo_01,
  BenchmarkKey.Specvp12_Energy_01,
  BenchmarkKey.Specvp12_Maya_04,
  BenchmarkKey.Specvp12_Medical_01,
  BenchmarkKey.Specvp12_Showcase_01,
  BenchmarkKey.Specvp12_Snx_02,
  BenchmarkKey.Specvp12_Sw_03,

  // SPECviewperf 11
  BenchmarkKey.Specvp11_Catia_03,
  BenchmarkKey.Specvp11_Ensight_04,
  BenchmarkKey.Specvp11_Lightwave_01,
  BenchmarkKey.Specvp11_Maya_03,
  BenchmarkKey.Specvp11_Proe_05,
  BenchmarkKey.Specvp11_Snx_01,
  BenchmarkKey.Specvp11_Sw_02,
  BenchmarkKey.Specvp11_Tcvis_02,

  // Unigine
  BenchmarkKey.UnigineHeaven_3_0_Dx_11,
  BenchmarkKey.UnigineHeaven_3_0_OpenGl,
  BenchmarkKey.UnigineHeaven_2_1_High,
  BenchmarkKey.UnigineValley_1_0_Dx,
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
