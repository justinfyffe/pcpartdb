import {
  getProductBenchmarkMap,
  getProductSpecMap,
  Product,
} from '@shared/product';
import {
  ProductBenchmark,
  ProductBenchmarkKey,
  productBenchmarkValue,
} from '@shared/product-benchmark';
import { ProductSpecKey, productSpecValue } from '@shared/product-spec';

export function calculatePerformanceBenchmarks(product: Product) {
  const benchmarks: ProductBenchmark[] = [];

  const performance = calculatePerformanceScore(product);
  if (performance != null) {
    benchmarks.push({
      key: ProductBenchmarkKey.PerformanceScore,
      floatValue: performance,
    });
  }

  const value = calculateValueScore(product, performance);
  if (value != null) {
    benchmarks.push({ key: ProductBenchmarkKey.ValueScore, floatValue: value });
  }

  return benchmarks;
}

function calculatePerformanceScore(product: Product) {
  const benchmarks = getProductBenchmarkMap(product);

  // Get inputs
  const g3dMark = productBenchmarkValue(
    benchmarks[ProductBenchmarkKey.G3dMark],
  ) as number;

  // Validate inputs
  if (g3dMark == null || typeof g3dMark !== 'number') {
    return null;
  }

  // Compute score
  return g3dMark;
}

function calculateValueScore(product: Product, performance: number) {
  const specs = getProductSpecMap(product);

  // Get inputs
  const performanceScore = performance;
  const launchPrice = productSpecValue(specs[ProductSpecKey.LaunchPriceMsrp]);

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
