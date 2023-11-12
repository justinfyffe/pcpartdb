export interface GeekBenchCpuSource {
  groupKey: string;
  externalKey: string;
  name: string;
  company: string;
  url: string;
  GeekBench_Single_Core?: number;
  GeekBench_Multi_Core?: number;
}

export interface NotebookCheckCpuSource {
  groupKey: string;
  externalKey: string;
  name: string;
  company: string;
  url: string;
}

export interface PassMarkCpuSource {
  groupKey: string;
  externalKey: string;
  name: string;
  company: string;
  url: string;
  PassMark_CpuMark_Multi_Thread?: number;
}

export interface TechPowerUpCpuSource {
  groupKey: string;
  externalKey: string;
  name: string;
  company: string;
  url: string;
}
