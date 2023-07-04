import * as fs from 'fs';
import path from 'path';
import { scrapeSourcesPath } from '../shared/utils';

const GPU_PATH = scrapeSourcesPath('gpu');
const SOURCE_MODELS_PATH = path.join(GPU_PATH, 'source-models');
const TECHPOWERUP_PATH = path.join(GPU_PATH, 'techpowerup');
const UL_BENCHMARKS_PATH = path.join(GPU_PATH, 'ul-benchmarks');
const PASSMARK_PATH = path.join(GPU_PATH, 'passmark');

if (!fs.existsSync(GPU_PATH)) {
  fs.mkdirSync(GPU_PATH, { recursive: true });
}
if (!fs.existsSync(SOURCE_MODELS_PATH)) {
  fs.mkdirSync(SOURCE_MODELS_PATH, { recursive: true });
}
if (!fs.existsSync(TECHPOWERUP_PATH)) {
  fs.mkdirSync(TECHPOWERUP_PATH, { recursive: true });
}
if (!fs.existsSync(UL_BENCHMARKS_PATH)) {
  fs.mkdirSync(UL_BENCHMARKS_PATH, { recursive: true });
}
if (!fs.existsSync(PASSMARK_PATH)) {
  fs.mkdirSync(PASSMARK_PATH, { recursive: true });
}

export function techPowerUpPath(file?: string) {
  return file != null ? path.join(TECHPOWERUP_PATH, file) : TECHPOWERUP_PATH;
}

export function ulBenchmarksPath(file?: string) {
  return file != null
    ? path.join(UL_BENCHMARKS_PATH, file)
    : UL_BENCHMARKS_PATH;
}

export function passMarkPath(file?: string) {
  return file != null ? path.join(PASSMARK_PATH, file) : PASSMARK_PATH;
}

export function sourceModelsPath(file?: string) {
  return file != null
    ? path.join(SOURCE_MODELS_PATH, file)
    : SOURCE_MODELS_PATH;
}
