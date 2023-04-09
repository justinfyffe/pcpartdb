import { Gpu } from './gpu-types';

export function populatePerformanceScoreBenchmark(gpu: Gpu) {
  const performance = calculatePerformanceScore(gpu);
  if (performance != null) {
    gpu.benchmarks.performanceScore = {
      value: performance,
      meta: { fieldKey: 'performanceScore', autoUpdate: false },
    };
  }
}

export function populateValueScoreBenchmark(gpu: Gpu) {
  const value = calculateValueScore(gpu);
  if (value != null) {
    gpu.benchmarks.valueScore = {
      value,
      meta: { fieldKey: 'valueScore', autoUpdate: false },
    };
  }
}

function calculatePerformanceScore(gpu: Gpu) {
  // Get inputs
  const g3dMark = gpu.benchmarks?.g3dMark?.value;

  // Validate inputs
  if (g3dMark == null || typeof g3dMark !== 'number') {
    return null;
  }

  // Compute score
  return g3dMark;
}

function calculateValueScore(gpu: Gpu) {
  // Get inputs
  const performanceScore = gpu.benchmarks?.performanceScore?.value;
  const launchPrice = gpu?.launchPrice?.value;

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
