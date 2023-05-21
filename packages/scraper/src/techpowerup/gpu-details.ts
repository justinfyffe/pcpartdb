import {
  BandwidthUnit,
  BitUnit,
  calculateBaseGpuFieldValue,
  ClockSpeedUnit,
  DateFormat,
  FlopsUnit,
  Gpu,
  GpuField,
  LengthUnit,
  MemoryUnit,
  NumericUnit,
  PixelFillRateUnit,
  ScrapeGpuDetailsResponse,
  TextureFillRateUnit,
  WattageUnit,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { format as formatDate, parse as parseDate } from 'date-fns';
import { scraper } from '../scraper';
import { parseGpuName } from './utils';

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

  const gpu: Partial<Gpu> = {
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

  return { gpu: { ...gpu } } as ScrapeGpuDetailsResponse;
}

function getName($: cheerio.CheerioAPI) {
  const fullName = $('.gpudb-name').text();
  const company = getCompany($)?.value ?? '';
  return fullName.substring(company.length).trim();
}

function getArchitecture($: cheerio.CheerioAPI): GpuField<string> {
  const values = tokenizeSpecValues($, 'Architecture');
  const value = values.join(', ') || null;
  return {
    value,
    meta: {
      fieldKey: 'architecture',
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
      autoUpdate: true,
    },
  };
}

function getCompany($: cheerio.CheerioAPI): GpuField<string> {
  const fullName = $('.gpudb-name').text();
  const { company: value } = parseGpuName(fullName);
  if (value != null) {
    return {
      value,
      meta: {
        fieldKey: 'company',
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
      autoUpdate: true,
    },
  };
}

function getPartNumber($: cheerio.CheerioAPI): GpuField<string> {
  const partNumber = $('.gpudb-name__partnum').text();

  return {
    value: partNumber,
    meta: {
      fieldKey: 'partNumber',
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
      autoUpdate: true,
    },
  };
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
    value = parseDateValue(availabilityValues?.[0], 'MMM yyyy', {
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
    value = parseDateValue(releaseDateValues?.[0], 'MMM do, yyyy');
    format = value != null ? DateFormat.QuarterYear : null;
  }
  if (value == null) {
    value = parseDateValue(releaseDateValues?.[0], 'MMM yyyy', {
      endOfMonth: true,
    });
    format = value != null ? DateFormat.QuarterYear : null;
  }
  if (value == null) {
    value = parseDateValue(releaseDateValues?.[0], 'yyyy', { endOfYear: true });
    format = value != null ? DateFormat.Year : null;
  }

  return {
    value,
    meta: {
      fieldKey: 'releaseDate',
      dateFormat: format,
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
  if (el.has('s')) {
    el.find('s').replaceWith(';;');
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
