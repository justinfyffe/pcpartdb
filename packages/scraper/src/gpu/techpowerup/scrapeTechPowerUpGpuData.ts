import {
  BandwidthUnit,
  BitUnit,
  CurrencyUnit,
  DateFormat,
  FlopsUnit,
  formatCompanyName,
  formatMarketSegment,
  formatProductField,
  FormatProductFieldOptions,
  formatProductionStatus,
  FrequencyUnit,
  getBaseUnitValue,
  GpuField,
  GpuFields,
  GpuProduct,
  LengthUnit,
  MarketSegment,
  MeasurementUnit,
  MemorySizeUnit,
  NumericUnit,
  parseProductName,
  PixelFillRateUnit,
  ProductFieldKey,
  ProductionStatus,
  ProductType,
  ScrapeProductResponse,
  TextureFillRateUnit,
  WattageUnit,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { format as formatDate, parse as parseDate } from 'date-fns';
import { scraper } from '../../scraper';
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createGpuField } from '../utils';

// TODO: move to a shared location to be shared with other scrapers.
// No raw value when it's these.
const SPECIAL_VALUES: Record<string, string> = {
  'motherboard dependent': 'Motherboard Dependent',
  'on certain motherboards (chipset feature)': 'Motherboard Dependent',
  'portable device dependent': 'Device Dependent',
  'system dependent': 'System Dependent',
  'system shared': 'System Shared',
};
// No value at all when it's this.
const NULL_VALUES = ['n/a', 'none', 'unknown'];

export interface ScrapeTechPowerGpuDataOptions extends CommonScraperOptions {
  url: string;
}

// Example: https://www.techpowerup.com/gpu-specs/geforce-rtx-3090.c3622
export async function scrapeTechPowerUpGpuData(
  options: ScrapeTechPowerGpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const name = getName($);
  const company = getCompany($);

  const fields: GpuFields = {
    msrp: getMsrp($, ctx),
    releaseDate: getReleaseDate($, ctx),
    architecture: getArchitecture($, ctx),
    busInterface: getBusInterface($, ctx),
    codename: getCodename($, ctx),
    cudaCores: getCudaCores($, company, ctx),
    computeUnits: getComputeUnits($, company, ctx),
    executionUnits: getExecutionUnits($, company, ctx),
    gpuCoreBaseClock: getGpuCoreBaseClock($, ctx),
    gpuCoreBoostClock: getGpuCoreBoostClock($, ctx),
    directxVersion: getDirectxVersion($, ctx),
    fp32: getFp32($, ctx),
    fp64: getFp64($, ctx),
    partNumber: getPartNumber($, ctx),
    l1Cache: getL1Cache($, ctx),
    l2Cache: getL2Cache($, ctx),
    marketSegment: getMarketSegment($, ctx),
    memoryBandwidth: getMemoryBandwidth($, ctx),
    memoryClock: getMemoryClock($, ctx),
    memoryInterface: getMemoryInterface($, ctx),
    memorySize: getMemorySize($, ctx),
    memoryType: getMemoryType($, ctx),
    openClVersion: getOpenClVersion($, ctx),
    openGlVersion: getOpenGlVersion($, ctx),
    outputs: getOutputs($, ctx),
    pixelRate: getPixelRate($, ctx),
    powerConnectors: getPowerConnectors($, ctx),
    processSize: getProcessSize($, ctx),
    productionStatus: getProductionStatus($, ctx),
    rtCores: getRayTracingCores($, ctx),
    rops: getRops($, ctx),
    shaderModelVersion: getShaderModelVersion($, ctx),
    shadingUnits: getShadingUnits($, company, ctx),
    slotWidth: getSlotWidth($, ctx),
    streamMultiprocessors: getStreamMultiprocessors($, company, ctx),
    streamProcessors: getStreamProcessors($, company, ctx),
    suggestedPsu: getSuggestedPsu($, ctx),
    tensorCores: getTensorCores($, ctx),
    textureRate: getTextureRate($, ctx),
    tmus: getTmus($, ctx),
    tdp: getTdp($, ctx),
    transistors: getTransistors($, ctx),
  };

  const product: Partial<GpuProduct> = {
    productType: ProductType.Gpu,
    name,
    company,
    fields,
  };

  return { product } as ScrapeProductResponse;
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
  const result = parseStringValue({ value, fieldKey: 'architecture' });

  return createGpuField({
    field: 'architecture',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getBusInterface(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'Bus Interface');
  const value = values.join(', ') || null;
  const result = parseStringValue({ value, fieldKey: 'busInterface' });

  return createGpuField({
    field: 'busInterface',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getCodename(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'GPU Name');
  const value = values.join(', ') || null;
  const result = parseStringValue({ value, fieldKey: 'codename' });

  return createGpuField({
    field: 'codename',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getCompany($: cheerio.CheerioAPI): string {
  const fullName = $('.gpudb-name').text();
  const { company: raw } = parseProductName(fullName);
  return formatCompanyName(raw);
}

function getComputeUnits(
  $: cheerio.CheerioAPI,
  company: string | null,
  ctx?: ScraperContext,
): GpuField<number> {
  const lcCompany = company?.toLowerCase();

  let result: ParseNumberResult = null;
  if (lcCompany === 'amd' || lcCompany === 'ati') {
    const values1 = tokenizeSpecValues($, 'Compute Units');
    const values2 = tokenizeSpecValues($, 'SM Count');

    result = parseNumberValue({
      fieldKey: 'computeUnits',
      value: values1[0] || values2[0] || null,
    });
  }

  return createGpuField({
    field: 'computeUnits',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getCudaCores(
  $: cheerio.CheerioAPI,
  company: string | null,
  ctx?: ScraperContext,
): GpuField<number> {
  const lcCompany = company?.toLowerCase();

  let result: ParseNumberResult = null;
  if (lcCompany === 'nvidia') {
    const values = tokenizeSpecValues($, 'Shading Units');
    result = parseNumberValue({
      fieldKey: 'cudaCores',
      value: values[0] || null,
    });
  }

  return createGpuField({
    field: 'cudaCores',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getExecutionUnits(
  $: cheerio.CheerioAPI,
  company: string | null,
  ctx?: ScraperContext,
): GpuField<number> {
  const lcCompany = company?.toLowerCase();

  let result: ParseNumberResult = null;
  if (lcCompany === 'intel') {
    const values1 = tokenizeSpecValues($, 'Compute Units');
    const values2 = tokenizeSpecValues($, 'SM Count');

    result = parseNumberValue({
      fieldKey: 'executionUnits',
      value: values1[0] || values2[0] || null,
    });
  }

  return createGpuField({
    field: 'executionUnits',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getGpuCoreBaseClock(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values1 = tokenizeSpecValues($, 'Base Clock');
  const values2 = tokenizeSpecValues($, 'GPU Clock');
  const result = parseNumberValue({
    fieldKey: 'gpuCoreBaseClock',
    value: values1[0] || values2[0] || null,
    unitMapper: {
      KHz: FrequencyUnit.khz,
      MHz: FrequencyUnit.mhz,
      GHz: FrequencyUnit.ghz,
    },
  });

  return createGpuField({
    field: 'gpuCoreBaseClock',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getGpuCoreBoostClock(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Boost Clock');
  const result = parseNumberValue({
    fieldKey: 'gpuCoreBoostClock',
    value: values[0] || null,
    unitMapper: {
      KHz: FrequencyUnit.khz,
      MHz: FrequencyUnit.mhz,
      GHz: FrequencyUnit.ghz,
    },
  });

  return createGpuField({
    field: 'gpuCoreBoostClock',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getDirectxVersion(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'DirectX');
  const value = values.join(', ') || null;
  const result = parseStringValue({ value, fieldKey: 'directxVersion' });

  return createGpuField({
    field: 'directxVersion',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getFp32(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values1 = tokenizeSpecValues($, 'FP32 (float) performance');
  const values2 = tokenizeSpecValues($, 'FP32 (float)');
  const result = parseNumberValue({
    fieldKey: 'fp32',
    value: values1[0] || values2[0] || null,
    unitMapper: {
      GFLOPS: FlopsUnit.gflops,
      TFLOPS: FlopsUnit.tflops,
    },
  });

  return createGpuField({
    field: 'fp32',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getFp64(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values1 = tokenizeSpecValues($, 'FP64 (double) performance');
  const values2 = tokenizeSpecValues($, 'FP64 (double)');
  const result = parseNumberValue({
    fieldKey: 'fp64',
    value: values1[0] || values2[0] || null,
    unitMapper: {
      GFLOPS: FlopsUnit.gflops,
      TFLOPS: FlopsUnit.tflops,
    },
  });

  return createGpuField({
    field: 'fp64',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getPartNumber(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const raw = $('.gpudb-name__partnum').text() || null;
  const formatted = formatProductField(ProductType.Gpu, 'partNumber', raw);

  return createGpuField({ field: 'partNumber', raw, formatted, ctx });
}

function getL1Cache(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'L1 Cache');
  const result = parseNumberValue({
    fieldKey: 'l1Cache',
    value: values[0] || null,
    unitMapper: {
      KB: MemorySizeUnit.kb,
      MB: MemorySizeUnit.mb,
      GB: MemorySizeUnit.gb,
      TB: MemorySizeUnit.tb,
      K: MemorySizeUnit.kb,
      M: MemorySizeUnit.mb,
      G: MemorySizeUnit.gb,
      T: MemorySizeUnit.tb,
    },
  });

  return createGpuField({
    field: 'l1Cache',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getL2Cache(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'L2 Cache');
  const result = parseNumberValue({
    fieldKey: 'l2Cache',
    value: values[0] || null,
    unitMapper: {
      KB: MemorySizeUnit.kb,
      MB: MemorySizeUnit.mb,
      GB: MemorySizeUnit.gb,
      TB: MemorySizeUnit.tb,
      K: MemorySizeUnit.kb,
      M: MemorySizeUnit.mb,
      G: MemorySizeUnit.gb,
      T: MemorySizeUnit.tb,
    },
  });

  return createGpuField({
    field: 'l2Cache',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getMsrp(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Launch Price');
  const result = parseNumberValue({
    fieldKey: 'msrp',
    value: values[0] || null,
    unitMapper: {
      $: CurrencyUnit.USD,
      USD: CurrencyUnit.USD,
    },
  });

  return createGpuField({
    field: 'msrp',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getMarketSegment(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<MarketSegment> {
  let raw: MarketSegment = null;

  let description = $('.desc.p').text().toLowerCase();
  description = description.replace(/\s+/g, ' ');
  if (description.includes('mobile graphics chip')) {
    raw = MarketSegment.Mobile;
  } else if (description.includes('professional graphics card')) {
    raw = MarketSegment.Workstation;
  } else if (description.includes('integrated graphics solution')) {
    raw = MarketSegment.Integrated;
  } else if (
    description.includes('high-end graphics card') ||
    description.includes('enthusiast-class graphics card') ||
    description.includes('performance-segment graphics card') ||
    description.includes('mid-range graphics card') ||
    description.includes(' a graphics card') ||
    description.includes('an entry-level graphics card')
  ) {
    raw = MarketSegment.Desktop;
  }

  const formatted = raw != null ? formatMarketSegment(raw) : null;

  return createGpuField({ field: 'marketSegment', raw, formatted, ctx });
}

function getMemoryBandwidth(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Bandwidth');
  const result = parseNumberValue({
    fieldKey: 'memoryBandwidth',
    value: values[0] || null,
    unitMapper: {
      'KB/s': BandwidthUnit.kbps,
      'MB/s': BandwidthUnit.mbps,
      'GB/s': BandwidthUnit.gbps,
      'TB/s': BandwidthUnit.tbps,
    },
  });

  return createGpuField({
    field: 'memoryBandwidth',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getMemoryClock(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Memory Clock');
  const result = parseNumberValue({
    fieldKey: 'memoryClock',
    value: values[0] || null,
    unitMapper: {
      KHz: FrequencyUnit.khz,
      MHz: FrequencyUnit.mhz,
      GHz: FrequencyUnit.ghz,
    },
  });

  return createGpuField({
    field: 'memoryClock',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getMemoryInterface(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Memory Bus');
  const result = parseNumberValue({
    fieldKey: 'memoryInterface',
    value: values[0] || null,
    unitMapper: {
      bit: BitUnit.bit,
    },
  });

  return createGpuField({
    field: 'memoryInterface',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getMemorySize(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Memory Size');
  const result = parseNumberValue({
    fieldKey: 'memorySize',
    value: values[0] || null,
    unitMapper: {
      KB: MemorySizeUnit.kb,
      MB: MemorySizeUnit.mb,
      GB: MemorySizeUnit.gb,
      TB: MemorySizeUnit.tb,
      K: MemorySizeUnit.kb,
      M: MemorySizeUnit.mb,
      G: MemorySizeUnit.gb,
      T: MemorySizeUnit.tb,
    },
  });

  return createGpuField({
    field: 'memorySize',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getMemoryType(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'Memory Type');
  const value = values.join(', ') || null;
  const result = parseStringValue({ value, fieldKey: 'memoryType' });

  return createGpuField({
    field: 'memoryType',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getOpenClVersion(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'OpenCL');
  const value = values.join(', ') || null;
  const result = parseStringValue({ value, fieldKey: 'openClVersion' });

  return createGpuField({
    field: 'openClVersion',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getOpenGlVersion(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'OpenGL');
  const value = values.join(', ') || null;
  const result = parseStringValue({ value, fieldKey: 'openGlVersion' });

  return createGpuField({
    field: 'openGlVersion',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getOutputs(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'Outputs');
  const value =
    values.map((value) => value.replace(/^[0-9]+x/, '').trim()).join(', ') ||
    null;
  const result = parseStringValue({ value, fieldKey: 'outputs' });

  return createGpuField({
    field: 'outputs',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getPixelRate(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Pixel Rate');
  const result = parseNumberValue({
    fieldKey: 'pixelRate',
    value: values[0] || null,
    unitMapper: {
      'MPixel/s': PixelFillRateUnit.mpixelps,
      'GPixel/s': PixelFillRateUnit.gpixelps,
    },
  });

  return createGpuField({
    field: 'pixelRate',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getPowerConnectors(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'Power Connectors');
  const value = values.join(', ') || null;
  const result = parseStringValue({ value, fieldKey: 'powerConnectors' });

  return createGpuField({
    field: 'powerConnectors',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getProcessSize(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Process Size');
  const result = parseNumberValue({
    fieldKey: 'processSize',
    value: values[0] || null,
    unitMapper: {
      μm: LengthUnit.um,
      nm: LengthUnit.nm,
      mm: LengthUnit.mm,
    },
  });

  return createGpuField({
    field: 'processSize',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getProductionStatus(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<ProductionStatus> {
  const values = tokenizeSpecValues($, 'Production');
  const releaseDateValues = tokenizeSpecValues($, 'Release Date');
  const production = values?.[0]?.toLowerCase() ?? null;
  const releaseDate = releaseDateValues?.[0]?.toLowerCase() ?? null;

  let raw: ProductionStatus = null;
  if (releaseDate === 'never released') {
    raw = ProductionStatus.Unreleased;
  } else if (production === 'active') {
    raw = ProductionStatus.Active;
  } else if (production === 'end-of-life') {
    raw = ProductionStatus.EndOfLife;
  } else if (production === 'unreleased') {
    raw = ProductionStatus.Unreleased;
  }
  const formatted = raw != null ? formatProductionStatus(raw) : null;

  return createGpuField({ field: 'productionStatus', raw, formatted, ctx });
}

function getRayTracingCores(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'RT Cores');
  const result = parseNumberValue({
    fieldKey: 'rtCores',
    value: values[0] || null,
  });

  return createGpuField({
    field: 'rtCores',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getReleaseDate(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const availabilityValues = tokenizeSpecValues($, 'Availability');
  const releaseDateValues = tokenizeSpecValues($, 'Release Date');

  const availability = availabilityValues?.[0];
  const releaseDate = releaseDateValues?.[0];

  let raw: string = null;
  let format: DateFormat = null;

  if (raw == null) {
    raw = parseDateValue(availability, 'MMM do, yyyy');
    format = raw != null ? DateFormat.QuarterYear : null;
  }
  if (raw == null) {
    raw = parseDateValue(releaseDate, 'MMM do, yyyy');
    format = raw != null ? DateFormat.QuarterYear : null;
  }

  if (raw == null) {
    raw = parseDateValue(availability, 'MMM yyyy', {
      endOfMonth: true,
    });
    format = raw != null ? DateFormat.QuarterYear : null;
  }
  if (raw == null) {
    raw = parseDateValue(releaseDate, 'MMM yyyy', {
      endOfMonth: true,
    });
    format = raw != null ? DateFormat.QuarterYear : null;
  }

  if (raw == null) {
    raw = parseDateValue(availability, 'yyyy', {
      endOfYear: true,
    });
    format = raw != null ? DateFormat.Year : null;
  }
  if (raw == null) {
    raw = parseDateValue(releaseDate, 'yyyy', { endOfYear: true });
    format = raw != null ? DateFormat.Year : null;
  }

  const formatted = formatProductField(ProductType.Gpu, 'releaseDate', raw, {
    dateFormat: format,
  });

  return createGpuField({ field: 'releaseDate', raw, formatted, ctx });
}

function getRops(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'ROPs');
  const result = parseNumberValue({
    fieldKey: 'rops',
    value: values[0] || null,
  });

  return createGpuField({
    field: 'rops',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getShaderModelVersion(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<string> {
  const values = tokenizeSpecValues($, 'Shader Model');
  const value = values.join(', ') || null;
  const result = parseStringValue({ value, fieldKey: 'shaderModelVersion' });

  return createGpuField({
    field: 'shaderModelVersion',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getShadingUnits(
  $: cheerio.CheerioAPI,
  company: string | null,
  ctx?: ScraperContext,
): GpuField<number> {
  const lcCompany = company?.toLowerCase();

  let result: ParseNumberResult = null;
  if (lcCompany === 'intel' || lcCompany === 'ati') {
    const values = tokenizeSpecValues($, 'Shading Units');
    result = parseNumberValue({
      fieldKey: 'shadingUnits',
      value: values[0] || null,
    });
  }

  return createGpuField({
    field: 'shadingUnits',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getSlotWidth(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Slot Width');
  const stringValue = values.join(', ');

  let raw = null;
  if (stringValue === 'Quad-slot') {
    raw = 4;
  } else if (stringValue === 'Triple-slot') {
    raw = 3;
  } else if (stringValue === 'Dual-slot') {
    raw = 2;
  } else if (stringValue === 'Single-slot') {
    raw = 1;
  }
  const formatted = formatProductField(ProductType.Gpu, 'slotWidth', raw);

  return createGpuField({ field: 'slotWidth', raw, formatted, ctx });
}

function getStreamMultiprocessors(
  $: cheerio.CheerioAPI,
  company: string | null,
  ctx?: ScraperContext,
): GpuField<number> {
  const lcCompany = company?.toLowerCase();

  let result: ParseNumberResult = null;
  if (lcCompany === 'nvidia') {
    const values1 = tokenizeSpecValues($, 'Compute Units');
    const values2 = tokenizeSpecValues($, 'SM Count');

    result = parseNumberValue({
      fieldKey: 'streamMultiprocessors',
      value: values1[0] || values2[0] || null,
    });
  }

  return createGpuField({
    field: 'streamMultiprocessors',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getStreamProcessors(
  $: cheerio.CheerioAPI,
  company: string | null,
  ctx?: ScraperContext,
): GpuField<number> {
  const lcCompany = company?.toLowerCase();

  let result: ParseNumberResult = null;
  if (lcCompany === 'amd') {
    const values = tokenizeSpecValues($, 'Shading Units');
    result = parseNumberValue({
      fieldKey: 'streamProcessors',
      value: values[0] || null,
    });
  }

  return createGpuField({
    field: 'streamProcessors',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getSuggestedPsu(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Suggested PSU');
  const result = parseNumberValue({
    fieldKey: 'suggestedPsu',
    value: values[0] || null,
    unitMapper: {
      W: WattageUnit.w,
    },
  });

  return createGpuField({
    field: 'suggestedPsu',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getTensorCores(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Tensor Cores');
  const result = parseNumberValue({
    fieldKey: 'tensorCores',
    value: values[0] || null,
  });

  return createGpuField({
    field: 'tensorCores',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getTextureRate(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Texture Rate');
  const result = parseNumberValue({
    fieldKey: 'textureRate',
    value: values[0] || null,
    unitMapper: {
      'MTexel/s': TextureFillRateUnit.mtexelps,
      'GTexel/s': TextureFillRateUnit.gtexelps,
    },
  });

  return createGpuField({
    field: 'textureRate',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getTmus(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'TMUs');
  const result = parseNumberValue({
    fieldKey: 'tmus',
    value: values[0] || null,
  });

  return createGpuField({
    field: 'tmus',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getTdp($: cheerio.CheerioAPI, ctx?: ScraperContext): GpuField<number> {
  const values = tokenizeSpecValues($, 'TDP');
  const result = parseNumberValue({
    fieldKey: 'tdp',
    value: values[0] || null,
    unitMapper: {
      W: WattageUnit.w,
    },
  });

  return createGpuField({
    field: 'tdp',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getTransistors(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
): GpuField<number> {
  const values = tokenizeSpecValues($, 'Transistors');
  const result = parseNumberValue({
    fieldKey: 'transistors',
    value: values[0] || null,
    unitMapper: {
      million: NumericUnit.million,
    },
  });

  return createGpuField({
    field: 'transistors',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
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
    .filter((value) => !NULL_VALUES.includes(value.toLowerCase()))
    .map((value) => SPECIAL_VALUES[value.toLowerCase()] || value);
}

interface ParseNumberOptions {
  value: string;
  unitMapper?: Record<string, MeasurementUnit>;

  fieldKey: ProductFieldKey;
  formatOptions?: FormatProductFieldOptions;
}

interface ParseNumberResult {
  rawValue: number;
  formattedValue: string;
}

const NUMBER_REGEX = /([^\d]?)([,.\d]+)\s*([^\d\s][\w/]*)*/i;
function parseNumberValue(options: ParseNumberOptions): ParseNumberResult {
  const { value, unitMapper, fieldKey, formatOptions } = options;
  if (value == null) {
    return null;
  }

  const lcValue = value.toLowerCase();
  const originalValue = value;

  if (NULL_VALUES.includes(lcValue)) {
    return null;
  }

  if (SPECIAL_VALUES[lcValue] != null) {
    return {
      rawValue: null,
      formattedValue: SPECIAL_VALUES[lcValue],
    };
  }

  const [_fullValue, rawPrefix, rawBase, rawSuffix] = value.match(NUMBER_REGEX);

  const base = Number(rawBase.replace(',', ''));
  if (Number.isNaN(base)) {
    return null;
  }

  const prefixUnit = unitMapper?.[rawPrefix] || null;
  const suffixUnit = unitMapper?.[rawSuffix] || null;
  const unit = prefixUnit || suffixUnit || null;
  if (unitMapper != null && unit == null) {
    console.error(
      `Invalid unit for ${fieldKey}. Prefix: ${prefixUnit}. Suffix: ${suffixUnit}. Original value: ${originalValue}`,
    );
    return null;
  }

  const rawValue =
    unit != null ? getBaseUnitValue(base, unit, { decimals: 2 }) : base;
  const formattedValue = formatProductField(
    ProductType.Gpu,
    fieldKey,
    rawValue,
    { ...formatOptions, displayUnit: unit },
  );

  return {
    rawValue,
    formattedValue,
  };
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

interface ParseStringOptions {
  value: string;

  fieldKey: ProductFieldKey;
  formatOptions?: FormatProductFieldOptions;
}

interface ParseStringResult {
  rawValue: string;
  formattedValue: string;
}

function parseStringValue(options: ParseStringOptions): ParseStringResult {
  const { value, fieldKey, formatOptions } = options;
  if (value == null) {
    return null;
  }

  const lcValue = value.toLowerCase();
  if (NULL_VALUES.includes(lcValue)) {
    return null;
  }

  if (
    Object.values(SPECIAL_VALUES)
      .map((v) => v.toLowerCase())
      .includes(lcValue)
  ) {
    return {
      rawValue: null,
      formattedValue: value,
    };
  }

  const rawValue = value;
  const formattedValue = formatProductField(
    ProductType.Gpu,
    fieldKey,
    rawValue,
    { ...formatOptions },
  );

  return {
    rawValue,
    formattedValue,
  };
}
