import { Part } from '@shared/part';

export function addPerformanceBenchmarks(part: Part) {
  const performance = calculatePerformanceScore(part);
  if (performance != null) {
    part.benchmarks.performanceScore = { value: performance };
  }

  const value = calculateValueScore(part, performance);
  if (value != null) {
    part.benchmarks.valueScore = { value };
  }
}

function calculatePerformanceScore(part: Part) {
  // Get inputs
  const g3dMark = part.benchmarks?.g3dMark?.value;

  // Validate inputs
  if (g3dMark == null || typeof g3dMark !== 'number') {
    return null;
  }

  // Compute score
  return g3dMark;
}

function calculateValueScore(part: Part, performance: number) {
  // Get inputs
  const performanceScore = performance;
  const launchPrice = part.specs?.launchPrice?.value;

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
