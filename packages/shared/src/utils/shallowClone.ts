export function shallowClone<T = unknown>(value: T) {
  if (value == null) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value);
  }
  if (value instanceof Map) {
    return new Map(value);
  }
  if (value instanceof Set) {
    return new Set(value);
  }
  if (Array.isArray(value)) {
    return value.slice();
  }
  if (typeof value === 'object') {
    return Object.assign({}, value);
  }

  return value;
}
