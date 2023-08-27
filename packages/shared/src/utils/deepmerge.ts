import { isProductField } from '../product';

export enum ArrayMerge {
  UseTarget,
  Combine,
}

export interface DeepmergeOptions<T = unknown> {
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
  let source: any = structuredClone(objs.shift());

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

function mergeArray(source: any, obj: any, options: DeepmergeOptions) {
  const arrayMerge = options.arrayMerge || ArrayMerge.UseTarget;
  const canMergeFn = options.canMergeStrategy || CanMergeDefaultStrategy;

  if (!canMergeFn(options.pathKey, source, obj)) {
    return source;
  }

  if (arrayMerge === ArrayMerge.Combine) {
    return [...source, ...structuredClone(obj as any)];
  } else if (arrayMerge === ArrayMerge.UseTarget) {
    return [...structuredClone(obj as any)];
  }

  throw new Error('Invalid array merge strategy');
}

export function CanMergeDefaultStrategy(_key: string, _source: any, _obj: any) {
  return true;
}

export function CanMergeAutoUpdateStrategy(
  _key: string,
  source: any,
  _obj: any,
) {
  if (
    isProductField(source) &&
    source?.meta?.autoUpdate != null &&
    source.meta.autoUpdate === false
  ) {
    return false;
  }

  return true;
}
