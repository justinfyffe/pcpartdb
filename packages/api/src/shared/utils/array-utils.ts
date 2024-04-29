export function getSurroundingValues<T>(
  arr: T[],
  index: number,
  total: number,
) {
  let start = index;
  let end = index + 1;
  let counter = 0;
  while (counter < total - 1) {
    if (counter % 2 === 0 && start > 0) {
      --start;
    } else if (end < arr.length) {
      ++end;
    }
    counter++;
  }

  return arr.slice(start, end);
}
