import {
  TechPowerUpGpuSource,
  UlBenchmarkGpuSource,
  VideocardBenchmarksGpuSource,
} from '@pcpartdb/scraper';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { GpuSource, GpuSourceModel } from '../types';
import {
  sourceModelsDataPath,
  techPowerUpDataPath,
  ulBenchmarksDataPath,
} from '../utils';

export async function getSourceModel(model?: string) {
  if (model == null) {
    // Source model not provided, generate it.
    return await buildSourceModel();
  } else {
    // Source model file provided, use that instead.
    if (!fs.existsSync(model)) {
      throw new Error(`Cannot find source model at ${model}`);
    }

    return await readSourceModel(model);
  }
}

async function buildSourceModel() {
  const techPowerUpSources = await readTechPowerUpSources();
  const ulBenchmarkSources = await readUlBenchmarkSources();
  const videocardBenchmarksSources = await readVideocardBenchmarksSources();

  const map: Record<string, GpuSource> = {};

  techPowerUpSources.forEach((data) => {
    const key = data.name;
    map[key] = map[key] || { name: data.name };
    map[key].company = data.company;
    map[key].techPowerUpUrl = data.url;
  });

  ulBenchmarkSources.forEach((data) => {
    const key = data.name;
    map[key] = map[key] || { name: data.name };
    map[key].company = data.company;
    map[key].timespyScore = data.timespyScore;
    map[key].ulBenchmarksUrl = data.url;
  });

  videocardBenchmarksSources.forEach((data) => {
    const key = data.name;
    map[key] = map[key] || { name: data.name };
    map[key].marketSegment = data.marketSegment;
    map[key].g3dMark = data.g3dMark;
    map[key].g2dMark = data.g2dMark;
    map[key].videocardBenchmarksUrl = data.url;
  });

  const sourceModel: GpuSourceModel = Object.values(map).filter(
    (model) => model.techPowerUpUrl != null && model.ulBenchmarksUrl != null,
  );

  // Save to file with date
  const json = JSON.stringify(sourceModel, undefined, 2);
  await fsPromises.writeFile(
    sourceModelsDataPath(`source-model-${new Date().getTime()}.json`),
    json,
    'utf-8',
  );

  return sourceModel;
}

async function readSourceModel(path: string) {
  const json = await fsPromises.readFile(path, 'utf-8');
  return JSON.parse(json) as GpuSourceModel;
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
    ulBenchmarksDataPath('gpu-sources.json'),
    'utf-8',
  );
  return JSON.parse(json) as VideocardBenchmarksGpuSource[];
}
