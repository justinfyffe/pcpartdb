import * as fs from 'fs';
import path from 'path';
import { scrapeSourcesPath } from '../shared/utils';

const CPU_PATH = scrapeSourcesPath('cpu');
const SOURCE_MODELS_PATH = path.join(CPU_PATH, 'source-models');
const TECHPOWERUP_PATH = path.join(CPU_PATH, 'techpowerup');
const GEEKBENCH_PATH = path.join(CPU_PATH, 'geekbench');
const PASSMARK_PATH = path.join(CPU_PATH, 'passmark');

if (!fs.existsSync(CPU_PATH)) {
  fs.mkdirSync(CPU_PATH, { recursive: true });
}
if (!fs.existsSync(SOURCE_MODELS_PATH)) {
  fs.mkdirSync(SOURCE_MODELS_PATH, { recursive: true });
}
if (!fs.existsSync(TECHPOWERUP_PATH)) {
  fs.mkdirSync(TECHPOWERUP_PATH, { recursive: true });
}
if (!fs.existsSync(GEEKBENCH_PATH)) {
  fs.mkdirSync(GEEKBENCH_PATH, { recursive: true });
}
if (!fs.existsSync(PASSMARK_PATH)) {
  fs.mkdirSync(PASSMARK_PATH, { recursive: true });
}

export function techPowerUpPath(file?: string) {
  return file != null ? path.join(TECHPOWERUP_PATH, file) : TECHPOWERUP_PATH;
}

export function geekBenchPath(file?: string) {
  return file != null ? path.join(GEEKBENCH_PATH, file) : GEEKBENCH_PATH;
}

export function passMarkPath(file?: string) {
  return file != null ? path.join(PASSMARK_PATH, file) : PASSMARK_PATH;
}

export function sourceModelsPath(file?: string) {
  return file != null
    ? path.join(SOURCE_MODELS_PATH, file)
    : SOURCE_MODELS_PATH;
}
