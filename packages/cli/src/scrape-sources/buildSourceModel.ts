import {
  TechPowerUpGpuSource,
  UlBenchmarkGpuSource,
  VideocardBenchmarksGpuSource,
} from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { GpuSource, GpuSourceModel } from './types';
import {
  sourceModelsDataPath,
  techPowerUpDataPath,
  ulBenchmarksDataPath,
  videocardBenchmarksDataPath,
} from './utils';

export async function buildSourceModel() {
  const techPowerUpSources = await readTechPowerUpSources();
  const ulBenchmarkSources = await readUlBenchmarkSources();
  const videocardBenchmarksSources = await readVideocardBenchmarksSources();

  const map: Record<string, GpuSource> = {};

  techPowerUpSources.forEach((data) => {
    const key = data.name;
    const orig = map[key] || {};
    map[key] = {
      ...orig,
      name: orig.name || data.name,
      techPowerUpUrl: orig.techPowerUpUrl || data.url,
      company: orig.company || data.company,
    };
  });

  ulBenchmarkSources.forEach((data) => {
    const key = data.name;
    const orig = map[key] || {};
    map[key] = {
      ...orig,
      name: orig.name || data.name,
      timespyScore: orig.timespyScore || data.timespyScore,
      ulBenchmarksUrl: orig.ulBenchmarksUrl || data.url,
      company: orig.company || data.company,
    };
  });

  videocardBenchmarksSources.forEach((data) => {
    const key = data.name;
    const orig = map[key] || {};
    map[key] = {
      ...orig,
      name: orig.name || data.name,
      g2dMark: orig.g2dMark || data.g2dMark,
      g3dMark: orig.g3dMark || data.g3dMark,
      marketSegment: orig.marketSegment || data.marketSegment,
      videocardBenchmarksUrl: orig.videocardBenchmarksUrl || data.url,
      company: orig.company || data.company,
    };
  });

  // We only want GPUs with most data
  const sourceModel: GpuSourceModel = Object.values(map).filter(
    (model) => model.company != null && model.techPowerUpUrl != null,
  );
  sourceModel.sort((m1, m2) => {
    if (m1.g3dMark != null || m2.g3dMark != null) {
      return (m2.g3dMark ?? 0) - (m1.g3dMark ?? 0);
    }

    return m1.name.localeCompare(m2.name);
  }); // g3d mark descending, then name ascending.

  // Save to file with date
  const path = sourceModelsDataPath('source-model.json');
  const timestampPath = sourceModelsDataPath(
    `source-model-${new Date().getTime()}.json`,
  );
  console.log(`Finished building Source Model. Saving to ${timestampPath}`);
  const json = JSON.stringify(sourceModel, undefined, 2);
  await fsPromises.writeFile(path, json, 'utf-8');
  await fsPromises.writeFile(timestampPath, json, 'utf-8');

  return sourceModel;
}

async function readTechPowerUpSources() {
  const json = await fsPromises.readFile(
    techPowerUpDataPath('gpu-sources.json'),
    'utf-8',
  );
  return JSON.parse(json) as TechPowerUpGpuSource[];
}

async function readUlBenchmarkSources() {
  const json = await fsPromises.readFile(
    ulBenchmarksDataPath('gpu-sources.json'),
    'utf-8',
  );
  return JSON.parse(json) as UlBenchmarkGpuSource[];
}

async function readVideocardBenchmarksSources() {
  const json = await fsPromises.readFile(
    videocardBenchmarksDataPath('gpu-sources.json'),
    'utf-8',
  );
  return JSON.parse(json) as VideocardBenchmarksGpuSource[];
}
