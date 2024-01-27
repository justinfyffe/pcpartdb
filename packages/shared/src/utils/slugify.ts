export function slugify(value: string) {
  return value
    .replaceAll('+', ' plus ')
    .replaceAll(/[^a-zA-Z0-9-_]+/g, ' ')
    .split(' ')
    .map((value) => value.toLowerCase().trim())
    .filter((value) => value.length > 0)
    .join('-');
}
