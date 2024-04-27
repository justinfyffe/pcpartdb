import { schema } from 'normalizr';

export const productNormalizr = new schema.Entity(
  'products',
  {},
  { mergeStrategy: (a, _b) => a },
);
export const gameNormalizr = new schema.Entity('games');

productNormalizr.define({
  parent: productNormalizr,
  games: [{ game: gameNormalizr }],
  relatedProducts: [productNormalizr],
});

gameNormalizr.define({
  minimumCpu: productNormalizr,
  recommendedCpu: productNormalizr,
  minimumGpu: productNormalizr,
  recommendedGpu: productNormalizr,
});

export const relativeDataProductsNormalizr = new schema.Object({
  benchmarkPerformance: [productNormalizr],
  benchmarkPerformancePerDollar: [productNormalizr],
  gameFps: [productNormalizr],
  gameCpf: [productNormalizr],
  gameFpsPerDollar: [productNormalizr],

  bestBenchmarkPerformance: productNormalizr,
  bestBenchmarkPerformancePerDollar: productNormalizr,
});
