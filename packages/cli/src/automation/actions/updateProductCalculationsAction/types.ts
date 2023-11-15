import {
  BenchmarkKey,
  Product,
  ProductScoreCalculations,
  RankKey,
  RelatedProductType,
} from '@pcpartdb/shared';

export interface ProductCalculations {
  product: Product;
  scores?: ProductScoreCalculations;
  ranks?: Partial<Record<RankKey, number>>;
  related?: Partial<Record<RelatedProductType, number[]>>;
}

export type BenchmarkEstimates = Record<
  number,
  Partial<Record<BenchmarkKey, number>>
>;

export type BenchmarkMaxes = Partial<Record<BenchmarkKey, number>>;

export type BenchmarkWeights = Partial<Record<BenchmarkKey, number>>;
