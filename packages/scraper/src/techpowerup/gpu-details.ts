import {
  BandwidthUnit,
  BitUnit,
  calculateBaseGpuFieldValue,
  ClockSpeedUnit,
  FlopsUnit,
  GpuDataSourceKey,
  GpuField,
  GpuSpecs,
  LengthUnit,
  MemoryUnit,
  NumericUnit,
  PixelFillRateUnit,
  ScrapeGpuDetailsResponse,
  TextureFillRateUnit,
  WattageUnit,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { format, parse } from 'date-fns';
import { scraper } from '../scraper';

export interface ScrapeTechPowerGpuDetailsOptions {
  url: string;
  proxy?: boolean;
}

// Example: https://www.techpowerup.com/gpu-specs/geforce-rtx-3090.c3622
export async function scrapeTechPowerUpGpuDetails(
  options: ScrapeTechPowerGpuDetailsOptions,
) {
  const response = await scraper.scrape(options.url, { retries: 1 });
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
  } as ScrapeGpuDetailsResponse;
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
        source: GpuDataSourceKey.TechPowerUp,
        autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
      source: GpuDataSourceKey.TechPowerUp,
      autoUpdate: true,
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
