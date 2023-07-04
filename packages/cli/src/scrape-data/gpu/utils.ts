import * as fs from 'fs';
import path from 'path';
import { scrapeDataPath } from '../utils';

const GPUS_PATH = scrapeDataPath('gpus');
const OUTPUT_PATH = path.join(GPUS_PATH, 'output');

if (!fs.existsSync(GPUS_PATH)) {
  fs.mkdirSync(GPUS_PATH, { recursive: true });
}
if (!fs.existsSync(OUTPUT_PATH)) {
  fs.mkdirSync(OUTPUT_PATH, { recursive: true });
}

export function gpusPath(file?: string) {
  return file != null ? path.join(GPUS_PATH, file) : GPUS_PATH;
}

export function outputPath(file?: string) {
  return file != null ? path.join(OUTPUT_PATH, file) : OUTPUT_PATH;
}
