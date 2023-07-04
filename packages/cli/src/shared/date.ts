export function yyyyMmDd(date?: Date) {
  const value = date ?? new Date();
  return value.toISOString().substring(0, 10);
}
