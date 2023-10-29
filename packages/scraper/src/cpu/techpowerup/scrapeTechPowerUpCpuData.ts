import {
  BooleanFormatter,
  ClockSpeedUnit,
  convertToCpuMemoryChannelNumber,
  CpuFields,
  CpuProduct,
  CurrencyUnit,
  DateFormat,
  formatBooleanValue,
  formatCompanyName,
  formatMarketSegment,
  formatProductField,
  FormatProductFieldOptions,
  formatProductionStatus,
  generateProductOtherNames,
  generateProductSearchableText,
  getBaseUnitValue,
  hasProductFieldValue,
  LengthUnit,
  MarketSegment,
  MeasurementUnit,
  MemorySizeUnit,
  MultiplierUnit,
  NumericUnit,
  parseProductName,
  productFieldFormattedValue,
  ProductFieldKey,
  productFieldRawValue,
  ProductionStatus,
  ProductType,
  ScrapeProductResponse,
  TemperatureUnit,
  WattageUnit,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { format as formatDateFn, parse as parseDateFn } from 'date-fns';
import { scraper } from '../../scraper';
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createCpuField } from '../utils';

const SPECIAL_VALUES: Record<string, string> = {
  'motherboard dependent': 'Motherboard Dependent',
  'on certain motherboards (chipset feature)': 'Motherboard Dependent',
  'portable device dependent': 'Device Dependent',
  'system dependent': 'System Dependent',
  'system shared': 'System Shared',
};
const NULL_VALUES = ['n/a', 'none', 'unknown'];

export interface ScrapeTechPowerUpCpuDataOptions extends CommonScraperOptions {
  url: string;
}

export async function scrapeTechPowerUpCpuData(
  options: ScrapeTechPowerUpCpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const name = getName($);
  const company = getCompany($);
  const searchText = generateProductSearchableText({ company, name });
  const otherNames = generateProductOtherNames({ company, name });

  const fields: CpuFields = {
    partNumber: getPartNumber($, ctx),
    marketSegment: getMarketSegment($, ctx),
    msrp: getMsrp($, ctx),
    releaseDate: getReleaseDate($, ctx),
    productionStatus: getProductionStatus($, ctx),
    bundledCooler: getBundledCooler($, ctx),

    socket: getSocket($, ctx),
    foundry: getFoundry($, ctx),
    processSize: getProcessSize($, ctx),
    transistors: getTransistors($, ctx),
    tCaseMax: getTCaseMax($, ctx),
    tjMax: getTjMax($, ctx),

    architecture: getArchitecture($, ctx),
    codename: getCodename($, ctx),
    generation: getGeneration($, ctx),
    pciExpress: getPciExpress($, ctx),
    chipsets: getChipsets($, ctx),

    memorySupport: getMemorySupport($, ctx),
    memoryChannels: getMemoryChannels($, ctx),
    eccMemory: getEccMemory($, ctx),

    cores: getCoresCount($, ctx),
    threads: getThreadsCount($, ctx),
    pCores: getPerformanceCoresCount($, ctx),
    eCores: getEfficientCoresCount($, ctx),
    clock: getClock($, ctx),
    turboClock: getTurboClock($, ctx),
    pCoreClock: getPerformanceCoreClock($, ctx),
    pCoreTurboClock: getPerformanceCoreTurboClock($, ctx),
    eCoreClock: getEfficientCoreClock($, ctx),
    eCoreTurboClock: getEfficientCoreTurboClock($, ctx),
    baseClock: getBaseClock($, ctx),
    multiplier: getMultiplier($, ctx),
    multiplierUnlocked: getMultiplierUnlocked($, ctx),

    tdp: getTdp($, ctx),
    pl1: getPl1($, ctx),
    pl2: getPl2($, ctx),
    ppt: getPpt($, ctx),

    l1Cache: getL1Cache($, ctx),
    l2Cache: getL2Cache($, ctx),
    l3Cache: getL3Cache($, ctx),
    eCoreL1Cache: getEfficientCoreL1Cache($, ctx),
    eCoreL2Cache: getEfficientCoreL2Cache($, ctx),

    integratedGraphics: getIntegratedGraphics($, ctx),
    extensionsTechnologies: getExtensionsTechnologies($, ctx),
  };

  const product: Partial<CpuProduct> = {
    productType: ProductType.Cpu,
    name,
    company,
    searchText,
    otherNames,
    fields,
  };

  return { product } as ScrapeProductResponse;
}

function getArchitecture($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Generation');
  let value = values[1]?.trim();
  if (value?.startsWith('(')) {
    value = value.substring(1);
  }
  if (value?.endsWith(')')) {
    value = value.substring(0, value.length - 1);
  }
  value = value.replaceAll(/\(.*\)/g, '').trim();
  const formatted = formatProductField(ProductType.Cpu, 'architecture', value);

  return createCpuField({ field: 'architecture', raw: value, formatted, ctx });
}

function getBaseClock($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Base Clock');
  const result = parseNumber({
    fieldKey: 'baseClock',
    value: values[0] || null,
    unitMapper: {
      KHz: ClockSpeedUnit.khz,
      MHz: ClockSpeedUnit.mhz,
      GHz: ClockSpeedUnit.ghz,
    },
  });

  return createCpuField({
    field: 'baseClock',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getBundledCooler($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Bundled Cooler');
  const value = values.join(', ') || null;
  const formatted = formatProductField(ProductType.Cpu, 'bundledCooler', value);

  return createCpuField({ field: 'bundledCooler', raw: value, formatted, ctx });
}

function getChipsets($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values1 = tokenizeMultiLine($, 'Chipset');
  const values2 = tokenizeMultiLine($, 'Chipsets');
  const values = values1.length > 0 ? values1 : values2;

  const chipsets =
    values?.[0]
      ?.split(',')
      .map((value) => value.trim().replace('*', ''))
      .filter((value) => value.length > 0) || [];
  const value = chipsets.join(', ');
  const formatted = formatProductField(ProductType.Cpu, 'chipsets', value);

  return createCpuField({ field: 'chipsets', raw: value, formatted, ctx });
}

function getClock($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Frequency');
  const result = parseNumber({
    fieldKey: 'clock',
    value: values[0] || null,
    unitMapper: {
      KHz: ClockSpeedUnit.khz,
      MHz: ClockSpeedUnit.mhz,
      GHz: ClockSpeedUnit.ghz,
    },
  });

  return createCpuField({
    field: 'clock',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getCodename($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Codename');
  const value = values.join(', ') || null;
  const formatted = formatProductField(ProductType.Cpu, 'codename', value);

  return createCpuField({ field: 'codename', raw: value, formatted, ctx });
}

function getCompany($: cheerio.CheerioAPI) {
  const fullName = $('.cpuname').text();
  const { company } = parseProductName(fullName);
  return formatCompanyName(company);
}

function getCoresCount($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, '# of Cores');
  const result = parseNumber({
    fieldKey: 'cores',
    value: values[0] || null,
  });

  return createCpuField({
    field: 'cores',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getEccMemory($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const text = tokenizeMultiLine($, 'ECC Memory');
  const textTrimmed = text[0]?.trim().toLowerCase();

  let value: boolean = null;
  if (textTrimmed === 'yes') {
    value = true;
  } else if (textTrimmed === 'no') {
    value = false;
  }
  const formatted = formatBooleanValue(value, {
    formatter: BooleanFormatter.YesNo,
  });

  return createCpuField({ field: 'eccMemory', raw: value, formatted, ctx });
}

function getEfficientCoreL1Cache($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'E-Core L1');
  const result = parseNumber({
    fieldKey: 'eCoreL1Cache',
    value: values[0] || null,
    unitMapper: {
      KB: MemorySizeUnit.kb,
      MB: MemorySizeUnit.mb,
      GB: MemorySizeUnit.gb,
      K: MemorySizeUnit.kb,
      M: MemorySizeUnit.mb,
      G: MemorySizeUnit.gb,
    },
  });

  return createCpuField({
    field: 'eCoreL1Cache',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getEfficientCoreL2Cache($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'E-Core L2');
  const result = parseNumber({
    fieldKey: 'eCoreL2Cache',
    value: values[0] || null,
    unitMapper: {
      KB: MemorySizeUnit.kb,
      MB: MemorySizeUnit.mb,
      GB: MemorySizeUnit.gb,
      K: MemorySizeUnit.kb,
      M: MemorySizeUnit.mb,
      G: MemorySizeUnit.gb,
    },
  });

  return createCpuField({
    field: 'eCoreL2Cache',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getEfficientCoreClock($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  if (!hasProductFieldValue(getEfficientCoresCount($, ctx))) {
    return createCpuField({
      field: 'eCoreClock',
      raw: null,
      formatted: null,
      ctx,
    });
  }

  const values = tokenizeMultiLine($, 'E-Core Frequency').map((value) =>
    value.replace('up to', '').trim(),
  );

  // Doesn't have 2 values for this field. Cannot determine clock
  if (values.length !== 2) {
    return createCpuField({
      field: 'eCoreClock',
      raw: null,
      formatted: null,
      ctx,
    });
  }

  const result = parseNumber({
    fieldKey: 'eCoreClock',
    value: values[0] || null,
    unitMapper: {
      KHz: ClockSpeedUnit.khz,
      MHz: ClockSpeedUnit.mhz,
      GHz: ClockSpeedUnit.ghz,
    },
  });

  return createCpuField({
    field: 'eCoreClock',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getEfficientCoreTurboClock(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
) {
  if (!hasProductFieldValue(getEfficientCoresCount($, ctx))) {
    return createCpuField({
      field: 'eCoreTurboClock',
      raw: null,
      formatted: null,
      ctx,
    });
  }

  const values = tokenizeMultiLine($, 'E-Core Frequency').map((value) =>
    value.replace('up to', '').trim(),
  );

  // Doesn't have 2 values for this field. Cannot determine clock
  if (values.length !== 2) {
    return createCpuField({
      field: 'eCoreTurboClock',
      raw: null,
      formatted: null,
      ctx,
    });
  }

  const result = parseNumber({
    fieldKey: 'eCoreTurboClock',
    value: values[0] || null,
    unitMapper: {
      KHz: ClockSpeedUnit.khz,
      MHz: ClockSpeedUnit.mhz,
      GHz: ClockSpeedUnit.ghz,
    },
  });

  return createCpuField({
    field: 'eCoreTurboClock',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getEfficientCoresCount($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Hybrid Cores');

  let textValue: string = null;
  for (let i = 0; i < values.length; ++i) {
    const hybridCoreText = values[i]?.trim().toLowerCase();
    if (hybridCoreText.startsWith('e-cores')) {
      textValue = hybridCoreText.split(':')[1].trim();
      break;
    }
  }

  const result = parseNumber({
    fieldKey: 'eCores',
    value: textValue || null,
  });

  return createCpuField({
    field: 'eCores',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getExtensionsTechnologies(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
) {
  const items =
    $('ul.features li')
      .map((_i, li) => $(li).text().trim())
      .get()
      .filter((text) => text != null && text.length > 0) || [];
  const value = items.join(', ');
  const formatted = formatProductField(
    ProductType.Cpu,
    'extensionsTechnologies',
    value,
  );

  return createCpuField({
    field: 'extensionsTechnologies',
    raw: value,
    formatted,
    ctx,
  });
}

function getFoundry($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Foundry');
  const value = values.join(', ') || null;
  const formatted = formatProductField(ProductType.Cpu, 'foundry', value);

  return createCpuField({ field: 'foundry', raw: value, formatted, ctx });
}

function getGeneration($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Generation');
  const value = values[0]?.trim();
  const formatted = formatProductField(ProductType.Cpu, 'generation', value);

  return createCpuField({ field: 'generation', raw: value, formatted, ctx });
}

function getIntegratedGraphics($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Integrated Graphics');
  const value = values[0]?.trim();
  if (value?.toLowerCase() === 'n/a') {
    return createCpuField({
      field: 'integratedGraphics',
      raw: null,
      formatted: null,
      ctx,
    });
  }
  const formatted = formatProductField(
    ProductType.Cpu,
    'integratedGraphics',
    value,
  );

  return createCpuField({
    field: 'integratedGraphics',
    raw: value,
    formatted,
    ctx,
  });
}

function getL1Cache($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Cache L1');
  const result = parseNumber({
    fieldKey: 'l1Cache',
    value: values[0] || null,
    unitMapper: {
      KB: MemorySizeUnit.kb,
      MB: MemorySizeUnit.mb,
      GB: MemorySizeUnit.gb,
      K: MemorySizeUnit.kb,
      M: MemorySizeUnit.mb,
      G: MemorySizeUnit.gb,
    },
  });

  return createCpuField({
    field: 'l1Cache',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getL2Cache($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Cache L2');
  const result = parseNumber({
    fieldKey: 'l2Cache',
    value: values[0] || null,
    unitMapper: {
      KB: MemorySizeUnit.kb,
      MB: MemorySizeUnit.mb,
      GB: MemorySizeUnit.gb,
      K: MemorySizeUnit.kb,
      M: MemorySizeUnit.mb,
      G: MemorySizeUnit.gb,
    },
  });

  return createCpuField({
    field: 'l2Cache',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getL3Cache($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Cache L3');
  const result = parseNumber({
    fieldKey: 'l3Cache',
    value: values[0] || null,
    unitMapper: {
      KB: MemorySizeUnit.kb,
      MB: MemorySizeUnit.mb,
      GB: MemorySizeUnit.gb,
      K: MemorySizeUnit.kb,
      M: MemorySizeUnit.mb,
      G: MemorySizeUnit.gb,
    },
  });

  return createCpuField({
    field: 'l3Cache',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getMsrp($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Launch Price');
  const result = parseNumber({
    fieldKey: 'msrp',
    value: values[0] || null,
    unitMapper: {
      $: CurrencyUnit.USD,
      USD: CurrencyUnit.USD,
    },
  });

  return createCpuField({
    field: 'msrp',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getMarketSegment($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  let marketSegment: MarketSegment = null;
  if (isDesktopMarketSegment($)) {
    marketSegment = MarketSegment.Desktop;
  } else if (isMobileMarketSegment($)) {
    marketSegment = MarketSegment.Mobile;
  }
  if (isWorkstationMarketSegment($)) {
    marketSegment = MarketSegment.Workstation;
  }
  if (isServerMarketSegment($)) {
    marketSegment = MarketSegment.Server;
  }
  if (isEmbeddedMarketSegment($)) {
    marketSegment = MarketSegment.Embedded;
  }
  const formatted = formatMarketSegment(marketSegment);

  return createCpuField({
    field: 'marketSegment',
    raw: marketSegment,
    formatted,
    ctx,
  });
}

function isDesktopMarketSegment($: cheerio.CheerioAPI) {
  const name = getName($).toLowerCase();
  const marketSegment = tokenizeMultiLine($, 'Market')
    .map((value) => value.toLowerCase())
    .filter((value) => value != null);

  if (marketSegment.includes('desktop')) {
    if (
      name.includes(' pro-') ||
      name.startsWith('pro-') ||
      name.includes(' pro ') ||
      name.startsWith('pro ')
    ) {
      return false;
    }

    return true;
  }

  return false;
}

function isMobileMarketSegment($: cheerio.CheerioAPI) {
  const marketSegment = tokenizeMultiLine($, 'Market')
    .map((value) => value.toLowerCase())
    .filter((value) => value != null);

  if (marketSegment.includes('mobile')) {
    return true;
  }

  return false;
}

function isWorkstationMarketSegment($: cheerio.CheerioAPI) {
  const name = getName($).toLowerCase();
  const marketSegment = tokenizeMultiLine($, 'Market')
    .map((value) => value.toLowerCase())
    .filter((value) => value != null);

  // Handle edge cases where desktop cpus are mislabeled as workstations
  if (marketSegment.includes('desktop')) {
    if (name.includes(' pro-') || name.includes(' pro ')) {
      return true;
    }

    return false;
  }

  if (!marketSegment.includes('server/workstation')) {
    // Does not have server/workstation, we can assume it's not.
    return false;
  }

  if (
    name.includes('xeon w9-') ||
    name.includes('xeon w7-') ||
    name.includes('xeon w5-') ||
    name.includes('xeon w3-') ||
    name.includes('xeon w-')
  ) {
    return true;
  }

  if (
    name.includes(' pro-') ||
    name.startsWith('pro-') ||
    name.includes(' pro ') ||
    name.startsWith('pro ')
  ) {
    return true;
  }

  return false;
}

function isServerMarketSegment($: cheerio.CheerioAPI) {
  const name = getName($).toLowerCase();
  const marketSegment = tokenizeMultiLine($, 'Market')
    .map((value) => value.toLowerCase())
    .filter((value) => value != null);

  if (!marketSegment.includes('server/workstation')) {
    // Does not have server/workstation, we can assume it's not.
    return false;
  }

  if (name.includes('epyc') || name.includes('opteron')) {
    return true;
  }

  if (
    name.includes('xeon platinum') ||
    name.includes('xeon gold') ||
    name.includes('xeon silver') ||
    name.includes('xeon bronze')
  ) {
    return true;
  }

  if (
    name.includes('xeon e7-') ||
    name.includes('xeon e5-') ||
    name.includes('xeon e3-') ||
    name.includes('xeon e-') ||
    name.includes('xeon d-') ||
    name.includes('xeon e') ||
    name.includes('xeon l') ||
    name.includes('xeon x')
  ) {
    return true;
  }

  return false;
}

function isEmbeddedMarketSegment($: cheerio.CheerioAPI) {
  const name = getName($).toLowerCase();

  if (name.includes('embedded')) {
    return true;
  }

  return false;
}

function getMemoryChannels($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Memory Bus');

  let value: number = null;
  for (let i = 0; i < values.length; ++i) {
    const channels = convertToCpuMemoryChannelNumber(values[i]);
    if (channels != null) {
      value = channels;
      break;
    }
  }
  const formatted = formatProductField(
    ProductType.Cpu,
    'memoryChannels',
    value,
  );

  return createCpuField({
    field: 'memoryChannels',
    raw: value,
    formatted,
    ctx,
  });
}

function getMemorySupport($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const raw: string[] = [];
  const memoryTypes = new Set<string>();

  const ddr4SpeedValues = tokenizeMultiLine($, 'DDR4 Speed');
  const ddr4Result = parseNumber({
    fieldKey: 'memorySupport',
    value: ddr4SpeedValues[0] || null,
  });
  if (ddr4Result?.rawValue != null) {
    raw.push(`DDR4-${ddr4Result?.rawValue}`);
    memoryTypes.add('ddr4');
  }

  const ddr5SpeedValues = tokenizeMultiLine($, 'DDR5 Speed');
  const ddr5Result = parseNumber({
    fieldKey: 'memorySupport',
    value: ddr5SpeedValues[0] || null,
  });
  if (ddr5Result?.rawValue != null) {
    raw.push(`DDR5-${ddr5Result?.rawValue}`);
    memoryTypes.add('ddr5');
  }

  const memorySupportValues = tokenizeMultiLine($, 'Memory Support');
  const memoryTypeRegex = /(DDR[0-9])(-[0-9]+)?/;
  for (let i = 0; i < memorySupportValues.length; ++i) {
    const supportParts = memorySupportValues[i].split(',');
    for (let j = 0; j < supportParts.length; ++j) {
      const supportPart = supportParts[j];

      const results = supportPart.match(memoryTypeRegex) || [];
      if (results.length > 0) {
        const lcMemoryType = results[1].toLowerCase();
        if (!memoryTypes.has(lcMemoryType)) {
          raw.push(results[0]);
          memoryTypes.add(lcMemoryType);
        }
        continue;
      }
    }
  }
  const value = raw.join(', ');
  const formatted = formatProductField(ProductType.Cpu, 'memorySupport', value);

  return createCpuField({ field: 'memorySupport', raw: value, formatted, ctx });
}

function getMultiplier($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Multiplier');
  const result = parseNumber({
    fieldKey: 'multiplier',
    value: values[0] || null,
    unitMapper: {
      x: MultiplierUnit.x,
    },
  });

  return createCpuField({
    field: 'multiplier',
    raw: result?.rawValue,
    formatted: result?.formattedValue,
    ctx,
  });
}

function getMultiplierUnlocked($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const text = tokenizeMultiLine($, 'Multiplier Unlocked');
  const textTrimmed = text[0]?.trim().toLowerCase();

  let value: boolean = null;
  if (textTrimmed === 'yes') {
    value = true;
  } else if (textTrimmed === 'no') {
    value = false;
  }
  const formatted = formatBooleanValue(value, {
    formatter: BooleanFormatter.YesNo,
  });

  return createCpuField({
    field: 'multiplierUnlocked',
    raw: value,
    formatted,
    ctx,
  });
}

function getName($: cheerio.CheerioAPI) {
  const fullName = $('.cpuname').text();
  const { company } = parseProductName(fullName);

  return fullName.substring(company?.length || 0).trim();
}

function getPartNumber($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Part#');
  const value = values.join(', ') || null;
  const formatted = formatProductField(ProductType.Cpu, 'partNumber', value);

  return createCpuField({ field: 'partNumber', raw: value, formatted, ctx });
}

function getPciExpress($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const primaryPciValues = tokenizeMultiLine($, 'PCI-Express');
  const secondaryPciValues = tokenizeMultiLine($, 'Secondary PCIe');
  const pciExpressData = [...primaryPciValues, ...secondaryPciValues];

  const versionRegex = /Gen (\d+)/;
  const lanesRegex = /(\d+) Lanes/;

  const raw: string[] = [];
  for (let i = 0; i < pciExpressData.length; ++i) {
    const data = pciExpressData[i];
    const versionResults = data.match(versionRegex) || [];
    const laneResults = data.match(lanesRegex) || [];

    if (versionResults.length <= 1) {
      continue;
    }

    const version = Number(versionResults[1]);
    const lanes = laneResults.length >= 2 ? Number(laneResults[1]) : null;

    let pciExpressValue = `PCIe ${version.toFixed(1)}`;
    if (lanes != null) {
      pciExpressValue += ` x${lanes}`;
    }
    raw.push(pciExpressValue);
  }
  const value = raw.join(', ');
  const formatted = formatProductField(ProductType.Cpu, 'pciExpress', value);

  return createCpuField({ field: 'pciExpress', raw: value, formatted, ctx });
}

function getPerformanceCoreClock($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  if (!hasProductFieldValue(getPerformanceCoresCount($, ctx))) {
    return createCpuField({
      field: 'pCoreClock',
      raw: null,
      formatted: null,
      ctx,
    });
  }

  const ret = getClock($, ctx);
  return createCpuField({
    field: 'pCoreClock',
    raw: productFieldRawValue(ret),
    formatted: productFieldFormattedValue(ret),
    ctx,
  });
}

function getPerformanceCoreTurboClock(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
) {
  if (!hasProductFieldValue(getPerformanceCoresCount($, ctx))) {
    return createCpuField({
      field: 'pCoreTurboClock',
      raw: null,
      formatted: null,
      ctx,
    });
  }

  const ret = getTurboClock($, ctx);
  return createCpuField({
    field: 'pCoreTurboClock',
    raw: productFieldRawValue(ret),
    formatted: productFieldFormattedValue(ret),
    ctx,
  });
}

function getPerformanceCoresCount($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Hybrid Cores');

  let textValue: string = null;
  for (let i = 0; i < values.length; ++i) {
    const hybridCoreText = values[i]?.trim().toLowerCase();
    if (hybridCoreText.startsWith('p-cores')) {
      textValue = hybridCoreText.split(':')[1].trim();
      break;
    }
  }

  const result = parseNumber({
    fieldKey: 'pCores',
    value: textValue || null,
  });

  return createCpuField({
    field: 'pCores',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getPl1($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'PL1');
  const result = parseNumber({
    fieldKey: 'pl1',
    value: values[0] || null,
    unitMapper: {
      W: WattageUnit.w,
    },
  });

  return createCpuField({
    field: 'pl1',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getPl2($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'PL2');
  const result = parseNumber({
    fieldKey: 'pl1',
    value: values[0] || null,
    unitMapper: {
      W: WattageUnit.w,
    },
  });

  return createCpuField({
    field: 'pl2',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getPpt($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'PPT');
  const result = parseNumber({
    fieldKey: 'ppt',
    value: values[0] || null,
    unitMapper: {
      W: WattageUnit.w,
    },
  });

  return createCpuField({
    field: 'ppt',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getProcessSize($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Process Size');
  const result = parseNumber({
    fieldKey: 'ppt',
    value: values[0] || null,
    unitMapper: {
      μm: LengthUnit.um,
      nm: LengthUnit.nm,
      mm: LengthUnit.mm,
    },
  });

  return createCpuField({
    field: 'processSize',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getProductionStatus($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Production Status');
  const productionStatus = values
    .map((value) => {
      const lcValue = value?.toLowerCase();
      if (lcValue === 'active') {
        return ProductionStatus.Active;
      } else if (lcValue === 'unreleased') {
        return ProductionStatus.Unreleased;
      } else if (lcValue === 'end-of-life') {
        return ProductionStatus.EndOfLife;
      } else {
        return null;
      }
    })
    .filter((value) => value != null);
  const value = productionStatus[0] || null;
  const formatted = formatProductionStatus(value);

  return createCpuField({
    field: 'productionStatus',
    raw: value,
    formatted,
    ctx,
  });
}

function getReleaseDate($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const availabilityValues = tokenizeMultiLine($, 'Availability');
  const releaseDateValues = tokenizeMultiLine($, 'Release Date');

  const availability = availabilityValues?.[0];
  const releaseDate = releaseDateValues?.[0];

  let raw: string = null;
  let format: DateFormat = null;

  if (raw == null) {
    raw = parseDate(availability, 'MMM do, yyyy');
    format = raw != null ? DateFormat.QuarterYear : null;
  }
  if (raw == null) {
    raw = parseDate(releaseDate, 'MMM do, yyyy');
    format = raw != null ? DateFormat.QuarterYear : null;
  }

  if (raw == null) {
    raw = parseDate(availability, 'MMM yyyy', {
      endOfMonth: true,
    });
    format = raw != null ? DateFormat.QuarterYear : null;
  }
  if (raw == null) {
    raw = parseDate(releaseDate, 'MMM yyyy', {
      endOfMonth: true,
    });
    format = raw != null ? DateFormat.QuarterYear : null;
  }

  if (raw == null) {
    raw = parseDate(availability, 'yyyy', {
      endOfYear: true,
    });
    format = raw != null ? DateFormat.Year : null;
  }
  if (raw == null) {
    raw = parseDate(releaseDate, 'yyyy', { endOfYear: true });
    format = raw != null ? DateFormat.Year : null;
  }

  const formatted = formatProductField(ProductType.Gpu, 'releaseDate', raw, {
    dateFormat: format,
  });

  return createCpuField({ field: 'releaseDate', raw, formatted, ctx });
}

function getSocket($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Socket');
  const value = values.join(', ') || null;
  const formatted = formatProductField(ProductType.Cpu, 'socket', value);

  return createCpuField({ field: 'socket', raw: value, formatted, ctx });
}

function getTCaseMax($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'tCaseMax');
  const result = parseNumber({
    fieldKey: 'tCaseMax',
    value: values[0] || null,
    unitMapper: {
      '°C': TemperatureUnit.c,
    },
  });

  return createCpuField({
    field: 'tCaseMax',
    raw: result?.rawValue,
    formatted: result?.formattedValue,
    ctx,
  });
}

function getTdp($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'TDP');
  const result = parseNumber({
    fieldKey: 'tdp',
    value: values[0] || null,
    unitMapper: {
      W: WattageUnit.w,
    },
  });

  return createCpuField({
    field: 'tdp',
    raw: result?.rawValue,
    formatted: result?.formattedValue,
    ctx,
  });
}

function getThreadsCount($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, '# of Threads');
  const result = parseNumber({
    fieldKey: 'threads',
    value: values[0] || null,
  });

  return createCpuField({
    field: 'threads',
    raw: result?.rawValue,
    formatted: result?.formattedValue,
    ctx,
  });
}

function getTjMax($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'tJMax');
  const result = parseNumber({
    fieldKey: 'tjMax',
    value: values[0] || null,
    unitMapper: {
      '°C': TemperatureUnit.c,
    },
  });

  return createCpuField({
    field: 'tjMax',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getTransistors($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Transistors');
  const result = parseNumber({
    fieldKey: 'transistors',
    value: values[0] || null,
    unitMapper: {
      million: NumericUnit.million,
    },
  });

  return createCpuField({
    field: 'transistors',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function getTurboClock($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Turbo Clock').map((value) =>
    value.replace('up to', '').trim(),
  );
  const result = parseNumber({
    fieldKey: 'turboClock',
    value: values[0] || null,
    unitMapper: {
      KHz: ClockSpeedUnit.khz,
      MHz: ClockSpeedUnit.mhz,
      GHz: ClockSpeedUnit.ghz,
    },
  });

  return createCpuField({
    field: 'turboClock',
    raw: result?.rawValue ?? null,
    formatted: result?.formattedValue ?? null,
    ctx,
  });
}

function tokenizeMultiLine($: cheerio.CheerioAPI, label: string) {
  const el = $('th')
    .filter((_i, dt) => $(dt).text().trim() === `${label}:`)
    .siblings('td')
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
function parseNumber(options: ParseNumberOptions): ParseNumberResult {
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
      rawValue: 0,
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
    ProductType.Cpu,
    fieldKey,
    rawValue,
    { ...formatOptions, displayUnit: unit },
  );

  return {
    rawValue,
    formattedValue,
  };
}

interface ParseDateOptions {
  endOfMonth?: boolean;
  endOfYear?: boolean;
}

function parseDate(
  value: string,
  format: string,
  options?: ParseDateOptions,
): string {
  if (value == null) {
    return null;
  }

  try {
    const parsedDate = parseDateFn(value, format, new Date());

    if (options?.endOfYear) {
      parsedDate.setMonth(11);
      parsedDate.setDate(31);
    } else if (options?.endOfMonth) {
      parsedDate.setMonth(parsedDate.getMonth() + 1);
      parsedDate.setDate(0);
    }

    return formatDateFn(parsedDate, 'yyyy-MM-dd');
  } catch (e) {
    return null;
  }
}
