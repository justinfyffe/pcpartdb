import {
  TechPowerUpGpuSource,
  UlBenchmarkGpuSource,
  VideocardBenchmarksGpuSource,
} from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { yyyyMmDd } from '../../shared/date';
import { GpuSource, GpuSourceModel } from './types';
import {
  passMarkPath,
  sourceModelsPath,
  techPowerUpPath,
  ulBenchmarksPath,
} from './utils';

export async function buildSourceModel() {
  const techPowerUpSources = await readTechPowerUpSources();
  const ulBenchmarkSources = await readUlBenchmarkSources();
  const videocardBenchmarksSources = await readPassMarkSources();

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
  const path = sourceModelsPath('source-model.json');
  const timestampPath = sourceModelsPath(`source-model-${yyyyMmDd()}.json`);

  const json = JSON.stringify(sourceModel, undefined, 2);
  await fsPromises.writeFile(path, json, 'utf-8');
  await fsPromises.writeFile(timestampPath, json, 'utf-8');

  console.log(`Finished building Source Model. Saved to ${timestampPath}`);

  return sourceModel;
}

async function readTechPowerUpSources() {
  const json = await fsPromises.readFile(
    techPowerUpPath('sources.json'),
    'utf-8',
  );
  return JSON.parse(json) as TechPowerUpGpuSource[];
}

async function readUlBenchmarkSources() {
  const json = await fsPromises.readFile(
    ulBenchmarksPath('sources.json'),
    'utf-8',
  );
  return JSON.parse(json) as UlBenchmarkGpuSource[];
}

async function readPassMarkSources() {
  const json = await fsPromises.readFile(passMarkPath('sources.json'), 'utf-8');
  return JSON.parse(json) as VideocardBenchmarksGpuSource[];
}
