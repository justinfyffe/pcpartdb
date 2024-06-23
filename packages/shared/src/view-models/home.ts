import {
  CpuProduct,
  CpuProductComparison,
  GpuProduct,
  GpuProductComparison,
} from '../product';

export interface HomeViewModel {
  gpuData: HomeGpuData;
  cpuData: HomeCpuData;
}

export interface HomeGpuData {
  performanceList: GpuProduct[];
  valueList: GpuProduct[];

  performanceComparison: GpuProductComparison;
  valueComparison: GpuProductComparison;
}

export interface HomeCpuData {
  performanceList: CpuProduct[];
  valueList: CpuProduct[];

  performanceComparison: CpuProductComparison;
  valueComparison: CpuProductComparison;
}
