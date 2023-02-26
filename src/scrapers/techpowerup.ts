import {
  BandwidthUnit,
  BitUnit,
  calculateBaseGpuFieldValue,
  ClockSpeedUnit,
  FlopsUnit,
  GpuDataSource,
  GpuField,
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
  const company = getCompany($);
  const launchPrice = getLaunchPrice($);
  const releaseDate = getReleaseDate($);

  // Get Spec Values
  const specs: GpuSpecs = {
    architecture: getArchitecture($),
    busInterface: getBusInterface($),
    codename: getCodename($),
    computeUnitsSmCount: getComputeUnitsSmCount($),
    coreClockSpeedBase: getCoreClockSpeedBase($),
    coreClockSpeedBoost: getCoreClockSpeedBoost($),
    directxVersion: getDirectxVersion($),
    fp32Performance: getFp32Performance($),
    fp64Performance: getFp64Performance($),
    height: getHeight($),
    l1Cache: getL1Cache($),
    l2Cache: getL2Cache($),
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

  return {
    gpu: { name, company, launchPrice, releaseDate, specs },
  } as ImportGpuDataResponse;
}

function getName($: cheerio.CheerioAPI) {
  const fullName = $('.gpudb-name').text();
  const [_company, ...name] = fullName.split(' ');
  return name.join(' ');
}

function getArchitecture($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Architecture');
  const value = values.join(', ') || null;
  return {
    value,
    meta: {
      fieldKey: 'architecture',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getBusInterface($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Bus Interface');
  const value = values.join(', ') || null;
  return {
    value,
    meta: {
      fieldKey: 'busInterface',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getCodename($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'GPU Name');
  const value = values.join(', ') || null;
  return {
    value,
    meta: {
      fieldKey: 'codename',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getCompany($: cheerio.CheerioAPI): GpuField<string> {
  const fullName = $('.gpudb-name').text();
  const [company] = fullName.split(' ');
  const lcCompany = company.toLowerCase();
  if (lcCompany === 'nvidia' || lcCompany === 'amd' || lcCompany === 'intel') {
    const value = company;
    return {
      value,
      meta: {
        fieldKey: 'company',
        dataSource: {
          source: GpuDataSource.TechPowerUp,
          enabled: value != null,
        },
      },
    };
  }

  return null;
}

function getComputeUnitsSmCount($: cheerio.CheerioAPI): GpuField<number> {
  const values1 = tokenizeSpecValues($, 'Compute Units');
  const values2 = tokenizeSpecValues($, 'SM Count');
  const [displayValue] = parseNumberValue(values1[0] || values2[0] || null);
  const value = displayValue;
  return {
    value,
    meta: {
      fieldKey: 'computeUnitsSmCount',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getCoreClockSpeedBase($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Base Clock');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'coreClockSpeedBase',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getCoreClockSpeedBoost($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Boost Clock');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'coreClockSpeedBoost',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getDirectxVersion($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'DirectX');
  const value = values.join(', ') || null;
  return {
    value,
    meta: {
      fieldKey: 'directxVersion',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getFp32Performance($: cheerio.CheerioAPI): GpuField<number> {
  const values1 = tokenizeSpecValues($, 'FP32 (float) performance');
  const values2 = tokenizeSpecValues($, 'FP32 (float)');
  const [displayValue, displayUnit] = parseNumberValue(
    values1[0] || values2[0] || null,
  );

  const formats: Record<string, FlopsUnit> = {
    GFLOPS: FlopsUnit.gflops,
    TFLOPS: FlopsUnit.tflops,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'fp32Performance',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getFp64Performance($: cheerio.CheerioAPI): GpuField<number> {
  const values1 = tokenizeSpecValues($, 'FP64 (double) performance');
  const values2 = tokenizeSpecValues($, 'FP64 (double)');
  const [displayValue, displayUnit] = parseNumberValue(
    values1[0] || values2[0] || null,
  );

  const formats: Record<string, FlopsUnit> = {
    GFLOPS: FlopsUnit.gflops,
    TFLOPS: FlopsUnit.tflops,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'fp64Performance',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getHeight($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Height');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'height',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getL1Cache($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'L1 Cache');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemoryUnit> = {
    KB: MemoryUnit.kb,
    MB: MemoryUnit.mb,
    GB: MemoryUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'l1Cache',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getL2Cache($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'L2 Cache');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemoryUnit> = {
    KB: MemoryUnit.kb,
    MB: MemoryUnit.mb,
    GB: MemoryUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'l2Cache',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getLaunchPrice($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Launch Price');
  const [displayValue, displayCurrency] = parseNumberValue(values[0] || null);

  const formats: Record<string, string> = {
    USD: 'usd',
  };

  const currency = formats[displayCurrency] || null;
  const value = displayValue;
  return {
    value,
    meta: {
      currency,
      fieldKey: 'launchPrice',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getLength($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Length');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'length',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getMemoryBandwidth($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Bandwidth');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, BandwidthUnit> = {
    'KB/s': BandwidthUnit.kbps,
    'MB/s': BandwidthUnit.mbps,
    'GB/s': BandwidthUnit.gbps,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'memoryBandwidth',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getMemoryClock($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Memory Clock');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'memoryClock',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getMemoryInterface($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Memory Bus');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, BitUnit> = {
    bit: BitUnit.bit,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'memoryInterface',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getMemorySize($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Memory Size');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemoryUnit> = {
    KB: MemoryUnit.kb,
    MB: MemoryUnit.mb,
    GB: MemoryUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'memorySize',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getMemoryType($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Memory Type');
  const value = values.join(', ') || null;
  return {
    value,
    meta: {
      fieldKey: 'memoryType',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getOpenClVersion($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'OpenCL');
  const value = values.join(', ') || null;
  return {
    value,
    meta: {
      fieldKey: 'openClVersion',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getOpenGlVersion($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'OpenGL');
  const value = values.join(', ') || null;
  return {
    value,
    meta: {
      fieldKey: 'openGlVersion',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getOutputs($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Outputs');
  const value = values.join(', ') || null;
  return {
    value,
    meta: {
      fieldKey: 'outputs',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getPixelFillRate($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Pixel Rate');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, PixelFillRateUnit> = {
    'GPixel/s': PixelFillRateUnit.gpixelps,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'pixelFillRate',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getPowerConnectors($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Power Connectors');
  const value = values.join(', ') || null;
  return {
    value,
    meta: {
      fieldKey: 'powerConnectors',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getProcessSize($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Process Size');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };
  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'processSize',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getRayTracingCores($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'RT Cores');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return {
    value,
    meta: {
      fieldKey: 'rayTracingCores',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getReleaseDate($: cheerio.CheerioAPI): GpuField<string> {
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

  const value = availability || releaseDate || null;
  return {
    value,
    meta: {
      fieldKey: 'releaseDate',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getRenderOutputUnits($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'ROPs');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return {
    value,
    meta: {
      fieldKey: 'renderOutputUnits',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getShaderModelVersion($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Shader Model');
  const value = values.join(', ') || null;
  return {
    value,
    meta: {
      fieldKey: 'shaderModelVersion',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getShaderUnitsCudaCores($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Shading Units');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return {
    value,
    meta: {
      fieldKey: 'shaderUnitsCudaCores',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getSlotWidth($: cheerio.CheerioAPI): GpuField<number> {
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

  return {
    value,
    meta: {
      fieldKey: 'slotWidth',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getSuggestedPsu($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Suggested PSU');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };
  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'suggestedPsu',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getTensorCores($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Tensor Cores');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return {
    value,
    meta: {
      fieldKey: 'tensorCores',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getTextureFillRate($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Texture Rate');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, TextureFillRateUnit> = {
    'GTexel/s': TextureFillRateUnit.gtexelps,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'textureFillRate',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getTextureMappingUnits($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'TMUs');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return {
    value,
    meta: {
      fieldKey: 'textureMappingUnits',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getThermalDesignPower($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'TDP');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'thermalDesignPower',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getTransistors($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Transistors');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, NumericUnit> = {
    million: NumericUnit.million,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'transistors',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
}

function getWidth($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Width');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };

  const unit = formats[displayUnit] || null;
  const value = calculateBaseGpuFieldValue(displayValue, unit);
  return {
    value,
    meta: {
      unit,
      fieldKey: 'width',
      dataSource: { source: GpuDataSource.TechPowerUp, enabled: value != null },
    },
  };
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

  return values.filter((value) => !!value);
}

function parseNumberValue(value: string): [number, string] {
  if (value == null) {
    return [null, null];
  }

  const [base, unit] = value.split(' ');
  const sanitizedBase = Number(base.replace(',', ''));
  return [sanitizedBase, unit || null];
}
