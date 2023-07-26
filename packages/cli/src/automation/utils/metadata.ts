import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { AutomationMetadata } from '../types';
import { automationDataPath } from './file';

const FILE_PATH = automationDataPath('metadata.json');

export async function loadAutomationMetadata() {
  if (!fs.existsSync(FILE_PATH)) {
    return {} as AutomationMetadata;
  }

  const json = await fsPromises.readFile(FILE_PATH, 'utf-8');
  if (json) {
    return JSON.parse(json) as AutomationMetadata;
  }

  return {} as AutomationMetadata;
}

export async function saveAutomationMetadata(executions: AutomationMetadata) {
  const data: AutomationMetadata = {
    updateSitemapsDate: executions?.updateSitemapsDate,
    updateCpuSourcesDate: executions?.updateCpuSourcesDate,
    updateGpuSourcesDate: executions?.updateGpuSourcesDate,
  };

  const json = JSON.stringify(data, undefined, 2);
  await fsPromises.writeFile(FILE_PATH, json, 'utf-8');
}
