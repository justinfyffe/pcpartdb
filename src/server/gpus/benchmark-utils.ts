import { GpuBenchmarks, GpuSpecs } from '@shared/gpus';

export function addPerformanceBenchmarks(
  specs: GpuSpecs,
  benchmarks: GpuBenchmarks,
) {
  const performance = calculatePerformanceScore(benchmarks);
  if (performance != null) {
    benchmarks.performanceScore = { value: performance };
  }

  const value = calculateValueScore(specs, performance);
  if (value != null) {
    benchmarks.valueScore = { value };
  }
}

function calculatePerformanceScore(benchmarks: GpuBenchmarks) {
  // Get inputs
  const g3dMark = benchmarks?.g3dMark?.value;

  // Validate inputs
  if (g3dMark == null || typeof g3dMark !== 'number') {
    return null;
  }

  // Compute score
  return g3dMark;
}

function calculateValueScore(specs: GpuSpecs, performance: number) {
  // Get inputs
  const performanceScore = performance;
  const launchPrice = specs?.launchPrice?.value;

  // Validate inputs
  if (performanceScore == null) {
    return null;
  }
  if (launchPrice == null || typeof launchPrice !== 'number') {
    return null;
  }

  // Compute score
  return performanceScore / launchPrice;
}
