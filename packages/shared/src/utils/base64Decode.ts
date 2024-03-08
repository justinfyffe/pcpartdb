export function base64Decode<T = unknown>(base64: string) {
  if (base64 == null) {
    return null;
  }

  const value = Buffer.from(base64, 'base64').toString('utf-8');
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    return value as T;
  }
}
