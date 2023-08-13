import { joinUrlParts, WEBSITE_URL } from '@pcpartdb/shared';
import * as fs from 'fs';
import path from 'path';
import { automationDataPath } from './file';

const SITEMAPS_PATH = automationDataPath('sitemaps');

if (!fs.existsSync(SITEMAPS_PATH)) {
  fs.mkdirSync(SITEMAPS_PATH, { recursive: true });
}

export function sitemapPath(file?: string) {
  return file != null ? path.join(SITEMAPS_PATH, file) : SITEMAPS_PATH;
}

interface SitemapUrlOptions {
  compressed?: boolean;
}

export function sitemapUrl(file: string, options?: SitemapUrlOptions) {
  if (options?.compressed) {
    return joinUrlParts(WEBSITE_URL, `${file}.gz`);
  } else {
    return joinUrlParts(WEBSITE_URL, file);
  }
}

export function websiteUrl(path: string) {
  return joinUrlParts(WEBSITE_URL, path);
}
