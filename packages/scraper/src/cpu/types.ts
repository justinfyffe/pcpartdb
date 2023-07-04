export interface GeekBenchCpuSource {
  name: string;
  company?: string;
  url: string;
  geekBenchSingleCore?: number;
  geekBenchMultiCore?: number;
}

export interface PassMarkCpuSource {
  name: string;
  company?: string;
  url: string;
  cpuMarkMultiThread?: number;
}

export interface TechPowerUpCpuSource {
  name: string;
  company?: string;
  url: string;
}
