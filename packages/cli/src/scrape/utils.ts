import * as fs from 'fs';
import path from 'path';
import { dataPath } from '../shared/file';

const SCRAPER_DATA_PATH = dataPath('scraper');
const SOURCE_MODELS_PATH = path.join(SCRAPER_DATA_PATH, 'source-models');
const TECHPOWERUP_DATA_PATH = path.join(SCRAPER_DATA_PATH, 'techpowerup');
const UL_BENCHMARKS_DATA_PATH = path.join(SCRAPER_DATA_PATH, 'ul-benchmarks');
const VIDEOCARDBENCHMARKS_DATA_PATH = path.join(
  SCRAPER_DATA_PATH,
  'videocardbenchmarks',
);

if (!fs.existsSync(SOURCE_MODELS_PATH)) {
  fs.mkdirSync(SOURCE_MODELS_PATH, { recursive: true });
}
if (!fs.existsSync(TECHPOWERUP_DATA_PATH)) {
  fs.mkdirSync(TECHPOWERUP_DATA_PATH, { recursive: true });
}
if (!fs.existsSync(UL_BENCHMARKS_DATA_PATH)) {
  fs.mkdirSync(UL_BENCHMARKS_DATA_PATH, { recursive: true });
}
if (!fs.existsSync(VIDEOCARDBENCHMARKS_DATA_PATH)) {
  fs.mkdirSync(VIDEOCARDBENCHMARKS_DATA_PATH, { recursive: true });
}

export function techPowerUpDataPath(file?: string) {
  return file != null
    ? path.join(TECHPOWERUP_DATA_PATH, file)
    : TECHPOWERUP_DATA_PATH;
}

export function ulBenchmarksDataPath(file?: string) {
  return file != null
    ? path.join(UL_BENCHMARKS_DATA_PATH, file)
    : UL_BENCHMARKS_DATA_PATH;
}

export function videocardBenchmarksDataPath(file?: string) {
  return file != null
    ? path.join(VIDEOCARDBENCHMARKS_DATA_PATH, file)
    : VIDEOCARDBENCHMARKS_DATA_PATH;
}

export function sourceModelsDataPath(file?: string) {
  return file != null
    ? path.join(SOURCE_MODELS_PATH, file)
    : SOURCE_MODELS_PATH;
}
