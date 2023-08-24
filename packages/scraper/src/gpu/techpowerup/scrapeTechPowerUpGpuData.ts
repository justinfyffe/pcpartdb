import {
  BandwidthUnit,
  BitUnit,
  ClockSpeedUnit,
  DateFormat,
  FlopsUnit,
  getBaseUnitValue,
  Gpu,
  GpuField,
  GpuMarketSegmentValue,
  GpuProductionStatusValue,
  LengthUnit,
  MemorySizeUnit,
  NumericUnit,
  parseProductName,
  PixelFillRateUnit,
  ScrapeProductResponse,
  TextureFillRateUnit,
  WattageUnit,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { format as formatDate, parse as parseDate } from 'date-fns';
import { scraper } from '../../scraper';
import { createGpuField } from '../utils';

export interface ScrapeTechPowerGpuDataOptions {
  url: string;
  noProxy?: boolean;
}

// Example: https://www.techpowerup.com/gpu-specs/geforce-rtx-3090.c3622
export async function scrapeTechPowerUpGpuData(
  options: ScrapeTechPowerGpuDataOptions,
) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const product: Partial<Gpu> = {
    name: getName($),
    company: getCompany($),
    launchPrice: getLaunchPrice($),
    releaseDate: getReleaseDate($),
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
    partNumber: getPartNumber($),
    l1Cache: getL1Cache($),
    l2Cache: getL2Cache($),
    length: getLength($),
    marketSegment: getMarketSegment($),
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
    productionStatus: getProductionStatus($),
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
    product,
    hasRetailModels: hasRetailModels($),
  } as ScrapeProductResponse & {
    hasRetailModels: boolean;
  };
}

function getName($: cheerio.CheerioAPI) {
  const fullName = $('.gpudb-name').text();
  const company = getCompany($)?.value ?? '';
  return fullName.substring(company.length).trim();
}

function getArchitecture($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Architecture');
  const value = values.join(', ') || null;
  return createGpuField('architecture', value);
}

function getBusInterface($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Bus Interface');
  const value = values.join(', ') || null;
  return createGpuField('busInterface', value);
}

function getCodename($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'GPU Name');
  const value = values.join(', ') || null;
  return createGpuField('codename', value);
}

function getCompany($: cheerio.CheerioAPI): GpuField<string> {
  const fullName = $('.gpudb-name').text();
  const { company: value } = parseProductName(fullName);
  return createGpuField('company', value);
}

function getComputeUnitsSmCount($: cheerio.CheerioAPI): GpuField<number> {
  const values1 = tokenizeSpecValues($, 'Compute Units');
  const values2 = tokenizeSpecValues($, 'SM Count');
  const [displayValue] = parseNumberValue(values1[0] || values2[0] || null);
  const value = displayValue;
  return createGpuField('computeUnitsSmCount', value);
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
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('coreClockSpeedBase', value, { unit });
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
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('coreClockSpeedBoost', value, { unit });
}

function getDirectxVersion($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'DirectX');
  const value = values.join(', ') || null;
  return createGpuField('directxVersion', value);
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
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('fp32Performance', value, { unit });
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
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('fp64Performance', value, { unit });
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
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('height', value, { unit });
}

function getPartNumber($: cheerio.CheerioAPI): GpuField<string> {
  const partNumber = $('.gpudb-name__partnum').text();

  return createGpuField('partNumber', partNumber);
}

function getL1Cache($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'L1 Cache');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemorySizeUnit> = {
    KB: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
    GB: MemorySizeUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('l1Cache', value, { unit });
}

function getL2Cache($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'L2 Cache');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemorySizeUnit> = {
    KB: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
    GB: MemorySizeUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('l2Cache', value, { unit });
}

function getLaunchPrice($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Launch Price');
  const [displayValue, displayCurrency] = parseNumberValue(values[0] || null);

  const formats: Record<string, string> = {
    USD: 'usd',
  };

  const currency = formats[displayCurrency] || null;
  const value = displayValue;
  return createGpuField('launchPrice', value, { currency });
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
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('length', value, { unit });
}

function getMarketSegment(
  $: cheerio.CheerioAPI,
): GpuField<GpuMarketSegmentValue> {
  let value: GpuMarketSegmentValue;

  const description = $('.desc.p').text().toLowerCase();
  if (description.includes('mobile graphics chip')) {
    value = GpuMarketSegmentValue.Mobile;
  } else if (description.includes('professional graphics card')) {
    value = GpuMarketSegmentValue.Workstation;
  } else if (description.includes('integrated graphics solution')) {
    value = GpuMarketSegmentValue.Integrated;
  } else if (
    description.includes('high-end graphics card') ||
    description.includes('enthusiast-class graphics card') ||
    description.includes('performance-segment graphics card') ||
    description.includes('mid-range graphics card') ||
    description.includes(' a graphics card')
  ) {
    value = GpuMarketSegmentValue.Desktop;
  }

  if (value != null) {
    return createGpuField('marketSegment', value);
  }

  return undefined;
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
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('memoryBandwidth', value, { unit });
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
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('memoryClock', value, { unit });
}

function getMemoryInterface($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Memory Bus');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, BitUnit> = {
    bit: BitUnit.bit,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('memoryInterface', value, { unit });
}

function getMemorySize($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Memory Size');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemorySizeUnit> = {
    KB: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
    GB: MemorySizeUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('memorySize', value, { unit });
}

function getMemoryType($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Memory Type');
  const value = values.join(', ') || null;
  return createGpuField('memoryType', value);
}

function getOpenClVersion($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'OpenCL');
  const value = values.join(', ') || null;
  return createGpuField('openClVersion', value);
}

function getOpenGlVersion($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'OpenGL');
  const value = values.join(', ') || null;
  return createGpuField('openGlVersion', value);
}

function getOutputs($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Outputs');
  const value = values.join(', ') || null;
  return createGpuField('outputs', value);
}

function getPixelFillRate($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Pixel Rate');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, PixelFillRateUnit> = {
    'GPixel/s': PixelFillRateUnit.gpixelps,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('pixelFillRate', value, { unit });
}

function getPowerConnectors($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Power Connectors');
  const value = values.join(', ') || null;
  return createGpuField('powerConnectors', value);
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
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('processSize', value, { unit });
}

function getProductionStatus(
  $: cheerio.CheerioAPI,
): GpuField<GpuProductionStatusValue> {
  const values = tokenizeSpecValues($, 'Production');
  const production = values?.[0] ?? null;

  let value: GpuProductionStatusValue = null;
  if (production === 'Active') {
    value = GpuProductionStatusValue.Active;
  } else if (production === 'End-of-life') {
    value = GpuProductionStatusValue.EndOfLife;
  } else if (production === 'Unreleased') {
    value = GpuProductionStatusValue.Unreleased;
  }

  return createGpuField('productionStatus', value);
}

function getRayTracingCores($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'RT Cores');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return createGpuField('rayTracingCores', value);
}

function getReleaseDate($: cheerio.CheerioAPI): GpuField<string> {
  const availabilityValues = tokenizeSpecValues($, 'Availability');
  const releaseDateValues = tokenizeSpecValues($, 'Release Date');

  let value: string = null;
  let format: DateFormat = null;

  if (value == null) {
    value = parseDateValue(availabilityValues?.[0], 'MMM do, yyyy');
    format = value != null ? DateFormat.QuarterYear : null;
  }
  if (value == null) {
    value = parseDateValue(releaseDateValues?.[0], 'MMM do, yyyy');
    format = value != null ? DateFormat.QuarterYear : null;
  }

  if (value == null) {
    value = parseDateValue(availabilityValues?.[0], 'MMM yyyy', {
      endOfMonth: true,
    });
    format = value != null ? DateFormat.QuarterYear : null;
  }
  if (value == null) {
    value = parseDateValue(releaseDateValues?.[0], 'MMM yyyy', {
      endOfMonth: true,
    });
    format = value != null ? DateFormat.QuarterYear : null;
  }

  if (value == null) {
    value = parseDateValue(availabilityValues?.[0], 'yyyy', {
      endOfYear: true,
    });
    format = value != null ? DateFormat.Year : null;
  }
  if (value == null) {
    value = parseDateValue(releaseDateValues?.[0], 'yyyy', { endOfYear: true });
    format = value != null ? DateFormat.Year : null;
  }

  return createGpuField('releaseDate', value, { dateFormat: format });
}

function getRenderOutputUnits($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'ROPs');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return createGpuField('renderOutputUnits', value);
}

function getShaderModelVersion($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Shader Model');
  const value = values.join(', ') || null;
  return createGpuField('shaderModelVersion', value);
}

function getShaderUnitsCudaCores($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Shading Units');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return createGpuField('shaderUnitsCudaCores', value);
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

  return createGpuField('slotWidth', value);
}

function getSuggestedPsu($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Suggested PSU');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };
  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('suggestedPsu', value, { unit });
}

function getTensorCores($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Tensor Cores');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return createGpuField('tensorCores', value);
}

function getTextureFillRate($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Texture Rate');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, TextureFillRateUnit> = {
    'GTexel/s': TextureFillRateUnit.gtexelps,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('textureFillRate', value, { unit });
}

function getTextureMappingUnits($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'TMUs');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return createGpuField('textureMappingUnits', value);
}

function getThermalDesignPower($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'TDP');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('thermalDesignPower', value, { unit });
}

function getTransistors($: cheerio.CheerioAPI): GpuField<number> {
  const values = tokenizeSpecValues($, 'Transistors');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, NumericUnit> = {
    million: NumericUnit.million,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('transistors', value, { unit });
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
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField('width', value, { unit });
}

function hasRetailModels($: cheerio.CheerioAPI) {
  const retailModelLink = $('.board-table-title__inner a');
  const total = retailModelLink.filter((_i, el) => {
    const fullName = $(el).text().trim();
    const { company } = parseProductName(fullName);
    return company != null;
  }).length;

  return total > 0;
}

function tokenizeSpecValues($: cheerio.CheerioAPI, label: string) {
  const el = $('dt')
    .filter((_i, dt) => $(dt).text().trim() === label)
    .siblings('dd')
    .first();

  if (el.has('br')) {
    el.find('br').replaceWith(';;');
  }
  if (el.has('s')) {
    el.find('s').replaceWith(';;');
  }

  const values = el
    .text()
    .split(';;')
    .map((val) => val.trim());

  return values
    .filter((value) => !!value)
    .filter((value) => value.toLowerCase() !== 'none')
    .filter((value) => value.toLowerCase() !== 'unknown')
    .filter((value) => value.toLowerCase() !== 'n/a');
}

function parseNumberValue(value: string): [number, string] {
  if (value == null) {
    return [null, null];
  }

  const [base, unit] = value.split(' ');
  const sanitizedBase = Number(base.replace(',', ''));
  return [sanitizedBase, unit || null];
}

interface ParseDateValueOptions {
  endOfMonth?: boolean;
  endOfYear?: boolean;
}

function parseDateValue(
  value: string,
  format: string,
  options?: ParseDateValueOptions,
): string {
  if (value == null) {
    return null;
  }

  try {
    const parsedDate = parseDate(value, format, new Date());

    if (options?.endOfYear) {
      parsedDate.setMonth(11);
      parsedDate.setDate(31);
    } else if (options?.endOfMonth) {
      parsedDate.setMonth(parsedDate.getMonth() + 1);
      parsedDate.setDate(0);
    }

    return formatDate(parsedDate, 'yyyy-MM-dd');
  } catch (e) {
    return null;
  }
}
