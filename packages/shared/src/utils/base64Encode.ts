export function base64Encode<T = unknown>(value: T) {
  const valueStringified =
    typeof value === 'string' ? value : JSON.stringify(value);
  return Buffer.from(valueStringified).toString('base64');
}
