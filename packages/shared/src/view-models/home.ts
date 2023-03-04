import { Gpu, GpuComparison } from '../gpus';

export interface HomeViewModel {
  nvidiaVsAmdGpus: GpuComparison[];
  nvidiaGpus: Gpu[];
  amdGpus: Gpu[];
}
