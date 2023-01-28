import { ImportPartDataResponse } from '@shared/part';
import { Spec, Specs } from '@shared/spec';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { format, parse } from 'date-fns';
import { sleep } from 'scrapers/utils';

const GPU_URL = 'https://www.techpowerup.com/gpu-specs/geforce-rtx-3090.c{id}';

export async function importBulk() {
  for (let i = 0; i < 5; ++i) {
    console.log(i);
    console.log(GPU_URL.replace('{id}', String(1 + i)));
    const results = await importFromTechPowerUp(
      GPU_URL.replace('{id}', String(15 + i)),
    );
    console.log(results);

    await sleep(5_000);
  }
}

// Example: https://www.techpowerup.com/gpu-specs/geforce-rtx-3090.c3622
export async function importFromTechPowerUp(url: string) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent':
        'Windows 10/ Edge browser: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
    },
  });
  const $ = cheerio.load(response.data);

  // Get Spec Values
  const specs: Specs = {
    architecture: getStringValue($, 'Architecture'),
    busInterface: getStringValue($, 'Bus Interface'),
    company: getCompanyValue($),
    coreClockSpeedBase: getNumberValue($, 'Base Clock'),
    coreClockSpeedBoost: getNumberValue($, 'Boost Clock'),
    directXVersion: getStringValue($, 'DirectX'),
    fp32Performance: getNumberValue($, 'FP32 (float) performance'),
    fp64Performance: getNumberValue($, 'FP64 (double) performance'),
    gpuName: getStringValue($, 'GPU Name'),
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
    if (specs[specKey] == null) {
      return;
    }

    if (specs[specKey].metadata == null) {
      specs[specKey].metadata = {};
    }
    specs[specKey].metadata = { ...specs[specKey]?.metadata, specKey };
  });

  return { part: { name: getName($), specs } } as ImportPartDataResponse;
}

function getName($: cheerio.CheerioAPI) {
  const fullName = $('.gpudb-name').text();
  const [_company, ...name] = fullName.split(' ');
  return name.join(' ');
}

function getDateValue($: cheerio.CheerioAPI, label: string): Spec<string> {
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

function getSlotWidthValue($: cheerio.CheerioAPI, label: string): Spec<number> {
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

function getCompanyValue($: cheerio.CheerioAPI): Spec<string> {
  const fullName = $('.gpudb-name').text();
  const [company] = fullName.split(' ');
  const lcCompany = company.toLowerCase();
  if (lcCompany === 'nvidia' || lcCompany === 'amd' || lcCompany === 'intel') {
    return { value: company };
  }

  return null;
}

function getStringValue($: cheerio.CheerioAPI, label: string): Spec<string> {
  const values = getSpecValues($, label);
  const value = values.join(', ');
  return { value: value || null };
}

function getNumberValue($: cheerio.CheerioAPI, label: string): Spec<number> {
  const values = getSpecValues($, label);
  const value = values[0];
  const [base, unit] = parseNumberValue(value || null);

  return {
    value: base,
    metadata: { unit },
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
