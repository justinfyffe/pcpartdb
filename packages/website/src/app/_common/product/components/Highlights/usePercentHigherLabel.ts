import { percentDifference } from '@pcpartdb/shared';

interface UsePercentHigherLabelArgs {
  higher: number;
  lower: number;

  minDecimals?: number;
  maxDecimals?: number;
}

export function usePercentHigherLabel(args: UsePercentHigherLabelArgs) {
  const { higher, lower, minDecimals, maxDecimals } = args;

  if (lower >= higher || higher == null || lower == null) {
    return null;
  }

  const diff = (percentDifference(lower, higher) * 100).toLocaleString(
    'en-US',
    {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
    },
  );
  return `${diff}%`;
}
