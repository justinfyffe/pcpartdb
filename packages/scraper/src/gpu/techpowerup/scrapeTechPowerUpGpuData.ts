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
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createGpuField } from '../utils';

export interface ScrapeTechPowerGpuDataOptions extends CommonScraperOptions {
  url: string;
}

// Example: https://www.techpowerup.com/gpu-specs/geforce-rtx-3090.c3622
export async function scrapeTechPowerUpGpuData(
  options: ScrapeTechPowerGpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const product: Partial<Gpu> = {
    name: getName($),
    company: getCompany($, ctx),
    launchPrice: getLaunchPrice($, ctx),
    releaseDate: getReleaseDate($, ctx),
    architecture: getArchitecture($, ctx),
    busInterface: getBusInterface($, ctx),
    codename: getCodename($, ctx),
    computeUnitsSmCount: getComputeUnitsSmCount($, ctx),
    coreClockSpeedBase: getCoreClockSpeedBase($, ctx),
    coreClockSpeedBoost: getCoreClockSpeedBoost($, ctx),
    directxVersion: getDirectxVersion($, ctx),
    fp32Performance: getFp32Performance($, ctx),
    fp64Performance: getFp64Performance($, ctx),
    height: getHeight($, ctx),
    partNumber: getPartNumber($, ctx),
    l1Cache: getL1Cache($, ctx),
    l2Cache: getL2Cache($, ctx),
    length: getLength($, ctx),
    marketSegment: getMarketSegment($, ctx),
    memoryBandwidth: getMemoryBandwidth($, ctx),
    memoryClock: getMemoryClock($, ctx),
    memoryInterface: getMemoryInterface($, ctx),
    memorySize: getMemorySize($, ctx),
    memoryType: getMemoryType($, ctx),
    openClVersion: getOpenClVersion($, ctx),
    openGlVersion: getOpenGlVersion($, ctx),
    outputs: getOutputs($, ctx),
    pixelFillRate: getPixelFillRate($, ctx),
    powerConnectors: getPowerConnectors($, ctx),
    processSize: getProcessSize($, ctx),
    productionStatus: getProductionStatus($, ctx),
    rayTracingCores: getRayTracingCores($, ctx),
    renderOutputUnits: getRenderOutputUnits($, ctx),
    shaderModelVersion: getShaderModelVersion($, ctx),
    shaderUnitsCudaCores: getShaderUnitsCudaCores($, ctx),
    slotWidth: getSlotWidth($, ctx),
    suggestedPsu: getSuggestedPsu($, ctx),
    tensorCores: getTensorCores($, ctx),
    textureFillRate: getTextureFillRate($, ctx),
    textureMappingUnits: getTextureMappingUnits($, ctx),
    thermalDesignPower: getThermalDesignPower($, ctx),
    transistors: getTransistors($, ctx),
    width: getWidth($, ctx),
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
  const { company } = parseProductName(fullName);

  return fullName.substring(company?.length || 0).trim();
}

function getArchitecture(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'Architecture');
  const value = values.join(', ') || null;
  return createGpuField({ field: 'architecture', value, ctx });
}

function getBusInterface(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'Bus Interface');
  const value = values.join(', ') || null;
  return createGpuField({ field: 'busInterface', value, ctx });
}

function getCodename(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'GPU Name');
  const value = values.join(', ') || null;
  return createGpuField({ field: 'codename', value, ctx });
}

function getCompany(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const fullName = $('.gpudb-name').text();
  const { company: value } = parseProductName(fullName);
  return createGpuField({ field: 'company', value, ctx });
}

function getComputeUnitsSmCount(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values1 = tokenizeSpecValues($, 'Compute Units');
  const values2 = tokenizeSpecValues($, 'SM Count');
  const [displayValue] = parseNumberValue(values1[0] || values2[0] || null);
  const value = displayValue;
  return createGpuField({ field: 'computeUnitsSmCount', value, ctx });
}

function getCoreClockSpeedBase(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Base Clock');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({
    field: 'coreClockSpeedBase',
    value,
    meta: { unit },
    ctx,
  });
}

function getCoreClockSpeedBoost(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Boost Clock');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({
    field: 'coreClockSpeedBoost',
    value,
    meta: { unit },
    ctx,
  });
}

function getDirectxVersion(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'DirectX');
  const value = values.join(', ') || null;
  return createGpuField({ field: 'directxVersion', value, ctx });
}

function getFp32Performance(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
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
  return createGpuField({
    field: 'fp32Performance',
    value,
    meta: { unit },
    ctx,
  });
}

function getFp64Performance(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
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
  return createGpuField({
    field: 'fp64Performance',
    value,
    meta: { unit },
    ctx,
  });
}

function getHeight(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Height');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({ field: 'height', value, meta: { unit }, ctx });
}

function getPartNumber(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const partNumber = $('.gpudb-name__partnum').text();

  return createGpuField({ field: 'partNumber', value: partNumber, ctx });
}

function getL1Cache(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'L1 Cache');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemorySizeUnit> = {
    KB: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
    GB: MemorySizeUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({ field: 'l1Cache', value, meta: { unit }, ctx });
}

function getL2Cache(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'L2 Cache');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemorySizeUnit> = {
    KB: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
    GB: MemorySizeUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({ field: 'l2Cache', value, meta: { unit }, ctx });
}

function getLaunchPrice(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Launch Price');
  const [displayValue, displayCurrency] = parseNumberValue(values[0] || null);

  const formats: Record<string, string> = {
    USD: 'usd',
  };

  const currency = formats[displayCurrency] || null;
  const value = displayValue;
  return createGpuField({
    field: 'launchPrice',
    value,
    meta: { currency },
    ctx,
  });
}

function getLength(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Length');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({ field: 'length', value, meta: { unit }, ctx });
}

function getMarketSegment(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<GpuMarketSegmentValue> {
  let value: GpuMarketSegmentValue = null;

  let description = $('.desc.p').text().toLowerCase();
  description = description.replace(/\s+/g, ' ');
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

  return createGpuField({ field: 'marketSegment', value, ctx });
}

function getMemoryBandwidth(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Bandwidth');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, BandwidthUnit> = {
    'KB/s': BandwidthUnit.kbps,
    'MB/s': BandwidthUnit.mbps,
    'GB/s': BandwidthUnit.gbps,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({
    field: 'memoryBandwidth',
    value,
    meta: { unit },
    ctx,
  });
}

function getMemoryClock(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Memory Clock');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({ field: 'memoryClock', value, meta: { unit }, ctx });
}

function getMemoryInterface(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Memory Bus');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, BitUnit> = {
    bit: BitUnit.bit,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({
    field: 'memoryInterface',
    value,
    meta: { unit },
    ctx,
  });
}

function getMemorySize(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Memory Size');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, MemorySizeUnit> = {
    KB: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
    GB: MemorySizeUnit.gb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({ field: 'memorySize', value, meta: { unit }, ctx });
}

function getMemoryType(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'Memory Type');
  const value = values.join(', ') || null;
  return createGpuField({ field: 'memoryType', value, ctx });
}

function getOpenClVersion(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'OpenCL');
  const value = values.join(', ') || null;
  return createGpuField({ field: 'openClVersion', value, ctx });
}

function getOpenGlVersion(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'OpenGL');
  const value = values.join(', ') || null;
  return createGpuField({ field: 'openGlVersion', value, ctx });
}

function getOutputs(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'Outputs');
  const value = values.join(', ') || null;
  return createGpuField({ field: 'outputs', value, ctx });
}

function getPixelFillRate(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Pixel Rate');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, PixelFillRateUnit> = {
    'GPixel/s': PixelFillRateUnit.gpixelps,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({ field: 'pixelFillRate', value, meta: { unit }, ctx });
}

function getPowerConnectors(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'Power Connectors');
  const value = values.join(', ') || null;
  return createGpuField({ field: 'powerConnectors', value, ctx });
}

function getProcessSize(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Process Size');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };
  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({ field: 'processSize', value, meta: { unit }, ctx });
}

function getProductionStatus(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
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

  return createGpuField({ field: 'productionStatus', value, ctx });
}

function getRayTracingCores(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'RT Cores');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return createGpuField({ field: 'rayTracingCores', value, ctx });
}

function getReleaseDate(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
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

  return createGpuField({
    field: 'releaseDate',
    value,
    meta: { dateFormat: format },
    ctx,
  });
}

function getRenderOutputUnits(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'ROPs');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return createGpuField({ field: 'renderOutputUnits', value, ctx });
}

function getShaderModelVersion(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'Shader Model');
  const value = values.join(', ') || null;
  return createGpuField({ field: 'shaderModelVersion', value, ctx });
}

function getShaderUnitsCudaCores(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Shading Units');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return createGpuField({ field: 'shaderUnitsCudaCores', value, ctx });
}

function getSlotWidth(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
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

  return createGpuField({ field: 'slotWidth', value, ctx });
}

function getSuggestedPsu(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Suggested PSU');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };
  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({ field: 'suggestedPsu', value, meta: { unit }, ctx });
}

function getTensorCores(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Tensor Cores');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return createGpuField({ field: 'tensorCores', value, ctx });
}

function getTextureFillRate(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Texture Rate');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, TextureFillRateUnit> = {
    'GTexel/s': TextureFillRateUnit.gtexelps,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({
    field: 'textureFillRate',
    value,
    meta: { unit },
    ctx,
  });
}

function getTextureMappingUnits(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'TMUs');
  const [displayValue] = parseNumberValue(values[0] || null);
  const value = displayValue;
  return createGpuField({ field: 'textureMappingUnits', value, ctx });
}

function getThermalDesignPower(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'TDP');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({
    field: 'thermalDesignPower',
    value,
    meta: { unit },
    ctx,
  });
}

function getTransistors(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Transistors');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, NumericUnit> = {
    million: NumericUnit.million,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({ field: 'transistors', value, meta: { unit }, ctx });
}

function getWidth(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Width');
  const [displayValue, displayUnit] = parseNumberValue(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);
  return createGpuField({ field: 'width', value, meta: { unit }, ctx });
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
