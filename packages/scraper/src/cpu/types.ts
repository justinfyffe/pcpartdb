export interface GeekBenchCpuSource {
  groupKey: string;
  externalKey: string;
  name: string;
  company: string;
  url: string;
  geekBenchSingleCore?: number;
  geekBenchMultiCore?: number;
}

export interface PassMarkCpuSource {
  groupKey: string;
  externalKey: string;
  name: string;
  company: string;
  url: string;
  cpuMarkMultiThread?: number;
}

export interface TechPowerUpCpuSource {
  groupKey: string;
  externalKey: string;
  name: string;
  company: string;
  url: string;
}
