import {
  AutomationAction,
  BenchmarKey,
  ListProductsFilter,
  ListProductsRequest,
  ListProductsResponse,
  ProductPerformanceScores,
  ProductType,
} from '@pcpartdb/shared';
import FormData from 'form-data';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { AutomationContext } from '../../types';
import { performanceScoresPath } from '../../utils/performance-scores';
import {
  calculatePerformanceScores,
  filterProducts,
  getBenchmarkMaxes,
  predictMissingBenchmarks,
} from './utils';

/**
 * Filters for fetching products that need scores calculated.
 */
const LIST_FILTERS: Partial<Record<ProductType, ListProductsFilter>> = {
  [ProductType.Cpu]: {},
  [ProductType.Gpu]: { isChipset: true },
};

/**
 * List of benchmarks used to calculate the product's score.
 * Missing benchmarks will be predicted.
 */
const SCORE_BENCHMARKS: Partial<Record<ProductType, BenchmarKey[]>> = {
  [ProductType.Cpu]: [
    BenchmarKey.CpuMarkMultiThread,
    BenchmarKey.CpuMarkSingleThread,
    BenchmarKey.GeekBenchMultiCore,
    BenchmarKey.GeekBenchSingleCore,
  ],
  [ProductType.Gpu]: [BenchmarKey.G3dMark, BenchmarKey.G2dMark],
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
  Record<ProductType, Partial<Record<BenchmarKey, number>>>
> = {
  [ProductType.Cpu]: {
    [BenchmarKey.CpuMarkMultiThread]: 0.4,
    [BenchmarKey.CpuMarkSingleThread]: 0.1,
    [BenchmarKey.GeekBenchMultiCore]: 0.4,
    [BenchmarKey.GeekBenchSingleCore]: 0.1,
  },
  [ProductType.Gpu]: {
    [BenchmarKey.G3dMark]: 1,
    [BenchmarKey.G2dMark]: 0,
  },
};

export async function updatePerformanceScoresAction(
  _action: AutomationAction,
  context: AutomationContext,
) {
  await updatePerformanceScores(ProductType.Cpu, context);
  await updatePerformanceScores(ProductType.Gpu, context);

  // TODO: reset cache

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updatePerformanceScoresDate: new Date().getTime(),
  };
}

export async function updatePerformanceScores(
  productType: ProductType,
  context: AutomationContext,
) {
  const scoreBenchmarks = SCORE_BENCHMARKS[productType];
  const minNumBenchmarks = MIN_NUM_BENCHMARKS[productType];
  const weights = WEIGHTS[productType];

  // Fetch products
  const products = filterProducts(
    await fetchProducts(productType, context),
    scoreBenchmarks,
    minNumBenchmarks,
  );

  // Prepare data
  const maxes = getBenchmarkMaxes(products, scoreBenchmarks);
  const estimates = predictMissingBenchmarks(
    products,
    scoreBenchmarks,
    maxes,
    weights,
  );

  // Calculate Scores
  const performanceScores = calculatePerformanceScores(
    products,
    scoreBenchmarks,
    maxes,
    weights,
    estimates,
  );

  // Create and upload scores file
  const path = await createScoresFile(productType, performanceScores);
  await uploadScoresFile(productType, path, context);
}

async function fetchProducts(
  productType: ProductType,
  context: AutomationContext,
) {
  const filter = LIST_FILTERS[productType];
  const request: ListProductsRequest = { productType, query: { filter } };
  const response = await context.api.get<ListProductsResponse>(
    'products/all',
    {},
    { params: { req: JSON.stringify(request) } },
  );
  return response.results;
}

async function createScoresFile(
  productType: ProductType,
  scores: ProductPerformanceScores[],
) {
  const json = JSON.stringify(scores);
  const path = performanceScoresPath(
    `${productType.toLowerCase()}-scores.json`,
  );
  await fsPromises.writeFile(path, json, 'utf-8');
  return path;
}

async function uploadScoresFile(
  productType: ProductType,
  path: string,
  context: AutomationContext,
) {
  const data = new FormData();
  data.append('productType', productType);
  data.append('file', fs.createReadStream(path));
  console.log(`Uploading scores: ${path}`);
  await context.api.post(
    'automation/actions/performance-scores',
    data,
    {},
    {
      headers: { 'content-type': 'multipart/form-data' },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    },
  );
  console.log(`Uploaded scores: ${path}`);
}
