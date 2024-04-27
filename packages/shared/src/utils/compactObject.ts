import { compactArray } from './compactArray';

export function compactObject<T>(obj: T): T {
  if (obj == null) {
    return null;
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    // Null, undefined, or empty string
    if (value == null || value === '') {
      return acc;
    }

    // Empty object
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return acc;
    }

    // Array
    if (Array.isArray(value)) {
      const compacted = compactArray(value);
      if (compacted == null || compacted.length === 0) {
        return acc;
      } else {
        (acc as any)[key] = compacted;
        return acc;
      }
    }

    // Object
    if (typeof value === 'object') {
      const compacted = compactObject(value);
      if (Object.keys(compacted).length === 0) {
        return acc;
      }

      (acc as any)[key] = compacted;
      return acc;
    }

    (acc as any)[key] = value;
    return acc;
  }, {} as T);
}
