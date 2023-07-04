import * as fs from 'fs';
import path from 'path';
import { scrapeDataPath } from '../utils';

const CPUS_PATH = scrapeDataPath('cpus');
const OUTPUT_PATH = path.join(CPUS_PATH, 'output');

if (!fs.existsSync(CPUS_PATH)) {
  fs.mkdirSync(CPUS_PATH, { recursive: true });
}
if (!fs.existsSync(OUTPUT_PATH)) {
  fs.mkdirSync(OUTPUT_PATH, { recursive: true });
}

export function cpusPath(file?: string) {
  return file != null ? path.join(CPUS_PATH, file) : CPUS_PATH;
}

export function outputPath(file?: string) {
  return file != null ? path.join(OUTPUT_PATH, file) : OUTPUT_PATH;
}
