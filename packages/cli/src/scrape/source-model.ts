import {
  TechPowerUpGpuSource,
  UlBenchmarkGpuSource,
  VideocardBenchmarksGpuSource,
} from '@pcpartdb/scraper';
import * as fpPromises from 'fs/promises';
import { join } from 'path';
import { GpuSourceModel } from './types';

const SOURCE_MODEL_PATH = join(__dirname, '../../data/scraper/source-models');

export async function buildSourceModel(
  techpowerUpUrlData: TechPowerUpGpuSource[],
  ulBenchmarkUrlData: UlBenchmarkGpuSource[],
  videocardBenchmarksUrlData: VideocardBenchmarksGpuSource[],
) {
  const map: Record<string, GpuSourceModel> = {};

  techpowerUpUrlData.forEach((data) => {
    const key = data.name;
    map[key] = map[key] || { name: data.name };
    map[key].company = data.company;
    map[key].techpowerupUrl = data.url;
  });

  ulBenchmarkUrlData.forEach((data) => {
    const key = data.name;
    map[key] = map[key] || { name: data.name };
    map[key].company = data.company;
    map[key].timespyScore = data.timespyScore;
    map[key].ulBenchmarksUrl = data.url;
  });

  videocardBenchmarksUrlData.forEach((data) => {
    const key = data.name;
    map[key] = map[key] || { name: data.name };
    map[key].marketSegment = data.marketSegment;
    map[key].g3dMark = data.g3dMark;
    map[key].g2dMark = data.g2dMark;
    map[key].videocardBenchmarksUrl = data.url;
  });

  const sourceModel = Object.values(map).filter(
    (model) => model.techpowerupUrl != null && model.ulBenchmarksUrl != null,
  );

  // Save to file with date
  const json = JSON.stringify(sourceModel, undefined, 2);
  await fpPromises.writeFile(
    join(SOURCE_MODEL_PATH, `source-model-${new Date().getTime()}.json`),
    json,
    'utf-8',
  );
  await fpPromises.writeFile(
    join(SOURCE_MODEL_PATH, 'source-model.json'),
    json,
    'utf-8',
  );

  return sourceModel;
}

export async function readSourceModel() {
  const json = await fpPromises.readFile(
    join(SOURCE_MODEL_PATH, 'source-model.json'),
    'utf-8',
  );

  return JSON.parse(json) as GpuSourceModel[];
}
