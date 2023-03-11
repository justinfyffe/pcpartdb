import { MarketSegmentValue } from '@pcpartdb/shared';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

interface RawGpu {
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
}

export interface VideocardBenchmarksUrlData {
  name: string;
  marketSegment: MarketSegmentValue;
  g3dMark: number;
  g2dMark: number;
  url: string;
}

export async function sanitizeVideocardBenchmarksRawGpus(
  inputFile: string,
  outputFile: string,
) {
  if (!fs.existsSync(inputFile)) {
    throw new Error(
      'Missing Input File. Try downloading the data from https://www.videocardbenchmark.net/GPU_mega_page.html',
    );
  }

  const jsonString = await fsPromises.readFile(inputFile, 'utf-8');
  const rawGpus: RawGpu[] = JSON.parse(jsonString);

  const gpus = rawGpus.map(sanitize).filter((gpu) => gpu != null);

  await fsPromises.writeFile(
    outputFile,
    JSON.stringify(gpus, undefined, 2),
    'utf-8',
  );

  return gpus;
}

function sanitize(gpu: RawGpu): VideocardBenchmarksUrlData {
  const name = gpu.name;
  const marketSegment = getMarketSegment(gpu);
  const g3dMark = getG3dMark(gpu);
  const g2dMark = getG2dMark(gpu);
  const url = getUrl(gpu);

  if (
    marketSegment == null ||
    g3dMark == null ||
    g2dMark == null ||
    url == null
  ) {
    return null;
  }

  return { name, url, marketSegment, g3dMark, g2dMark };
}

function getUrl(gpu: RawGpu) {
  const url = 'https://www.videocardbenchmark.net/gpu.php?gpu={name}&id={id}';

  return url
    .replace('{name}', gpu.name.replace(' ', '+'))
    .replace('{id}', gpu.id);
}

function getMarketSegment(gpu: RawGpu) {
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

function getG3dMark(gpu: RawGpu) {
  const cleanG3d = gpu.g3d.replace(',', '');
  const value = Number(cleanG3d);

  return Number.isNaN(value) ? null : value;
}

function getG2dMark(gpu: RawGpu) {
  const cleanG2d = gpu.g2d.replace(',', '');
  const value = Number(cleanG2d);

  return Number.isNaN(value) ? null : value;
}
