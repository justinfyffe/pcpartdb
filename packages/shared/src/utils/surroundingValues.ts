export function surroundingValues<T>(arr: T[], index: number, total: number) {
  let start = index;
  let end = index + 1;
  let counter = 0;
  while (end - start < total && (start > 0 || end < arr.length)) {
    if (counter++ % 2 === 0) {
      if (start > 0) {
        --start;
      }
    } else {
      if (end < arr.length) {
        ++end;
      }
    }
  }

  return arr.slice(start, end);
}
