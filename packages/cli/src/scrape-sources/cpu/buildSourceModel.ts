import {
  GeekBenchCpuSource,
  PassMarkCpuSource,
  TechPowerUpCpuSource,
} from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { yyyyMmDd } from '../../shared/date';
import { CpuSource, CpuSourceModel } from './types';
import {
  geekBenchPath,
  passMarkPath,
  sourceModelsPath,
  techPowerUpPath,
} from './utils';

export async function buildSourceModel() {
  const techPowerUpSources = await readTechPowerUpSources();
  const geekBenchSources = await readGeekBenchSources();
  const passMarkSources = await readPassMarkSources();

  const map: Record<string, CpuSource> = {};

  techPowerUpSources.forEach((data) => {
    const key = data.name;
    const orig = map[key] || {};
    map[key] = {
      ...orig,
      name: orig.name || data.name,
      company: orig.company || data.company,
      techPowerUpUrl: orig.techPowerUpUrl || data.url,
    };
  });

  geekBenchSources.forEach((data) => {
    const key = data.name;
    const orig = map[key] || {};
    map[key] = {
      ...orig,
      name: orig.name || data.name,
      company: orig.company || data.company,
      geekBenchSingleCore: orig.geekBenchSingleCore || data.geekBenchSingleCore,
      geekBenchMultiCore: orig.geekBenchMultiCore || data.geekBenchMultiCore,
      geekBenchUrl: orig.geekBenchUrl || data.url,
    };
  });

  passMarkSources.forEach((data) => {
    const key = data.name;
    const orig = map[key] || {};
    map[key] = {
      ...orig,
      name: orig.name || data.name,
      company: orig.company || data.company,
      cpuMarkMultiThread: orig.cpuMarkMultiThread || data.cpuMarkMultiThread,
      passMarkUrl: orig.passMarkUrl || data.url,
    };
  });

  // We only want CPUs with most data
  const sources: CpuSource[] = Object.values(map).filter(
    (model) => model.techPowerUpUrl != null,
  );
  sources.sort((s1, s2) => {
    if (s1.cpuMarkMultiThread != null || s2.cpuMarkMultiThread != null) {
      return (s2.cpuMarkMultiThread ?? 0) - (s1.cpuMarkMultiThread ?? 0);
    }

    return s1.name.localeCompare(s2.name);
  }); // cpu mark descending, then name ascending.

  const sourceModel: CpuSourceModel = {
    name: `CPU Source Model - ${yyyyMmDd()}`,
    date: new Date().getTime(),
    sources,
  };

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
  return JSON.parse(json) as TechPowerUpCpuSource[];
}

async function readGeekBenchSources() {
  const json = await fsPromises.readFile(
    geekBenchPath('sources.json'),
    'utf-8',
  );
  return JSON.parse(json) as GeekBenchCpuSource[];
}

async function readPassMarkSources() {
  const json = await fsPromises.readFile(passMarkPath('sources.json'), 'utf-8');
  return JSON.parse(json) as PassMarkCpuSource[];
}
