import { applyPatch, compare as generateJsonPatch } from 'fast-json-patch';
import { DataUpdateDiff } from './data-update-types';

export function generateDiff<T>(original: T, updated: T) {
  return generateJsonPatch(original, updated) as DataUpdateDiff;
}

export function applyDiff<T>(original: T, diff: DataUpdateDiff) {
  return applyPatch(original, diff).newDocument;
}
