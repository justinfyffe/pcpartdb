import {
  BandwidthUnit,
  BitUnit,
  calculateBaseGpuSpecValue,
  ClockSpeedUnit,
  FlopsUnit,
  GpuSpec,
  GpuSpecs,
  ImportGpuDataResponse,
  LengthUnit,
  MemoryUnit,
  NumericUnit,
  PixelFillRateUnit,
  TextureFillRateUnit,
  WattageUnit,
} from '@shared/gpus';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { format, parse } from 'date-fns';

// Example: https://www.techpowerup.com/gpu-specs/geforce-rtx-3090.c3622
export async function importFromTechPowerUp(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const name = getName($);

  // Get Spec Values
  const specs: GpuSpecs = {
    architecture: getArchitecture($),
    busInterface: getBusInterface($),
    codename: getCodename($),
    company: getCompany($),
    coreClockSpeedBase: getCoreClockSpeedBase($),
    coreClockSpeedBoost: getCoreClockSpeedBoost($),
    directxVersion: getDirectxVersion($),
    fp32Performance: getFp32Performance($),
    fp64Performance: getFp64Performance($),
    height: getHeight($),
    l1Cache: getL1Cache($),
    l2Cache: getL2Cache($),
    launchPrice: getLaunchPrice($),
    length: getLength($),
    memoryBandwidth: getMemoryBandwidth($),
    memoryClock: getMemoryClock($),
    memoryInterface: getMemoryInterface($),
    memorySize: getMemorySize($),
    memoryType: getMemoryType($),
    openClVersion: getOpenClVersion($),
    openGlVersion: getOpenGlVersion($),
    outputs: getOutputs($),
    pixelFillRate: getPixelFillRate($),
    powerConnectors: getPowerConnectors($),
    processSize: getProcessSize($),
    rayTracingCores: getRayTracingCores($),
    releaseDate: getReleaseDate($),
    renderOutputUnits: getRenderOutputUnits($),
    shaderModelVersion: getShaderModelVersion($),
    shaderUnitsCudaCores: getShaderUnitsCudaCores($),
    slotWidth: getSlotWidth($),
    suggestedPsu: getSuggestedPsu($),
    tensorCores: getTensorCores($),
    textureFillRate: getTextureFillRate($),
    textureMappingUnits: getTextureMappingUnits($),
    thermalDesignPower: getThermalDesignPower($),
    transistors: getTransistors($),
    width: getWidth($),
  };

  return { gpu: { name, specs } } as ImportGpuDataResponse;
}

function getName($: cheerio.CheerioAPI) {
  const fullName = $('.gpudb-name').text();
  const [_company, ...name] = fullName.split(' ');
  return name.join(' ');
}

function getArchitecture($: cheerio.CheerioAPI): GpuSpec<string> {
  const values = tokenizeSpecValues($, 'Architecture');
  const value = values.join(', ');
  return { value: value || null, meta: { specKey: 'architecture' } };
}

function getBusInterface($: cheerio.CheerioAPI): GpuSpec<string> {
  const values = tokenizeSpecValues($, 'Bus Interface');
  const value = values.join(', ');
  return { value: value || null, meta: { specKey: 'busInterface' } };
}

function getCodename($: cheerio.CheerioAPI): GpuSpec<string> {
  const values = tokenizeSpecValues($, 'GPU Name');
  const value = values.join(', ');
  return { value: value || null, meta: { specKey: 'codename' } };
}

function getCompany($: cheerio.CheerioAPI): GpuSpec<string> {
  const fullName = $('.gpudb-name').text();
  const [company] = fullName.split(' ');
  const lcCompany = company.toLowerCase();
  if (lcCompany === 'nvidia' || lcCompany === 'amd' || lcCompany === 'intel') {
    return { value: company, meta: { specKey: 'company' } };
  }

  return null;
}

function getCoreClockSpeedBase($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Base Clock');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'coreClockSpeedBase' } };
}

function getCoreClockSpeedBoost($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Boost Clock');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'coreClockSpeedBoost' } };
}

function getDirectxVersion($: cheerio.CheerioAPI): GpuSpec<string> {
  const values = tokenizeSpecValues($, 'DirectX');
  const value = values.join(', ');
  return { value: value || null, meta: { specKey: 'directxVersion' } };
}

function getFp32Performance($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'FP32 (float) performance');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, FlopsUnit> = {
    GFLOPS: FlopsUnit.gflops,
    TFLOPS: FlopsUnit.tflops,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'fp32Performance' } };
}

function getFp64Performance($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'FP64 (double) performance');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, FlopsUnit> = {
    GFLOPS: FlopsUnit.gflops,
    TFLOPS: FlopsUnit.tflops,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'fp64Performance' } };
}

function getHeight($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Height');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'height' } };
}

function getL1Cache($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'L1 Cache');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemoryUnit> = {
    KB: MemoryUnit.kb,
    MB: MemoryUnit.mb,
    GB: MemoryUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'l1Cache' } };
}

function getL2Cache($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'L2 Cache');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemoryUnit> = {
    KB: MemoryUnit.kb,
    MB: MemoryUnit.mb,
    GB: MemoryUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'l2Cache' } };
}

function getLaunchPrice($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Launch Price');
  const [displayValue, displayCurrency] = parseNumberValue(values[0] || null);

  const formats: Record<string, string> = {
    USD: 'usd',
  };

  const currency = formats[displayCurrency] || null;
  const baseValue = displayValue;
  return { value: baseValue, meta: { currency, specKey: 'launchPrice' } };
}

function getLength($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Length');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'length' } };
}

function getMemoryBandwidth($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Bandwidth');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, BandwidthUnit> = {
    'KB/s': BandwidthUnit.kbps,
    'MB/s': BandwidthUnit.mbps,
    'GB/s': BandwidthUnit.gbps,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'memoryBandwidth' } };
}

function getMemoryClock($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Memory Clock');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'memoryClock' } };
}

function getMemoryInterface($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Memory Bus');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, BitUnit> = {
    bit: BitUnit.bit,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'memoryInterface' } };
}

function getMemorySize($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Memory Size');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemoryUnit> = {
    KB: MemoryUnit.kb,
    MB: MemoryUnit.mb,
    GB: MemoryUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'memorySize' } };
}

function getMemoryType($: cheerio.CheerioAPI): GpuSpec<string> {
  const values = tokenizeSpecValues($, 'Memory Type');
  const value = values.join(', ');
  return { value: value || null, meta: { specKey: 'memoryType' } };
}

function getOpenClVersion($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'OpenCL');
  const [displayValue] = parseNumberValue(values[0] || null);
  const baseValue = displayValue;
  return { value: baseValue, meta: { specKey: 'openClVersion' } };
}

function getOpenGlVersion($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'OpenGL');
  const [displayValue] = parseNumberValue(values[0] || null);
  const baseValue = displayValue;
  return { value: baseValue, meta: { specKey: 'openGlVersion' } };
}

function getOutputs($: cheerio.CheerioAPI): GpuSpec<string> {
  const values = tokenizeSpecValues($, 'Outputs');
  const value = values.join(', ');
  return { value: value || null, meta: { specKey: 'outputs' } };
}

function getPixelFillRate($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Pixel Rate');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, PixelFillRateUnit> = {
    'GPixel/s': PixelFillRateUnit.gpixelps,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'pixelFillRate' } };
}

function getPowerConnectors($: cheerio.CheerioAPI): GpuSpec<string> {
  const values = tokenizeSpecValues($, 'Power Connectors');
  const value = values.join(', ');
  return { value: value || null, meta: { specKey: 'powerConnectors' } };
}

function getProcessSize($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Process Size');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };
  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'processSize' } };
}

function getRayTracingCores($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'RT Cores');
  const [displayValue] = parseNumberValue(values[0] || null);
  const baseValue = displayValue;
  return { value: baseValue, meta: { specKey: 'rayTracingCores' } };
}

function getReleaseDate($: cheerio.CheerioAPI): GpuSpec<string> {
  const availabilityValues = tokenizeSpecValues($, 'Availability');
  const releaseDateValues = tokenizeSpecValues($, 'Release Date');

  let availability: string;
  try {
    availability = format(
      parse(availabilityValues[0], 'MMM do, yyyy', new Date()),
      'yyyy-MM-dd',
    );
  } catch (e) {
    availability = null;
  }

  let releaseDate: string;
  try {
    releaseDate = format(
      parse(releaseDateValues[0], 'MMM do, yyyy', new Date()),
      'yyyy-MM-dd',
    );
  } catch (e) {
    releaseDate = null;
  }

  return {
    value: availability || releaseDate || null,
    meta: { specKey: 'releaseDate' },
  };
}

function getRenderOutputUnits($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'ROPs');
  const [displayValue] = parseNumberValue(values[0] || null);
  const baseValue = displayValue;
  return { value: baseValue, meta: { specKey: 'renderOutputUnits' } };
}

function getShaderModelVersion($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Shader Model');
  const [displayValue] = parseNumberValue(values[0] || null);
  const baseValue = displayValue;
  return { value: baseValue, meta: { specKey: 'shaderModelVersion' } };
}

function getShaderUnitsCudaCores($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Shading Units');
  const [displayValue] = parseNumberValue(values[0] || null);
  const baseValue = displayValue;
  return { value: baseValue, meta: { specKey: 'shaderUnitsCudaCores' } };
}

function getSlotWidth($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Slot Width');
  const stringValue = values.join(', ');

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

  return { value, meta: { specKey: 'slotWidth' } };
}

function getSuggestedPsu($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Suggested PSU');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };
  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'suggestedPsu' } };
}

function getTensorCores($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Tensor Cores');
  const [displayValue] = parseNumberValue(values[0] || null);
  const baseValue = displayValue;
  return { value: baseValue, meta: { specKey: 'tensorCores' } };
}

function getTextureFillRate($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Texture Rate');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, TextureFillRateUnit> = {
    'GTexel/s': TextureFillRateUnit.gtexelps,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'textureFillRate' } };
}

function getTextureMappingUnits($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'TMUs');
  const [displayValue] = parseNumberValue(values[0] || null);
  const baseValue = displayValue;
  return { value: baseValue, meta: { specKey: 'textureMappingUnits' } };
}

function getThermalDesignPower($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'TDP');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'thermalDesignPower' } };
}

function getTransistors($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Transistors');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, NumericUnit> = {
    million: NumericUnit.million,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'transistors' } };
}

function getWidth($: cheerio.CheerioAPI): GpuSpec<number> {
  const values = tokenizeSpecValues($, 'Width');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };

  const unit = formats[displayUnit] || null;
  const baseValue = calculateBaseGpuSpecValue(displayValue, unit);
  return { value: baseValue, meta: { unit, specKey: 'width' } };
}

function tokenizeSpecValues($: cheerio.CheerioAPI, label: string) {
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
