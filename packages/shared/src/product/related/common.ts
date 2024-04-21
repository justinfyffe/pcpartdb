import { Product, ProductComparison } from '../common';

// Enums

export enum RelativeDataType {
  BenchmarkPerformance = 'BENCHMARK_PERFORMANCE',
  BenchmarkPerformancePerDollar = 'BENCHMARK_PERFORMANCE_PER_DOLLAR',
  GameFps = 'GAME_FPS',
  GameCpf = 'GAME_CPF',
  GameFpsPerDollar = 'GAME_FPS_PER_DOLLAR',
}

// Types

export interface RelatedProduct {
  productId?: number;
  relatedProductId: number;

  relatedProduct?: Partial<Product>;
}

export type RelatedProducts = Partial<Product>[];

export interface RelatedProductComparisons {
  comparisons: ProductComparison[];
}

export interface RelativeDataProducts {
  benchmarkPerformance?: Partial<Product>[];
  benchmarkPerformancePerDollar?: Partial<Product>[];
  gameFps?: Partial<Product>[];
  gameCpf?: Partial<Product>[];
  gameFpsPerDollar?: Partial<Product>[];

  bestBenchmarkPerformance?: Partial<Product>;
  bestBenchmarkPerformancePerDollar?: Partial<Product>;
}
