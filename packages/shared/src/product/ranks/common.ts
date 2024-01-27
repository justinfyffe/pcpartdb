// Enums

export enum RankType {
  Performance = 'performance',
  PerformancePerDollar = 'value',
}

// Types

// Key -> { rank, total }
export type ProductRank = { rank: number; total: number };
export type ProductRanks = Record<string, ProductRank>;
