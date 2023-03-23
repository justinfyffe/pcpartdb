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
  videocardBenchmarksDataPath,
} from '../utils';

export async function getSourceModel(model?: string) {
  if (model == null) {
    // Source model not provided, generate it.
    console.log('Source Model not provided. Building it based on saved data.');
    return await buildSourceModel();
  } else {
    // Source model file provided, use that instead.
    if (!fs.existsSync(model)) {
      throw new Error(`Cannot find source model at ${model}`);
    }

    console.log(`Reading Source Model from ${model}`);
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
      releaseDate: orig.releaseDate || data.releaseDate,
      company: orig.company || data.company,
    };
  });

  // We only want GPUs with most data and g3d mark
  const sourceModel: GpuSourceModel = Object.values(map).filter(
    (model) =>
      model.techPowerUpUrl != null && model.videocardBenchmarksUrl != null,
  );
  sourceModel.sort((m1, m2) => m2.releaseDate - m1.releaseDate); // Descending

  // Save to file with date
  const path = sourceModelsDataPath(
    `source-model-${new Date().getTime()}.json`,
  );
  console.log(`Finished building Source Model. Saving to ${path}`);
  const json = JSON.stringify(sourceModel, undefined, 2);
  await fsPromises.writeFile(path, json, 'utf-8');

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
    videocardBenchmarksDataPath('gpu-sources.json'),
    'utf-8',
  );
  return JSON.parse(json) as VideocardBenchmarksGpuSource[];
}
