import * as fs from 'fs';
import path from 'path';
import { automationDataPath } from './file';

const PERFORMANCE_SCORES_PATH = automationDataPath('performance-scores');

if (!fs.existsSync(PERFORMANCE_SCORES_PATH)) {
  fs.mkdirSync(PERFORMANCE_SCORES_PATH, { recursive: true });
}

export function performanceScoresPath(file?: string) {
  return file != null
    ? path.join(PERFORMANCE_SCORES_PATH, file)
    : PERFORMANCE_SCORES_PATH;
}
