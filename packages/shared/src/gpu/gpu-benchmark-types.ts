import { GpuField } from './gpu-field-types';

export interface GpuBenchmarks {
  gpuId?: number;

  performanceScore?: GpuField<number>;
  valueScore?: GpuField<number>;

  g3dMark?: GpuField<number>;
  g2dMark?: GpuField<number>;
  timespyGraphics?: GpuField<number>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [key: string]: number | GpuField<any>;
}
