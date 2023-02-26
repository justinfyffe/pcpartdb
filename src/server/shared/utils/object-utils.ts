export function isObject(value: unknown): value is object {
  return value && typeof value === 'object' && !Array.isArray(value);
}

export function deepMergeObjects<T = unknown>(target: T, ...sources: T[]): T {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        deepMergeObjects(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMergeObjects(target, ...sources);
}
