export enum BenchmarKey {
  // CPU Benchmarks
  CpuMarkMultiThread = 'CPU_MARK_MULTI_THREAD',
  CpuMarkSingleThread = 'CPU_MARK_SINGLE_THREAD',
  GeekBenchMultiCore = 'GEEKBENCH_MULTI_CORE',
  GeekBenchSingleCore = 'GEEKBENCH_SINGLE_CORE',

  // GPU Benchmarks
  G3dMark = 'G3D_MARK',
  G2dMark = 'G2D_MARK',
  TimespyGraphics = 'TIMESPY_GRAPHICS',
}

export interface ProductBenchmarkMeta {}

export interface ProductBenchmark {
  id?: number;
  productId?: number;

  benchmarkKey: BenchmarKey;
  value?: number;

  metadata?: ProductBenchmarkMeta;
}
