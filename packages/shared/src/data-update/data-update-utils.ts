import { applyPatch, compare as generateJsonPatch } from 'fast-json-patch';
import { Diff } from './data-update-types';

export function generateDiff<T>(original: T, updated: T) {
  return generateJsonPatch(original, updated) as Diff;
}

export function applyDiff<T>(original: T, diff: Diff) {
  return applyPatch(original, diff).newDocument;
}
