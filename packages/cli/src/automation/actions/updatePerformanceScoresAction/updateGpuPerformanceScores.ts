import {
  AutomationAction,
  BenchmarKey,
  GpuProduct,
  ListProductsRequest,
  ListProductsResponse,
  ProductType,
} from '@pcpartdb/shared';
import { AutomationContext } from '../../types';
import {
  calculatePerformanceScores,
  filterProducts,
  getBenchmarkMaxes,
  predictMissingBenchmarks,
} from './utils';

const SCORE_BENCHMARKS = [BenchmarKey.G3dMark, BenchmarKey.G2dMark];
const REQUIRED_BENCHMARKS = [BenchmarKey.G3dMark, BenchmarKey.G2dMark];
const WEIGHTS = { [BenchmarKey.G3dMark]: 1, [BenchmarKey.G2dMark]: 0 };

export async function updateGpuPerformanceScores(
  _action: AutomationAction,
  context: AutomationContext,
) {
  // Pull GPUs
  const gpus = filterProducts(await fetchGpus(context), REQUIRED_BENCHMARKS);

  // Prepare data
  const maxes = getBenchmarkMaxes(gpus, SCORE_BENCHMARKS);
  const estimates = predictMissingBenchmarks(
    gpus,
    SCORE_BENCHMARKS,
    maxes,
    WEIGHTS,
  );

  // Calculate Scores
  const performanceScores = calculatePerformanceScores(
    gpus,
    SCORE_BENCHMARKS,
    maxes,
    WEIGHTS,
    estimates,
  );

  // Upload scores file
  Object.keys(performanceScores).forEach((key) =>
    console.log(`${key}: ${JSON.stringify(performanceScores[key as any])}`),
  );
}

async function fetchGpus(context: AutomationContext) {
  const request: ListProductsRequest = {
    productType: ProductType.Gpu,
    query: { filter: { isChipset: true } },
  };
  const response = await context.api.get<ListProductsResponse>(
    'products/all',
    {},
    { params: { req: JSON.stringify(request) } },
  );
  return response.results;
}
