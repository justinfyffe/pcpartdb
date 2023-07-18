import { Cpu } from '../product';

export interface FetchCpuSourcesAction {}

export interface CpuSourceApproval {
  cpuName?: string;
  techPowerUpName?: string;
  techPowerUpUrl?: string;
  passMarkName?: string;
  passMarkUrl?: string;
  geekBenchName?: string;
  geekBenchUrl?: string;
}

export interface FetchCpuDataAction {
  // For fetching data based on a new CPU.
  techPowerUpUrl?: string;
  passMarkUrl?: string;
  geekBenchUrl?: string;

  // For fetching data based on an existing CPU.
  cpuId?: number;
}

export interface CpuDataApproval {
  type: 'new' | 'update';
  cpu: Cpu;
}

export interface CheckCpuSourcesRequest {
  sources: string[];
}

export interface CheckCpuSourcesResponse {
  newSources: string[];
  existingSources: string[];
}
