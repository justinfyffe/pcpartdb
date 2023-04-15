import { WEBSITE_URL } from '@pcpartdb/shared';
import * as fs from 'fs';
import path from 'path';
import { dataPath } from '../shared/file';

const SITEMAPS_PATH = dataPath('sitemaps');

if (!fs.existsSync(SITEMAPS_PATH)) {
  fs.mkdirSync(SITEMAPS_PATH, { recursive: true });
}

export function sitemapPath(file?: string) {
  return file != null ? path.join(SITEMAPS_PATH, file) : SITEMAPS_PATH;
}

export function sitemapUrl(file: string) {
  return `${WEBSITE_URL}/${file}`;
}
