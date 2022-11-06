import { Product } from '@shared/product';

export function addPerformanceBenchmarks(product: Product) {
  const performance = calculatePerformanceScore(product);
  if (performance != null) {
    product.benchmarks.performanceScore = { value: performance };
  }

  const value = calculateValueScore(product, performance);
  if (value != null) {
    product.benchmarks.valueScore = { value };
  }
}

function calculatePerformanceScore(product: Product) {
  // Get inputs
  const g3dMark = product.benchmarks?.g3dMark?.value;

  // Validate inputs
  if (g3dMark == null || typeof g3dMark !== 'number') {
    return null;
  }

  // Compute score
  return g3dMark;
}

function calculateValueScore(product: Product, performance: number) {
  // Get inputs
  const performanceScore = performance;
  const launchPrice = product.specs?.launchPrice?.value;

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
