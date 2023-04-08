import { Gpu, GpuComparison } from '../gpu';

export interface HomeViewModel {
  nvidiaVsAmdGpus: GpuComparison[];
  nvidiaGpus: Gpu[];
  amdGpus: Gpu[];
}
