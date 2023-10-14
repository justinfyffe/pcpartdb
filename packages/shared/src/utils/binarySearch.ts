export function binarySearch<T = unknown>(
  sorted: T[],
  needle: T,
  compareFn: (a: T, b: T) => number,
) {
  return recursiveSearch(sorted, needle, compareFn, 0, sorted.length - 1);
}

function recursiveSearch<T = unknown>(
  haystack: T[],
  needle: T,
  compareFn: (a: T, b: T) => number,
  start: number,
  end: number,
): number {
  if (start > end) {
    return -1;
  }

  const mid = Math.floor((start + end) / 2);

  if (compareFn(haystack[mid], needle) === 0) {
    return mid;
  } else if (compareFn(haystack[mid], needle) > 0) {
    return recursiveSearch(haystack, needle, compareFn, start, mid - 1);
  } else {
    return recursiveSearch(haystack, needle, compareFn, mid + 1, end);
  }
}
