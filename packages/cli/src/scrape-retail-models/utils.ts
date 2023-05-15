import * as fs from 'fs';
import path from 'path';
import { dataPath } from '../shared/file';

const SCRAPE_RETAIL_MODELS_DATA_PATH = dataPath('scrape-retail-models');
const SOURCES_PATH = path.join(SCRAPE_RETAIL_MODELS_DATA_PATH, 'sources');
const RETAIL_MODELS_DATA_PATH = path.join(
  SCRAPE_RETAIL_MODELS_DATA_PATH,
  'retail-models',
);

if (!fs.existsSync(SOURCES_PATH)) {
  fs.mkdirSync(SOURCES_PATH, { recursive: true });
}
if (!fs.existsSync(RETAIL_MODELS_DATA_PATH)) {
  fs.mkdirSync(RETAIL_MODELS_DATA_PATH, { recursive: true });
}

export function sourcesDataPath(file?: string) {
  return file != null ? path.join(SOURCES_PATH, file) : SOURCES_PATH;
}

export function retailModelsDataPath(file?: string) {
  return file != null
    ? path.join(RETAIL_MODELS_DATA_PATH, file)
    : RETAIL_MODELS_DATA_PATH;
}
