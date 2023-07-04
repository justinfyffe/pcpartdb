import * as fs from 'fs';
import path from 'path';
import { dataPath } from '../../shared/file';

const SCRAPE_SOURCES_PATH = dataPath('scrape-sources');

if (!fs.existsSync(SCRAPE_SOURCES_PATH)) {
  fs.mkdirSync(SCRAPE_SOURCES_PATH, { recursive: true });
}

export function scrapeSourcesPath(file?: string) {
  return file != null
    ? path.join(SCRAPE_SOURCES_PATH, file)
    : SCRAPE_SOURCES_PATH;
}
