import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { GpuSourceModel } from './types';
import { sourceModelsDataPath } from './utils';

export async function getSourceModel(model?: string) {
  if (model == null) {
    // Source model not provided, generate it.
    console.log('Source Model not provided. Using latest.');
    return readSourceModel(sourceModelsDataPath('source-model.json'));
  } else {
    // Source model file provided, use that instead.
    if (!fs.existsSync(model)) {
      throw new Error(`Cannot find source model at ${model}`);
    }

    console.log(`Reading Source Model from ${model}`);
    return await readSourceModel(model);
  }
}

async function readSourceModel(path: string) {
  const json = await fsPromises.readFile(path, 'utf-8');
  return JSON.parse(json) as GpuSourceModel;
}
