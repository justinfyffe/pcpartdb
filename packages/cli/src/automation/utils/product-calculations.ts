import * as fs from 'fs';
import path from 'path';
import { automationDataPath } from './file';

const PRODUCT_CALCULATIONS_PATH = automationDataPath('product-calculations');

if (!fs.existsSync(PRODUCT_CALCULATIONS_PATH)) {
  fs.mkdirSync(PRODUCT_CALCULATIONS_PATH, { recursive: true });
}

export function productCalculationsPath(file?: string) {
  return file != null
    ? path.join(PRODUCT_CALCULATIONS_PATH, file)
    : PRODUCT_CALCULATIONS_PATH;
}
