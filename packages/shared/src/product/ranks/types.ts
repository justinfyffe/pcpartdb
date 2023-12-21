export enum RankType {
  Performance = 'performance',
  Value = 'value',
}

// Key -> { rank, total }
export type ProductRanks = Record<string, { rank: number; total: number }>;
