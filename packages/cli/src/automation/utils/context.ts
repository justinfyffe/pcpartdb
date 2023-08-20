import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { AutomationContext } from '../types';
import { automationDataPath } from './file';

const FILE_PATH = automationDataPath('context.json');

export async function loadAutomationContext() {
  if (!fs.existsSync(FILE_PATH)) {
    return {} as Omit<AutomationContext, 'api'>;
  }

  const json = await fsPromises.readFile(FILE_PATH, 'utf-8');
  if (json) {
    return JSON.parse(json) as Omit<AutomationContext, 'api'>;
  }

  return {} as Omit<AutomationContext, 'api'>;
}

export async function saveAutomationContext(context: AutomationContext) {
  const {
    api: _api,
    concurrency: _concurrency,
    requestChunkDelay: _requestChunkDelay,
    ...data
  } = context;

  const json = JSON.stringify(data, undefined, 2);
  await fsPromises.writeFile(FILE_PATH, json, 'utf-8');
}
