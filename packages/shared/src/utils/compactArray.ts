import { compactObject } from './compactObject';

export function compactArray<T>(arr: T[]): T[] {
  if (arr == null) {
    return null;
  }

  return arr.reduce((acc, value) => {
    // Null, undefined, or empty string
    if (value == null || value === '') {
      return acc;
    }

    // Array
    if (Array.isArray(value)) {
      const compacted = compactArray(value);
      if (compacted == null || compacted.length === 0) {
        return acc;
      }

      acc.push(compacted as T);
      return acc;
    }

    // Object
    if (typeof value === 'object') {
      const compacted = compactObject(value);
      if (Object.keys(compacted).length === 0) {
        return acc;
      }

      acc.push(compacted);
      return acc;
    }

    acc.push(value);
    return acc;
  }, [] as T[]);
}
