import { snakeCaseToCamelCase } from './snakeCaseToCamelCase';

export function camelize(item: unknown): unknown {
  if (Array.isArray(item)) {
    return item.map((el: unknown) => camelize(el));
  } else if (typeof item === 'function' || item !== Object(item)) {
    return item;
  }
  return Object.fromEntries(
    Object.entries(item as Record<string, unknown>).map(
      ([key, value]: [string, unknown]) => [
        snakeCaseToCamelCase(key),
        camelize(value),
      ],
    ),
  );
}
