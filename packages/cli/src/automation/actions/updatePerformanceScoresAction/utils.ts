import {
  BenchmarKey,
  hasProductBenchmark,
  hasProductFieldRawValue,
  Product,
  productBenchmarkValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import {
  BenchmarkEstimates,
  BenchmarkMaxes,
  BenchmarkWeights,
  PerformanceScores,
} from './types';

export function getBenchmarkMaxes(
  products: Product[],
  benchmarks: BenchmarKey[],
) {
  const benchmarkMaxes: BenchmarkMaxes = {};
  for (const product of products) {
    for (const benchmark of benchmarks) {
      benchmarkMaxes[benchmark] = Math.max(
        benchmarkMaxes[benchmark] || 0,
        productBenchmarkValue(product, benchmark) || 0,
      );
    }
  }
  return benchmarkMaxes;
}

export function filterProducts(
  products: Product[],
  requiredBenchmarks: BenchmarKey[],
) {
  return products.filter((product) =>
    requiredBenchmarks.every((rb) => hasProductBenchmark(product, rb)),
  );
}

export function predictMissingBenchmarks(
  products: Product[],
  benchmarks: BenchmarKey[],
  maxes: BenchmarkMaxes,
  weights: BenchmarkWeights,
) {
  const estimates: BenchmarkEstimates = {};

  for (const product of products) {
    const existingKeys = benchmarks.filter((key) =>
      hasProductBenchmark(product, key),
    );
    const missingKeys = benchmarks.filter(
      (key) => !hasProductBenchmark(product, key),
    );

    estimates[product.id] = {};
    for (const missingKey of missingKeys) {
      estimates[product.id][missingKey] = predictMissingBenchmark(
        product.id,
        products,
        missingKey,
        existingKeys,
        maxes,
        weights,
      );
    }
  }

  return estimates;
}

export function calculatePerformanceScores(
  products: Product[],
  scoreBenchmarks: BenchmarKey[],
  maxes: BenchmarkMaxes,
  weights: BenchmarkWeights,
  estimates: BenchmarkEstimates,
) {
  let maxPerformanceRating = 0;
  let maxPerformancePerMsrp = 0;
  const filteredProducts = filterProducts(products, scoreBenchmarks);
  const results: {
    product: Product;
    rawPerformanceRating: number;
    rawPerformancePerMsrp: number;
  }[] = [];
  for (const product of filteredProducts) {
    const rawPerformanceRating = getScore(
      product,
      scoreBenchmarks,
      maxes,
      weights,
      estimates,
    );
    maxPerformanceRating = Math.max(rawPerformanceRating, maxPerformanceRating);

    let rawPerformancePerMsrp;
    if (hasProductFieldRawValue(product.fields?.msrp)) {
      rawPerformancePerMsrp = hasProductFieldRawValue(product.fields?.msrp)
        ? rawPerformanceRating / productFieldRawValue(product.fields.msrp)
        : null;
      maxPerformancePerMsrp = Math.max(
        rawPerformancePerMsrp,
        maxPerformancePerMsrp,
      );
    }

    results.push({
      product,
      rawPerformanceRating,
      rawPerformancePerMsrp,
    });
  }

  const ret: Record<number, PerformanceScores> = {};
  for (const result of results) {
    ret[result.product.id] = {
      performanceRating:
        result.rawPerformanceRating != null
          ? (result.rawPerformanceRating / maxPerformanceRating) * 100
          : null,
      performancePerMsrp:
        result.rawPerformancePerMsrp != null
          ? (result.rawPerformancePerMsrp / maxPerformancePerMsrp) * 100
          : null,
    };
  }
  return ret;
}

function predictMissingBenchmark(
  productId: number,
  products: Product[],
  missingKey: BenchmarKey,
  existingKeys: BenchmarKey[],
  maxes: BenchmarkMaxes,
  weights: BenchmarkWeights,
) {
  let maxScore = 0;
  const filteredProducts = filterProducts(products, existingKeys);
  const scores: { product: Product; score: number }[] = [];
  for (const product of filteredProducts) {
    const score = getScore(product, existingKeys, maxes, weights);
    scores.push({ score, product });
    maxScore = Math.max(score, maxScore);
  }
  scores.forEach((value) => {
    value.score = value.score / maxScore;
  });
  scores.sort((s1, s2) => s1.score - s2.score);

  let idx = scores.findIndex((s) => s.product.id === productId);
  if (idx === -1) {
    throw new Error(
      `Cannot predict benchmark for productId=${productId}, missingKey=${missingKey}, existingKeys=${existingKeys}`,
    );
  }

  idx = idx + 1;
  for (let i = idx + 1; i < scores.length; ++i) {
    const { product } = scores[i];
    if (hasProductBenchmark(product, missingKey)) {
      return productBenchmarkValue(product, missingKey);
    }
  }

  return 0;
}

function getWeightedBenchmark(
  product: Product,
  key: BenchmarKey,
  maxes: BenchmarkMaxes,
  weights: BenchmarkWeights,
  estimates?: BenchmarkEstimates,
) {
  const estimate = estimates?.[product.id]?.[key];

  const value = estimate || productBenchmarkValue(product, key) || 0;
  const max = maxes[key];
  const weight = weights[key];

  return (value / max) * weight * 100;
}

function getScore(
  product: Product,
  keys: BenchmarKey[],
  maxes: BenchmarkMaxes,
  weights: BenchmarkWeights,
  estimates?: BenchmarkEstimates,
) {
  let score = 0;
  for (const key of keys) {
    score += getWeightedBenchmark(product, key, maxes, weights, estimates);
  }
  return score;
}
