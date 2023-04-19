import { VideocardBenchmarksGpuSource } from '@pcpartdb/scraper';
import { MarketSegmentValue } from '@pcpartdb/shared';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { videocardBenchmarksDataPath } from './utils';

interface RawGpuSource {
  id: string;
  name: string;
  price: string;
  g3d: string;
  g2d: string;
  value: string;
  tdp: string;
  powerPerf: string;
  cat: string;
  bus: string;
  memSize: string;
  coreClk: string;
  rank: number;
  samples: string;
  href: string;
  output: boolean;
  date: string;
}

const URL = 'https://www.videocardbenchmark.net/gpu.php?gpu={name}&id={id}';

export async function sanitizeVideocardBenchmarksGpuSources() {
  const inputFile = videocardBenchmarksDataPath('raw-gpu-sources.json');
  const outputFile = videocardBenchmarksDataPath('gpu-sources.json');
  const timestampFile = videocardBenchmarksDataPath(
    `gpu-sources-${new Date().getTime()}.json`,
  );

  console.log(`Sanitizing Videocard Benchmarks sources from ${inputFile}`);

  if (!fs.existsSync(inputFile)) {
    throw new Error(
      'Missing Input File. Try downloading the data from https://www.videocardbenchmark.net/GPU_mega_page.html',
    );
  }

  const jsonString = await fsPromises.readFile(inputFile, 'utf-8');
  const rawGpus: RawGpuSource[] = JSON.parse(jsonString).data;
  console.log(`Sanitizing ${rawGpus.length}`);

  const gpus = rawGpus.map(sanitize).filter((gpu) => gpu != null);
  console.log(
    `Sanitized ${gpus.length}. Threw out ${rawGpus.length - gpus.length}`,
  );

  console.log(
    `Finished sanitizing. Saving to ${outputFile} and ${timestampFile}`,
  );
  await fsPromises.writeFile(
    outputFile,
    JSON.stringify(gpus, undefined, 2),
    'utf-8',
  );
  await fsPromises.writeFile(
    timestampFile,
    JSON.stringify(gpus, undefined, 2),
    'utf-8',
  );

  return gpus;
}

function sanitize(gpu: RawGpuSource): VideocardBenchmarksGpuSource {
  const { name, company } = parseRawName(gpu.name);
  const marketSegment = getMarketSegment(gpu);
  const g3dMark = getG3dMark(gpu);
  const g2dMark = getG2dMark(gpu);
  const url = getUrl(gpu);

  if (g3dMark == null || url == null) {
    return null;
  }

  return { name, company, url, marketSegment, g3dMark, g2dMark };
}

function parseRawName(rawName: string) {
  const [companyPart, ...nameParts] = rawName.split(' ');

  let name = null;
  let company = null;
  const companyLc = companyPart.toLowerCase();
  if (companyLc === 'amd' || companyLc === 'nvidia' || companyLc === 'intel') {
    name = nameParts.join(' ');
    company = companyPart;
  } else {
    name = [companyPart, ...nameParts].join(' ');
  }

  return { company, name };
}

function getUrl(gpu: RawGpuSource) {
  return URL.replace('{name}', gpu.name.replaceAll(' ', '+')).replace(
    '{id}',
    gpu.id,
  );
}

function getMarketSegment(gpu: RawGpuSource) {
  const category = gpu.cat.split(', ');
  if (category.length === 0) {
    return null;
  }

  switch (category[0]) {
    case 'Desktop':
      return MarketSegmentValue.Desktop;
    case 'Mobile':
      return MarketSegmentValue.Mobile;
    case 'Workstation':
      return MarketSegmentValue.Workstation;
    default:
      return null;
  }
}

function getG3dMark(gpu: RawGpuSource) {
  const cleanG3d = gpu.g3d.replace(',', '');
  const value = Number(cleanG3d);

  return Number.isNaN(value) ? null : value;
}

function getG2dMark(gpu: RawGpuSource) {
  const cleanG2d = gpu.g2d.replace(',', '');
  const value = Number(cleanG2d);

  return Number.isNaN(value) ? null : value;
}
