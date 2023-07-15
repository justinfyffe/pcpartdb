import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { AutopilotConfig } from '../types';

const UPDATE_SITEMAPS_FREQUENCY = 1000 * 60 * 60 * 24; // Daily
const FETCH_CPU_SOURCES_FREQUENCY = 1000 * 60 * 60 * 24 * 7; // Weekly
const FETCH_GPU_SOURCES_FREQUENCY = 1000 * 60 * 60 * 24 * 7; // Weekly

export async function loadAutopilotConfig(file: string) {
  if (!fs.existsSync(file)) {
    return {} as AutopilotConfig;
  }

  const json = await fsPromises.readFile(file, 'utf-8');
  if (json) {
    return JSON.parse(json) as AutopilotConfig;
  }

  return {} as AutopilotConfig;
}

export async function saveAutopilotConfig(
  file: string,
  config: AutopilotConfig,
) {
  const data: AutopilotConfig = {
    updateSitemapsDate: config?.updateSitemapsDate,
    fetchCpuSourcesDate: config?.fetchCpuSourcesDate,
    fetchGpuSourcesDate: config?.fetchGpuSourcesDate,
  };

  const json = JSON.stringify(data, undefined, 2);
  await fsPromises.writeFile(file, json, 'utf-8');
}
