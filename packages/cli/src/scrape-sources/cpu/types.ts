import { CpuMarketSegmentValue } from '@pcpartdb/shared';

export enum ScrapeCpuSourceOption {
  TechPowerUp = 'techpowerup',
  PassMark = 'passmark',
  GeekBench = 'geekbench',
}

// https://www.techpowerup.com/cpu-specs/?ajaxsrch=b&_=1687488352240
// https://browser.geekbench.com/processor-benchmarks
// https://www.cpubenchmark.net/CPU_mega_page.html
export interface CpuSource {
  name?: string; // all
  company?: string; // all
  marketSegments?: CpuMarketSegmentValue[]; // PassMark
  cpuMarkMultiThread?: number; // PassMark
  geekBenchSingleCore?: number; // GeekBench
  geekBenchMultiCore?: number; // GeekBench
  techPowerUpUrl?: string;
  passMarkUrl?: string;
  geekBenchUrl?: string;
}

export type CpuSourceModel = {
  date: number;
  name: string;
  sources: CpuSource[];
};
