import { Cpu, CpuComparison, Gpu, GpuComparison } from '../product';

export interface HomeViewModel {
  nvidiaVsAmdGpus: GpuComparison[];
  popularGpus: Gpu[];

  intelVsAmdCpus: CpuComparison[];
  popularCpus: Cpu[];
}
