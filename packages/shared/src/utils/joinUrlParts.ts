import { cleanUrl } from './cleanUrl';

export function joinUrlParts(...parts: string[]) {
  const partsArr = Array.isArray(parts[0]) ? parts[0] : parts;

  return cleanUrl(partsArr.join('/'));
}
