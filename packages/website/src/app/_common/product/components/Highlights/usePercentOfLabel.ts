import { useMemo } from 'react';
import { usePercentOf } from '../../../hooks/data/usePercentOf';

interface UsePercentOfLabelArgs {
  baseValue: number;
  maxValue: number;

  isMaxLabel?: string;
  percentMinDecimals?: number;
  percentMaxDecimals?: number;
  maxValueMinDecimals?: number;
  maxValueMaxDecimals?: number;
}

export function usePercentOfLabel(args: UsePercentOfLabelArgs) {
  const {
    baseValue,
    maxValue,
    isMaxLabel,
    percentMinDecimals,
    percentMaxDecimals,
    maxValueMinDecimals,
    maxValueMaxDecimals,
  } = args;
  const percent = usePercentOf(baseValue, maxValue);

  return useMemo(() => {
    if (baseValue == null || maxValue == null) {
      return null;
    }

    if (baseValue === maxValue && isMaxLabel) {
      return isMaxLabel;
    }

    return `${percent.toLocaleString('en-US', {
      minimumFractionDigits: percentMinDecimals,
      maximumFractionDigits: percentMaxDecimals,
    })}% of ${maxValue.toLocaleString('en-US', {
      minimumFractionDigits: maxValueMinDecimals,
      maximumFractionDigits: maxValueMaxDecimals,
    })}`;
  }, [
    baseValue,
    isMaxLabel,
    maxValue,
    maxValueMaxDecimals,
    maxValueMinDecimals,
    percent,
    percentMaxDecimals,
    percentMinDecimals,
  ]);
}
