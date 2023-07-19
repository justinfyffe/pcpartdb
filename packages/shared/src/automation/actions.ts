export interface FetchCpuSourcesAction {}

export interface FetchCpuDataAction {
  // For fetching data based on a new CPU.
  techPowerUpUrl?: string;
  passMarkUrl?: string;
  geekBenchUrl?: string;

  // For fetching data based on an existing CPU.
  cpuId?: number;
}
