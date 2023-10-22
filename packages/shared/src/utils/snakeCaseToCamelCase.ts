export function snakeCaseToCamelCase(value: string) {
  return value
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    );
}
