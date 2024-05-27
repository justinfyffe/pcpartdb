import { useMemo } from 'react';

interface UseScoreLabelArgs {
  score: number;
  isNullLabel?: string;
  minDecimals?: number;
  maxDecimals?: number;
}

export function useScoreLabel(args: UseScoreLabelArgs) {
  const { score, isNullLabel: nullLabel, minDecimals, maxDecimals } = args;

  return useMemo(() => {
    if (score != null) {
      return `${score.toLocaleString('en-US', {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals,
      })}`;
    } else {
      return nullLabel ? 'No data available' : null;
    }
  }, [maxDecimals, minDecimals, nullLabel, score]);
}
