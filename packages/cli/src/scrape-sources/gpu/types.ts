export enum ScrapeGpuSourceOption {
  TechPowerUp = 'techpowerup',
  UlBenchmarks = 'ul-benchmarks',
  PassMark = 'passmark',
}

export interface GpuSource {
  name?: string;
  company?: string;
  g3dMark?: number;
  timespyScore?: number;
  techPowerUpUrl?: string;
  ulBenchmarksUrl?: string;
  passMarkUrl?: string;
}

export type GpuSourceModel = {
  date: number;
  name: string;
  sources: GpuSource[];
};
