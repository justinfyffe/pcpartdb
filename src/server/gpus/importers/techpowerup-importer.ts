import {
  GpuSpec,
  GpuSpecs,
  GpuSpecUnit,
  ImportGpuDataResponse,
} from '@shared/gpus';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { format, parse } from 'date-fns';

// Example: https://www.techpowerup.com/gpu-specs/geforce-rtx-3090.c3622
export async function importFromTechPowerUp(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Get Spec Values
  const specs: GpuSpecs = {
    architecture: getStringValue($, 'Architecture'),
    busInterface: getStringValue($, 'Bus Interface'),
    company: getCompanyValue($),
    coreClockSpeedBase: getNumberValue($, 'Base Clock'),
    coreClockSpeedBoost: getNumberValue($, 'Boost Clock'),
    directxVersion: getStringValue($, 'DirectX'),
    fp32Performance: getNumberValue($, 'FP32 (float) performance'),
    fp64Performance: getNumberValue($, 'FP64 (double) performance'),
    gpuCodename: getStringValue($, 'GPU Name'),
    height: getNumberValue($, 'Height'),
    l1Cache: getNumberValue($, 'L1 Cache'),
    l2Cache: getNumberValue($, 'L2 Cache'),
    launchPrice: getNumberValue($, 'Launch Price'),
    length: getNumberValue($, 'Length'),
    memoryBandwidth: getNumberValue($, 'Bandwidth'),
    memoryClock: getNumberValue($, 'Memory Clock'),
    memoryInterface: getNumberValue($, 'Memory Bus'),
    memorySize: getNumberValue($, 'Memory Size'),
    memoryType: getStringValue($, 'Memory Type'),
    openClVersion: getNumberValue($, 'OpenCL'),
    openGlVersion: getNumberValue($, 'OpenGL'),
    outputs: getStringValue($, 'Outputs'),
    pixelFillRate: getNumberValue($, 'Pixel Rate'),
    powerConnectors: getStringValue($, 'Power Connectors'),
    processSize: getNumberValue($, 'Process Size'),
    rayTracingCores: getNumberValue($, 'RT Cores'),
    releaseDate:
      getDateValue($, 'Availability') || getDateValue($, 'Release Date'),
    renderOutputUnits: getNumberValue($, 'ROPs'),
    shaderModelVersion: getNumberValue($, 'Shader Model'),
    shaderUnitsCudaCores: getNumberValue($, 'Shading Units'),
    slotWidth: getSlotWidthValue($, 'Slot Width'),
    suggestedPsu: getNumberValue($, 'Suggested PSU'),
    tensorCores: getNumberValue($, 'Tensor Cores'),
    textureFillRate: getNumberValue($, 'Texture Rate'),
    textureMappingUnits: getNumberValue($, 'TMUs'),
    thermalDesignPower: getNumberValue($, 'TDP'),
    transistors: getNumberValue($, 'Transistors'),
    width: getNumberValue($, 'Width'),
  };

  // Add Spec Key
  Object.keys(specs).forEach((specKey) => {
    const spec = specs[specKey] as GpuSpec;
    if (spec == null) {
      return;
    }

    if (spec.meta == null) {
      spec.meta = {};
    }
    spec.meta = { ...spec?.meta, specKey };
  });

  return { gpu: { name: getName($), specs } } as ImportGpuDataResponse;
}

function getName($: cheerio.CheerioAPI) {
  const fullName = $('.gpudb-name').text();
  const [_company, ...name] = fullName.split(' ');
  return name.join(' ');
}

function getDateValue($: cheerio.CheerioAPI, label: string): GpuSpec<string> {
  const values = getSpecValues($, label);
  try {
    const value = format(
      parse(values[0], 'MMM do, yyyy', new Date()),
      'yyyy-MM-dd',
    );

    return { value };
  } catch (e) {
    return null;
  }
}

function getSlotWidthValue(
  $: cheerio.CheerioAPI,
  label: string,
): GpuSpec<number> {
  const stringValue = getStringValue($, label)?.value;

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

  return { value };
}

function getCompanyValue($: cheerio.CheerioAPI): GpuSpec<string> {
  const fullName = $('.gpudb-name').text();
  const [company] = fullName.split(' ');
  const lcCompany = company.toLowerCase();
  if (lcCompany === 'nvidia' || lcCompany === 'amd' || lcCompany === 'intel') {
    return { value: company };
  }

  return null;
}

function getStringValue($: cheerio.CheerioAPI, label: string): GpuSpec<string> {
  const values = getSpecValues($, label);
  const value = values.join(', ');
  return { value: value || null };
}

function getNumberValue($: cheerio.CheerioAPI, label: string): GpuSpec<number> {
  const values = getSpecValues($, label);
  const value = values[0];
  // TODO: set correct base value
  const [base, displayUnit] = parseNumberValue(value || null);

  return {
    value: base,
    meta: { displayUnit: displayUnit as GpuSpecUnit },
  };
}

function getSpecValues($: cheerio.CheerioAPI, label: string) {
  const el = $('dt')
    .filter((_i, dt) => $(dt).text().trim() === label)
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

  const [base, unit] = value.split(' ');
  const sanitizedBase = Number(base.replace(',', ''));
  return [sanitizedBase, unit || null];
}
