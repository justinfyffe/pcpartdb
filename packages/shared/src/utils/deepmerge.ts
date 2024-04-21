export enum ArrayMerge {
  UseTarget,
  Combine,
  UseLarger,
}

export interface DeepmergeOptions {
  arrayMerge?: ArrayMerge;
  canMergeStrategy?: (key: string, source: unknown, obj: unknown) => boolean;

  // Key that represents which property we are merging.
  pathKey?: string;
}

export function deepmerge<T = unknown>(
  options: DeepmergeOptions,
  ...objs: T[]
): T {
  const canMergeFn = options.canMergeStrategy || CanMergeDefaultStrategy;
  const pathKey = options.pathKey || 'root';

  // Create a clone of the first item in the objs array
  let source: T = structuredClone(objs.shift());

  // Loop through each item
  for (const obj of objs) {
    // Get the object type
    const type = getType(obj);

    if (!canMergeFn(pathKey, source, obj)) {
      continue;
    }

    if (getType(source) !== type) {
      // If the current item isn't the same type as the clone, replace it
      source = structuredClone(obj);
      continue;
    }

    // Otherwise, merge
    if (type === 'array') {
      source = mergeArray(source, obj, { ...options, pathKey });
    } else if (type === 'object') {
      source = mergeObj(source, obj, { ...options, pathKey });
    } else {
      source = structuredClone(obj);
    }
  }

  return source;
}

function getType<T>(obj: T) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mergeObj(source: any, obj: any, options: DeepmergeOptions) {
  const canMergeFn = options.canMergeStrategy || CanMergeDefaultStrategy;

  for (const [key, value] of Object.entries(obj)) {
    const type = getType(value);
    const pathKey = `${options.pathKey}.${key}`;
    if (!canMergeFn(pathKey, source[key], value)) {
      continue;
    }

    if (
      source[key] !== undefined &&
      getType(source[key]) === type &&
      ['array', 'object'].includes(type)
    ) {
      source[key] = deepmerge({ ...options, pathKey }, source[key], value);
    } else {
      source[key] = structuredClone(value);
    }
  }
  return source;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mergeArray(source: any, obj: any, options: DeepmergeOptions) {
  const arrayMerge = options.arrayMerge || ArrayMerge.UseTarget;
  const canMergeFn = options.canMergeStrategy || CanMergeDefaultStrategy;

  if (!canMergeFn(options.pathKey, source, obj)) {
    return source;
  }

  if (arrayMerge === ArrayMerge.Combine) {
    return [...source, ...structuredClone(obj)];
  } else if (arrayMerge === ArrayMerge.UseTarget) {
    return [...structuredClone(obj)];
  } else if (arrayMerge === ArrayMerge.UseLarger) {
    if (source.length >= obj.length) {
      return [...source];
    } else {
      return [...structuredClone(obj)];
    }
  }

  throw new Error('Invalid array merge strategy');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CanMergeDefaultStrategy(_key: string, _source: any, obj: any) {
  if (obj === undefined) {
    return false;
  }

  return true;
}

export function CanMergeNoEmptyStrategy(_key: string, _source: any, obj: any) {
  if (obj == null || obj === '') {
    return false;
  }

  return true;
}
