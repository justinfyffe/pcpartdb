import {
  BenchmarkKey,
  hasProductBenchmark,
  hasProductFieldRawValue,
  Product,
  productBenchmarkValue,
  productFieldRawValue,
  ProductScoreCalculations,
  ProductType,
} from '@pcpartdb/shared';
import { ProductCalculations } from './types';

type BenchmarkEstimates = Record<number, Partial<Record<BenchmarkKey, number>>>;
type BenchmarkMaxes = Partial<Record<BenchmarkKey, number>>;
type BenchmarkWeights = Partial<Record<BenchmarkKey, number>>;

/**
 * List of benchmarks used to calculate the product's score.
 * Missing benchmarks will be predicted.
 */
const SCORE_BENCHMARKS: Partial<Record<ProductType, BenchmarkKey[]>> = {
  [ProductType.Cpu]: [
    BenchmarkKey.PassMark_CpuMark_Multi_Thread,
    BenchmarkKey.PassMark_CpuMark_Single_Thread,
  ],
  [ProductType.Gpu]: [
    BenchmarkKey.PassMark_G3dMark,
    BenchmarkKey.PassMark_G2dMark,
  ],
};

/**
 * Minimum number of benchmarks required to calculate the score.
 */
const MIN_NUM_BENCHMARKS: Partial<Record<ProductType, number>> = {
  [ProductType.Cpu]: 2,
  [ProductType.Gpu]: 2,
};

/**
 * Weights for each benchmark when calculating the score. The sum of
 * weights must add to 1 for each product type.
 */
const WEIGHTS: Partial<
  Record<ProductType, Partial<Record<BenchmarkKey, number>>>
> = {
  [ProductType.Cpu]: {
    [BenchmarkKey.PassMark_CpuMark_Multi_Thread]: 0.95,
    [BenchmarkKey.PassMark_CpuMark_Single_Thread]: 0.05,
  },
  [ProductType.Gpu]: {
    [BenchmarkKey.PassMark_G3dMark]: 0.95,
    [BenchmarkKey.PassMark_G2dMark]: 0.05,
  },
};

interface PopulateScoresOptions {
  productType: ProductType;

  calculations: Record<number, ProductCalculations>;
}

export function populateScores(options: PopulateScoresOptions) {
  const { calculations, productType } = options;

  const scoreBenchmarks = SCORE_BENCHMARKS[productType];
  const minNumBenchmarks = MIN_NUM_BENCHMARKS[productType];
  const weights = WEIGHTS[productType];

  // Determine products that can have scores.
  const allProducts = Object.values(options.calculations).map((v) => v.product);
  const products = filterScorableProducts({
    products: allProducts,
    benchmarks: scoreBenchmarks,
    minRequired: minNumBenchmarks,
  });

  // Prepare data needed to calculate scores
  const maxes = getBenchmarkMaxes(products, scoreBenchmarks);
  const estimates = predictMissingBenchmarks(
    products,
    scoreBenchmarks,
    maxes,
    weights,
  );

  // Calculate Scores
  const results = calculateScores(
    products,
    scoreBenchmarks,
    maxes,
    weights,
    estimates,
  );

  // Populate calculations
  for (const result of results) {
    const { productId, ...scores } = result;
    if (calculations[productId] == null) {
      throw new Error(`Cannot find calculations for productId=${productId}`);
    }
    calculations[productId].scores = scores;
  }
}

interface FilterScorableProductsOptions {
  products: Product[];
  estimates?: BenchmarkEstimates;

  benchmarks: BenchmarkKey[];
  minRequired?: number;
}

function filterScorableProducts(options: FilterScorableProductsOptions) {
  const { products, estimates, minRequired, benchmarks } = options;
  const requiredCount = minRequired ?? benchmarks.length;
  return products.filter((product) => {
    const filteredBenchmarks = benchmarks.filter(
      (benchmark) =>
        hasProductBenchmark(product, benchmark) ||
        estimates?.[product.id][benchmark] != null,
    );
    const totalBenchmarks = filteredBenchmarks.length;
    return totalBenchmarks >= requiredCount;
  });
}

function getBenchmarkMaxes(products: Product[], benchmarks: BenchmarkKey[]) {
  const benchmarkMaxes: BenchmarkMaxes = {};
  for (const product of products) {
    for (const benchmark of benchmarks) {
      benchmarkMaxes[benchmark] = Math.max(
        benchmarkMaxes[benchmark] ?? 0,
        productBenchmarkValue(product, benchmark) ?? 0,
      );
    }
  }
  return benchmarkMaxes;
}

function predictMissingBenchmarks(
  products: Product[],
  benchmarks: BenchmarkKey[],
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

function calculateScores(
  products: Product[],
  scoreBenchmarks: BenchmarkKey[],
  maxes: BenchmarkMaxes,
  weights: BenchmarkWeights,
  estimates: BenchmarkEstimates,
) {
  let maxPerformanceRating = 0;
  let maxPerformancePerMsrp = 0;
  const filteredProducts = filterScorableProducts({
    products,
    estimates,
    benchmarks: scoreBenchmarks,
  });
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

  const ret: (ProductScoreCalculations & { productId: number })[] = [];
  for (const result of results) {
    ret.push({
      productId: result.product.id,
      performanceRating:
        result.rawPerformanceRating != null
          ? (result.rawPerformanceRating / maxPerformanceRating) * 100
          : null,
      performancePerMsrp:
        result.rawPerformancePerMsrp != null
          ? (result.rawPerformancePerMsrp / maxPerformancePerMsrp) * 100
          : null,
    });
  }
  return ret;
}

function predictMissingBenchmark(
  productId: number,
  products: Product[],
  missingKey: BenchmarkKey,
  existingKeys: BenchmarkKey[],
  maxes: BenchmarkMaxes,
  weights: BenchmarkWeights,
) {
  let maxScore = 0;
  const filteredProducts = filterScorableProducts({
    products,
    benchmarks: existingKeys,
  });
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
  key: BenchmarkKey,
  maxes: BenchmarkMaxes,
  weights: BenchmarkWeights,
  estimates?: BenchmarkEstimates,
) {
  const estimate = estimates?.[product.id]?.[key];

  const value = estimate ?? productBenchmarkValue(product, key) ?? 0;
  const max = maxes[key];
  const weight = weights[key];

  return (value / max) * weight * 100;
}

function getScore(
  product: Product,
  keys: BenchmarkKey[],
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
