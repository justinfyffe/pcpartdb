interface UsePercentOfOptions {
  asFraction?: boolean;
}

export function usePercentOf(
  baseValue: number,
  maxValue: number,
  options?: UsePercentOfOptions,
) {
  if (baseValue == null || maxValue == null) {
    return null;
  } else if (baseValue === maxValue) {
    return options?.asFraction ? 1 : 100;
  }

  const pct = baseValue / maxValue;
  return options?.asFraction ? pct : pct * 100;
}
