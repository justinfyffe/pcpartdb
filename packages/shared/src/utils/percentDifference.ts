export function percentDifference(
  originalOrLower: number,
  newValueOrHigher: number,
) {
  return ((originalOrLower - newValueOrHigher) / originalOrLower) * -1;
}
