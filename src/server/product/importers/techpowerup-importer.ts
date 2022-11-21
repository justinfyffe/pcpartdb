import { ImportProductResults } from '@shared/product';
import { Spec, SpecKey, Specs } from '@shared/spec';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { format, parse } from 'date-fns';

const SPECS_MAP: Partial<Record<SpecKey, string>> = {
  architecture: 'Architecture',
  busInterface: 'Bus Interface',
  coreClockSpeedBase: 'Base Clock',
  coreClockSpeedBoost: 'Boost Clock',
  fp32Performance: 'FP32 (float) performance',
  fp64Performance: 'FP64 (double) performance',
  gpuName: 'GPU Name',
  height: 'Height',
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
  suggestedPsu: 'Suggested PSU',
  tensorCores: 'Tensor Cores',
  textureFillRate: 'Texture Rate',
  textureMappingUnits: 'TMUs',
  thermalDesignPower: 'TDP',
  transistors: 'Transistors',
  width: 'Width',
};

export async function importFromTechPowerUp(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // TODO: handle slot width and API
  const specs: Specs = {
    architecture: getStringValue($, 'architecture'),
    busInterface: getStringValue($, 'busInterface'),
    coreClockSpeedBase: getNumberValue($, 'coreClockSpeedBase'),
    coreClockSpeedBoost: getNumberValue($, 'coreClockSpeedBoost'),
    fp32Performance: getNumberValue($, 'fp32Performance'),
    fp64Performance: getNumberValue($, 'fp64Performance'),
    gpuName: getStringValue($, 'gpuName'),
    height: getNumberValue($, 'height'),
    l1Cache: getNumberValue($, 'l1Cache'),
    l2Cache: getNumberValue($, 'l2Cache'),
    launchPrice: getDollarValue($, 'launchPrice'),
    length: getNumberValue($, 'length'),
    memoryBandwidth: getNumberValue($, 'memoryBandwidth'),
    memoryClock: getNumberValue($, 'memoryClock'),
    memoryInterface: getNumberValue($, 'memoryInterface'),
    memorySize: getNumberValue($, 'memorySize'),
    memoryType: getStringValue($, 'memoryType'),
    outputs: getStringValue($, 'outputs'),
    pixelFillRate: getNumberValue($, 'pixelFillRate'),
    powerConnectors: getStringValue($, 'powerConnectors'),
    processSize: getNumberValue($, 'processSize'),
    rayTracingCores: getNumberValue($, 'rayTracingCores'),
    releaseDate: getDateValue($, 'releaseDate'),
    renderOutputUnits: getNumberValue($, 'renderOutputUnits'),
    shaderUnitsCudaCores: getNumberValue($, 'shaderUnitsCudaCores'),
    slotWidth: getSlotWidthValue($, 'slotWidth'),
    suggestedPsu: getNumberValue($, 'suggestedPsu'),
    tensorCores: getNumberValue($, 'tensorCores'),
    textureFillRate: getNumberValue($, 'textureFillRate'),
    textureMappingUnits: getNumberValue($, 'textureMappingUnits'),
    thermalDesignPower: getNumberValue($, 'thermalDesignPower'),
    transistors: getNumberValue($, 'transistors'),
    width: getNumberValue($, 'width'),
  };

  return { specs } as ImportProductResults;
}

function getDateValue($: cheerio.CheerioAPI, specKey: SpecKey): Spec<string> {
  const rawValue = getSpecValues($, specKey);
  const value = format(
    parse(rawValue, 'MMM do, yyyy', new Date()),
    'yyyy-MM-dd',
  );

  return { value, metadata: { specKey } };
}

function getDollarValue($: cheerio.CheerioAPI, specKey: SpecKey): Spec<number> {
  const numberValue = getNumberValue($, specKey);
  const prefix = numberValue.metadata?.suffix === 'USD' ? '$' : null;

  return {
    value: numberValue.value,
    metadata: { specKey, prefix },
  };
}

function getSlotWidthValue(
  $: cheerio.CheerioAPI,
  specKey: SpecKey,
): Spec<number> {
  return { value: null, metadata: { specKey } };
}

function getStringValue($: cheerio.CheerioAPI, specKey: SpecKey): Spec<string> {
  const value = getSpecValues($, specKey);
  return { value: value || null, metadata: { specKey } };
}

function getNumberValue($: cheerio.CheerioAPI, specKey: SpecKey): Spec<number> {
  const value = getSpecValues($, specKey);
  const [base, suffix] = parseNumberValue(value || null);

  return {
    value: base,
    metadata: { specKey, suffix },
  };
}

function getSpecValues($: cheerio.CheerioAPI, specKey: SpecKey) {
  const el = $(`dt:contains("${SPECS_MAP[specKey]}")`).siblings('dd').first();
  if (el.has('br')) {
    el.find('br').replaceWith(';;');
  }

  const values = el
    .text()
    .split(';;')
    .map((val) => val.trim())
    .join(', ');

  return values;
}

function parseNumberValue(value: string): [number, string] {
  if (value == null) {
    return [null, null];
  }

  const [base, suffix] = value.split(' ');
  const sanitizedBase = Number(base.replace(',', ''));
  return [sanitizedBase, suffix || null];
}
