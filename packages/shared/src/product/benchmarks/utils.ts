import { Product, ProductType } from '../common';
import { BENCHMARK_LABELS, BenchmarkKey, ProductBenchmark } from './common';

export function getDefaultBenchmark(productType: ProductType) {
  if (productType === ProductType.Cpu) {
    return BenchmarkKey.PassMark_CpuMark_Multi_Thread;
  } else if (productType === ProductType.Gpu) {
    return BenchmarkKey.PassMark_G3dMark;
  } else {
    throw new Error(
      `Invalid product type for getDefaultBenchmark: ${productType}`,
    );
  }
}

const CPU_PREFERENCE_BENCHMARKS: BenchmarkKey[] = [
  BenchmarkKey._3dMark_11_Performance_Physics,
  BenchmarkKey._3dMark_Fire_Strike_Standard_Physics,
  BenchmarkKey._3dMark_Time_Spy_Cpu,
  BenchmarkKey.Geekbench_6_2_Multi_Core,
  BenchmarkKey.Geekbench_6_2_Single_Core,
  BenchmarkKey.PassMark_CpuMark_Multi_Thread,
  BenchmarkKey.PassMark_CpuMark_Single_Thread,
];
const GPU_PREFERENCE_BENCHMARKS: BenchmarkKey[] = [
  BenchmarkKey._3dMark_11_Performance_Gpu,
  BenchmarkKey._3dMark_Fire_Strike_Standard_Graphics,
  BenchmarkKey._3dMark_Timespy_Graphics,
  BenchmarkKey.PassMark_G3dMark,
  BenchmarkKey.PassMark_G2dMark,
];
export function getPreferenceBenchmarks(productType: ProductType) {
  if (productType === ProductType.Cpu) {
    return CPU_PREFERENCE_BENCHMARKS;
  } else if (productType === ProductType.Gpu) {
    return GPU_PREFERENCE_BENCHMARKS;
  } else {
    throw new Error(
      `Invalid product type for getDefaultBenchmark: ${productType}`,
    );
  }
}

export function isPreferredBenchmark(
  productType: ProductType,
  benchmarkKey: BenchmarkKey,
) {
  return getPreferenceBenchmarks(productType).includes(benchmarkKey);
}

export function preferredBenchmarkOrDefault(
  productType: ProductType,
  benchmarkKey: BenchmarkKey,
) {
  if (isPreferredBenchmark(productType, benchmarkKey)) {
    return benchmarkKey;
  } else {
    return getDefaultBenchmark(productType);
  }
}

export function getProductBenchmarkName(benchmark: BenchmarkKey) {
  if (benchmark == null) {
    return null;
  }

  return BENCHMARK_LABELS[benchmark]?.full ?? null;
}

export function getProductBenchmarkShortName(benchmark: BenchmarkKey) {
  if (benchmark == null) {
    return null;
  }

  return (
    BENCHMARK_LABELS[benchmark]?.short ?? getProductBenchmarkName(benchmark)
  );
}

export function getProductBenchmarkAbbrev(benchmark: BenchmarkKey) {
  if (benchmark == null) {
    return null;
  }

  return (
    BENCHMARK_LABELS[benchmark]?.abbrev ??
    getProductBenchmarkShortName(benchmark)
  );
}

export function hasProductBenchmark(
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return productBenchmarkValue(product, benchmarkKey) != null;
}

export function getProductBenchmark(
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return (
    product?.benchmarks?.filter(
      (benchmark) => benchmark.benchmarkKey === benchmarkKey,
    )?.[0] || null
  );
}

export function productBenchmarkValue(
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return getProductBenchmark(product, benchmarkKey)?.value;
}

export function productBenchmarkValuePerMsrp(
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return getProductBenchmark(product, benchmarkKey)?.valuePerMsrp;
}

export function setProductBenchmark(
  product: Product,
  benchmarkKey: BenchmarkKey,
  value: number,
) {
  const hasBenchmark = hasProductBenchmark(product, benchmarkKey);
  if (!hasBenchmark && value != null) {
    // Add benchmark
    product.benchmarks.push({ benchmarkKey, value });
  }

  if (hasBenchmark) {
    const idx = product.benchmarks.findIndex(
      (benchmark) => benchmark.benchmarkKey === benchmarkKey,
    );

    if (value == null) {
      // Delete benchmark
      product.benchmarks.splice(idx, 1);
    } else {
      // Overwrite benchmark
      product.benchmarks[idx].value = value;
    }
  }
}
