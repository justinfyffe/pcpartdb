import * as fs from 'fs';
import path from 'path';
import { dataPath } from '../../shared/file';

const SCRAPE_DATA_PATH = dataPath('scrape-data');

if (!fs.existsSync(SCRAPE_DATA_PATH)) {
  fs.mkdirSync(SCRAPE_DATA_PATH, { recursive: true });
}

export function scrapeDataPath(file?: string) {
  return file != null ? path.join(SCRAPE_DATA_PATH, file) : SCRAPE_DATA_PATH;
}
