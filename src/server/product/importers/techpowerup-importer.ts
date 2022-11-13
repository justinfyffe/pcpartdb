import { ImportProductResults } from '@shared/product';
import { Spec, SpecKey, Specs } from '@shared/spec';
import axios from 'axios';
import * as cheerio from 'cheerio';

const SPECS_MAP: Partial<Record<SpecKey, string>> = {
  architecture: 'Architecture',
  busInterface: 'Bus Interface',
  coreClockSpeedBase: 'Base Clock',
  coreClockSpeedBoost: 'Boost Clock',
  fp32Performance: 'FP32 (float) performance',
  fp64Performance: 'FP64 (double) performance',
  gpuName: 'GPU Name',
  l1Cache: 'L1 Cache',
  l2Cache: 'L2 Cache',
  launchPrice: 'Launch Price',
  length: 'Length',
  memoryBandwidth: 'Bandwidth',
  memoryClock: 'Memory Clock',
  memoryInterface: 'Memory Bus',
  memorySize: 'Memory Size',
  memoryType: 'Memory Type',
  outputs: 'Outputs',
  pixelFillRate: 'Pixel Rate',
  powerConnectors: 'Power Connectors',
  processSize: 'Process Size',
  rayTracingCores: 'RT Cores',
  releaseDate: 'Availability',
  renderOutputUnits: 'ROPs',
  shaderUnitsCudaCores: 'Shading Units',
  slotWidth: 'Slot Width',
  tensorCores: 'Tensor Cores',
  textureFillRate: 'Texture Rate',
  textureMappingUnits: 'TMUs',
  suggestedPsu: 'Suggested PSU',
  thermalDesignPower: 'TDP',
  transistors: 'Transistors',
  width: 'Width',
};

export async function importFromTechPowerUp(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const specs: Specs = {
    architecture: getArchitecture($),
    busInterface: getBusInterface($),
  };

  return { specs } as ImportProductResults;
}

function getArchitecture($: cheerio.CheerioAPI): Spec<string> {
  const values = getSpecValues($, 'architecture');
  return { value: values[0] || null };
}

function getBusInterface($: cheerio.CheerioAPI): Spec<string> {
  const values = getSpecValues($, 'busInterface');
  return { value: values[0] || null };
}

function getSpecValues($: cheerio.CheerioAPI, specKey: SpecKey) {
  const el = $(`dt:contains("${SPECS_MAP[specKey]}")`).siblings('dd').first();
  if (el.has('br')) {
    el.find('br').replaceWith(';;');
  }

  const values = el
    .text()
    .split(';;')
    .map((val) => val.trim());

  return values;
}
