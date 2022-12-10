import { ImportProductResults } from '@shared/product';
import { Spec, SpecKey, Specs } from '@shared/spec';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { format, parse } from 'date-fns';

// TODO: swap - label -> key
const SPECS_MAP: Partial<Record<SpecKey, string>> = {
  architecture: 'Architecture',
  busInterface: 'Bus Interface',
  coreClockSpeedBase: 'Base Clock',
  coreClockSpeedBoost: 'Boost Clock',
  directXVersion: 'DirectX',
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
  openClVersion: 'OpenCL',
  openGlVersion: 'OpenGL',
  outputs: 'Outputs',
  pixelFillRate: 'Pixel Rate',
  powerConnectors: 'Power Connectors',
  processSize: 'Process Size',
  rayTracingCores: 'RT Cores',
  releaseDate: 'Availability', // Can also be Release Date
  renderOutputUnits: 'ROPs',
  shaderModelVersion: 'Shader Model',
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
    company: getCompanyValue($, 'company'),
    coreClockSpeedBase: getNumberValue($, 'coreClockSpeedBase'),
    coreClockSpeedBoost: getNumberValue($, 'coreClockSpeedBoost'),
    directXVersion: getStringValue($, 'directXVersion'),
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
    openClVersion: getNumberValue($, 'openClVersion'),
    openGlVersion: getNumberValue($, 'openGlVersion'),
    outputs: getStringValue($, 'outputs'),
    pixelFillRate: getNumberValue($, 'pixelFillRate'),
    powerConnectors: getStringValue($, 'powerConnectors'),
    processSize: getNumberValue($, 'processSize'),
    rayTracingCores: getNumberValue($, 'rayTracingCores'),
    releaseDate: getDateValue($, 'releaseDate'),
    renderOutputUnits: getNumberValue($, 'renderOutputUnits'),
    shaderModelVersion: getNumberValue($, 'shaderModelVersion'),
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

  return { name: getName($), specs } as ImportProductResults;
}

function getName($: cheerio.CheerioAPI) {
  const fullName = $('.gpudb-name').text();
  const [_company, ...name] = fullName.split(' ');
  return name.join(' ');
}

function getDateValue($: cheerio.CheerioAPI, specKey: SpecKey): Spec<string> {
  const values = getSpecValues($, specKey);
  try {
    const value = format(
      parse(values[0], 'MMM do, yyyy', new Date()),
      'yyyy-MM-dd',
    );

    return { value, metadata: { specKey } };
  } catch (e) {
    return { value: null, metadata: { specKey } };
  }
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
  const stringValue = getStringValue($, specKey)?.value;

  let value = null;
  if (stringValue === 'Quad-slot') {
    value = 4;
  } else if (stringValue === 'Triple-slot') {
    value = 3;
  } else if (stringValue === 'Dual-slot') {
    value = 2;
  } else if (stringValue === 'Single-slot') {
    value = 1;
  }

  return { value, metadata: { specKey } };
}

function getCompanyValue(
  $: cheerio.CheerioAPI,
  specKey: SpecKey,
): Spec<string> {
  const fullName = $('.gpudb-name').text();
  const [company] = fullName.split(' ');
  if (company === 'NVIDIA' || company === 'AMD') {
    return { value: company, metadata: { specKey } };
  }

  return { value: null, metadata: { specKey } };
}

function getStringValue($: cheerio.CheerioAPI, specKey: SpecKey): Spec<string> {
  const values = getSpecValues($, specKey);
  const value = values.join(', ');
  return { value: value || null, metadata: { specKey } };
}

function getNumberValue($: cheerio.CheerioAPI, specKey: SpecKey): Spec<number> {
  const values = getSpecValues($, specKey);
  const value = values[0];
  const [base, suffix] = parseNumberValue(value || null);

  return {
    value: base,
    metadata: { specKey, suffix },
  };
}

function getSpecValues($: cheerio.CheerioAPI, specKey: SpecKey) {
  const el = $('dt')
    .filter((_i, dt) => $(dt).text().trim() === SPECS_MAP[specKey])
    .siblings('dd')
    .first();

  if (el.has('br')) {
    el.find('br').replaceWith(';;');
  }

  const values = el
    .text()
    .split(';;')
    .map((val) => val.trim());

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
