import {
  ClockSpeedUnit,
  convertToCpuMemoryChannelNumber,
  Cpu,
  CpuMarketSegmentValue,
  CpuProductionStatusValue,
  DateFormat,
  getBaseUnitValue,
  hasProductFieldValue,
  LengthUnit,
  MemorySizeUnit,
  NumericUnit,
  parseProductName,
  ScrapeProductResponse,
  TemperatureUnit,
  WattageUnit,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { format as formatDateFn, parse as parseDateFn } from 'date-fns';
import { scraper } from '../../scraper';
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createCpuField } from '../utils';

export interface ScrapeTechPowerUpCpuDataOptions extends CommonScraperOptions {
  url: string;
}

export async function scrapeTechPowerUpCpuData(
  options: ScrapeTechPowerUpCpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const product: Partial<Cpu> = {
    name: getName($),
    partNumber: getPartNumber($, ctx),
    company: getCompany($, ctx),
    marketSegment: getMarketSegment($, ctx),
    launchPrice: getLaunchPrice($, ctx),
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
    hasEccMemory: getEccMemory($, ctx),

    coresCount: getCoresCount($, ctx),
    threadsCount: getThreadsCount($, ctx),
    performanceCoresCount: getPerformanceCoresCount($, ctx),
    efficientCoresCount: getEfficientCoresCount($, ctx),
    clock: getClock($, ctx),
    turboClock: getTurboClock($, ctx),
    performanceCoreClock: getPerformanceCoreClock($, ctx),
    performanceCoreTurboClock: getPerformanceCoreTurboClock($, ctx),
    efficientCoreClock: getEfficientCoreClock($, ctx),
    efficientCoreTurboClock: getEfficientCoreTurboClock($, ctx),
    baseClock: getBaseClock($, ctx),
    multiplier: getMultiplier($, ctx),
    isMultiplierUnlocked: getMultiplierUnlocked($, ctx),

    tdp: getTdp($, ctx),
    pl1: getPl1($, ctx),
    pl2: getPl2($, ctx),
    ppt: getPpt($, ctx),

    l1Cache: getL1Cache($, ctx),
    l2Cache: getL2Cache($, ctx),
    l3Cache: getL3Cache($, ctx),
    efficientCoreL1Cache: getEfficientCoreL1Cache($, ctx),
    efficientCoreL2Cache: getEfficientCoreL2Cache($, ctx),

    integratedGraphics: getIntegratedGraphics($, ctx),
    extensionsTechnologies: getExtensionsTechnologies($, ctx),
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

  return createCpuField({ field: 'architecture', value, ctx });
}

function getBaseClock($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Base Clock');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'baseClock', value, meta: { unit }, ctx });
}

function getBundledCooler($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Bundled Cooler');
  const value = values.join(', ') || null;

  return createCpuField({ field: 'bundledCooler', value, ctx });
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
  const value = chipsets;

  return createCpuField({ field: 'chipsets', value, ctx });
}

function getClock($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Frequency');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'clock', value, meta: { unit }, ctx });
}

function getCodename($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Codename');
  const value = values.join(', ') || null;

  return createCpuField({ field: 'codename', value, ctx });
}

function getCompany($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const fullName = $('.cpuname').text();
  const { company } = parseProductName(fullName);

  return createCpuField({ field: 'company', value: company, ctx });
}

function getCoresCount($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, '# of Cores');
  const [displayValue] = parseNumber(values[0] || null);
  const value = displayValue;

  return createCpuField({ field: 'coresCount', value, ctx });
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

  return createCpuField({ field: 'hasEccMemory', value, ctx });
}

function getEfficientCoreL1Cache($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'E-Core L1');
  const sanitizedValue = values[0]?.split(' ')[0];
  const [displayValue, displayUnit] = parseNumber(sanitizedValue || null);

  const formats: Record<string, MemorySizeUnit> = {
    K: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({
    field: 'efficientCoreL1Cache',
    value,
    meta: { unit },
    ctx,
  });
}

function getEfficientCoreL2Cache($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'E-Core L2');
  const sanitizedValue = values[0]?.split(' ')[0];
  const [displayValue, displayUnit] = parseNumber(sanitizedValue || null);

  const formats: Record<string, MemorySizeUnit> = {
    K: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({
    field: 'efficientCoreL2Cache',
    value,
    meta: { unit },
    ctx,
  });
}

function getEfficientCoreClock($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  if (!hasProductFieldValue(getEfficientCoresCount($, ctx))) {
    return createCpuField({ field: 'efficientCoreClock', value: null, ctx });
  }

  const values = tokenizeMultiLine($, 'E-Core Frequency').map((value) =>
    value.replace('up to', '').trim(),
  );

  // Doesn't have 2 values for this field. Cannot determine clock
  if (values.length !== 2) {
    return createCpuField({ field: 'efficientCoreClock', value: null, ctx });
  }

  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({
    field: 'efficientCoreClock',
    value,
    meta: { unit },
    ctx,
  });
}

function getEfficientCoreTurboClock(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
) {
  if (!hasProductFieldValue(getEfficientCoresCount($, ctx))) {
    return createCpuField({
      field: 'efficientCoreTurboClock',
      value: null,
      ctx,
    });
  }

  const values = tokenizeMultiLine($, 'E-Core Frequency').map((value) =>
    value.replace('up to', '').trim(),
  );

  // Doesn't have 2 values for this field. Cannot determine clock
  if (values.length !== 2) {
    return createCpuField({
      field: 'efficientCoreTurboClock',
      value: null,
      ctx,
    });
  }

  const [displayValue, displayUnit] = parseNumber(values[1] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({
    field: 'efficientCoreTurboClock',
    value,
    meta: { unit },
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

  const [displayValue] = parseNumber(textValue || null);
  const value = displayValue;

  return createCpuField({ field: 'efficientCoresCount', value, ctx });
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

  return createCpuField({ field: 'extensionsTechnologies', value: items, ctx });
}

function getFoundry($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Foundry');
  const value = values.join(', ') || null;

  return createCpuField({ field: 'foundry', value, ctx });
}

function getGeneration($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Generation');
  const value = values[0]?.trim();

  return createCpuField({ field: 'generation', value, ctx });
}

function getIntegratedGraphics($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Integrated Graphics');
  const value = values[0]?.trim();
  if (value?.toLowerCase() === 'n/a') {
    return createCpuField({ field: 'integratedGraphics', value: null, ctx });
  }

  return createCpuField({ field: 'integratedGraphics', value, ctx });
}

function getL1Cache($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Cache L1');
  const sanitizedValue = values[0]?.split(' ')[0];
  const [displayValue, displayUnit] = parseNumber(sanitizedValue || null);

  const formats: Record<string, MemorySizeUnit> = {
    K: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'l1Cache', value, meta: { unit }, ctx });
}

function getL2Cache($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Cache L2');
  const sanitizedValue = values[0]?.split(' ')[0];
  const [displayValue, displayUnit] = parseNumber(sanitizedValue || null);

  const formats: Record<string, MemorySizeUnit> = {
    K: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'l2Cache', value, meta: { unit }, ctx });
}

function getL3Cache($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Cache L3');
  const sanitizedValue = values[0]?.split(' ')[0];
  const [displayValue, displayUnit] = parseNumber(sanitizedValue || null);

  const formats: Record<string, MemorySizeUnit> = {
    K: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'l3Cache', value, meta: { unit }, ctx });
}

function getLaunchPrice($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Launch Price');
  const [displayValue, displayCurrency] = parseNumber(values[0] || null);

  const formats: Record<string, string> = {
    USD: 'usd',
  };

  const currency = formats[displayCurrency] || null;
  const value = displayValue;

  return createCpuField({
    field: 'launchPrice',
    value,
    meta: { currency },
    ctx,
  });
}

function getMarketSegment($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  let marketSegment: CpuMarketSegmentValue = null;
  if (isDesktopMarketSegment($)) {
    marketSegment = CpuMarketSegmentValue.Desktop;
  } else if (isMobileMarketSegment($)) {
    marketSegment = CpuMarketSegmentValue.Mobile;
  }
  if (isWorkstationMarketSegment($)) {
    marketSegment = CpuMarketSegmentValue.Workstation;
  }
  if (isServerMarketSegment($)) {
    marketSegment = CpuMarketSegmentValue.Server;
  }
  if (isEmbeddedMarketSegment($)) {
    marketSegment = CpuMarketSegmentValue.Embedded;
  }

  return createCpuField({
    field: 'marketSegment',
    value: marketSegment,
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
  const values = tokenizeMultiLine($, 'Memory Support');

  let value: number = null;
  for (let i = 0; i < values.length; ++i) {
    const channels = convertToCpuMemoryChannelNumber(values[i]);
    if (channels != null) {
      value = channels;
      break;
    }
  }

  return createCpuField({ field: 'memoryChannels', value, ctx });
}

function getMemorySupport($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const value: string[] = [];
  const memoryTypes = new Set<string>();

  const ddr4SpeedValues = tokenizeMultiLine($, 'DDR4 Speed');
  const [ddr4Speed] = parseNumber(ddr4SpeedValues[0]);
  if (ddr4Speed != null) {
    value.push(`DDR4-${ddr4Speed}`);
    memoryTypes.add('ddr4');
  }

  const ddr5SpeedValues = tokenizeMultiLine($, 'DDR5 Speed');
  const [ddr5Speed] = parseNumber(ddr5SpeedValues[0]);
  if (ddr5Speed != null) {
    value.push(`DDR5-${ddr5Speed}`);
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
          value.push(results[0]);
          memoryTypes.add(lcMemoryType);
        }
        continue;
      }
    }
  }

  return createCpuField({ field: 'memorySupport', value, ctx });
}

function getMultiplier($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Multiplier');
  const [displayValue] = parseNumber(values[0] || null);
  const value = displayValue;

  return createCpuField({ field: 'multiplier', value, ctx });
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

  return createCpuField({ field: 'isMultiplierUnlocked', value, ctx });
}

function getName($: cheerio.CheerioAPI) {
  const fullName = $('.cpuname').text();
  const { company } = parseProductName(fullName);

  return fullName.substring(company?.length || 0).trim();
}

function getPartNumber($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Part#');
  const value = values.join(', ') || null;

  return createCpuField({ field: 'partNumber', value, ctx });
}

function getPciExpress($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const primaryPciValues = tokenizeMultiLine($, 'PCI-Express');
  const secondaryPciValues = tokenizeMultiLine($, 'Secondary PCIe');
  const pciExpressData = [...primaryPciValues, ...secondaryPciValues];

  const versionRegex = /Gen (\d+)/;
  const lanesRegex = /(\d+) Lanes/;

  const value: string[] = [];
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
    value.push(pciExpressValue);
  }

  return createCpuField({ field: 'pciExpress', value, ctx });
}

function getPerformanceCoreClock($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  if (!hasProductFieldValue(getPerformanceCoresCount($, ctx))) {
    return createCpuField({ field: 'performanceCoreClock', value: null, ctx });
  }

  const ret = getClock($, ctx);
  if (ret != null) {
    ret.meta.fieldKey = 'performanceCoreClock';
  }
  return ret;
}

function getPerformanceCoreTurboClock(
  $: cheerio.CheerioAPI,
  ctx?: ScraperContext,
) {
  if (!hasProductFieldValue(getPerformanceCoresCount($, ctx))) {
    return createCpuField({
      field: 'performanceCoreTurboClock',
      value: null,
      ctx,
    });
  }

  const ret = getTurboClock($, ctx);
  if (ret != null) {
    ret.meta.fieldKey = 'performanceCoreTurboClock';
  }
  return ret;
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

  const [displayValue] = parseNumber(textValue || null);
  const value = displayValue;

  return createCpuField({ field: 'performanceCoresCount', value, ctx });
}

function getPl1($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'PL1');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'pl1', value, meta: { unit }, ctx });
}

function getPl2($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'PL2');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'pl2', value, meta: { unit }, ctx });
}

function getPpt($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'PPT');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'ppt', value, meta: { unit }, ctx });
}

function getProcessSize($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Process Size');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };
  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'processSize', value, meta: { unit }, ctx });
}

function getProductionStatus($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Production Status');
  const productionStatus = values
    .map((value) => {
      const lcValue = value?.toLowerCase();
      if (lcValue === 'active') {
        return CpuProductionStatusValue.Active;
      } else if (lcValue === 'unreleased') {
        return CpuProductionStatusValue.Unreleased;
      } else if (lcValue === 'end-of-life') {
        return CpuProductionStatusValue.EndOfLife;
      } else {
        return null;
      }
    })
    .filter((value) => value != null);

  return createCpuField({
    field: 'productionStatus',
    value: productionStatus[0] || null,
    ctx,
  });
}

function getReleaseDate($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const availabilityValues = tokenizeMultiLine($, 'Availability');
  const releaseDateValues = tokenizeMultiLine($, 'Release Date');

  let value: string = null;
  let format: DateFormat = null;

  if (value == null) {
    value = parseDate(availabilityValues?.[0], 'MMM do, yyyy');
    format = value != null ? DateFormat.QuarterYear : null;
  }
  if (value == null) {
    value = parseDate(releaseDateValues?.[0], 'MMM do, yyyy');
    format = value != null ? DateFormat.QuarterYear : null;
  }

  if (value == null) {
    value = parseDate(availabilityValues?.[0], 'MMM yyyy', {
      endOfMonth: true,
    });
    format = value != null ? DateFormat.QuarterYear : null;
  }
  if (value == null) {
    value = parseDate(releaseDateValues?.[0], 'MMM yyyy', {
      endOfMonth: true,
    });
    format = value != null ? DateFormat.QuarterYear : null;
  }

  if (value == null) {
    value = parseDate(availabilityValues?.[0], 'yyyy', {
      endOfYear: true,
    });
    format = value != null ? DateFormat.Year : null;
  }
  if (value == null) {
    value = parseDate(releaseDateValues?.[0], 'yyyy', { endOfYear: true });
    format = value != null ? DateFormat.Year : null;
  }

  return createCpuField({
    field: 'releaseDate',
    value,
    meta: { dateFormat: format },
    ctx,
  });
}

function getSocket($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Socket');
  const value = values.join(', ') || null;

  return createCpuField({ field: 'socket', value, ctx });
}

function getTCaseMax($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'tCaseMax');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, TemperatureUnit> = {
    '°C': TemperatureUnit.c,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'tCaseMax', value, meta: { unit }, ctx });
}

function getTdp($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'TDP');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'tdp', value, meta: { unit }, ctx });
}

function getThreadsCount($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, '# of Threads');
  const [displayValue] = parseNumber(values[0] || null);
  const value = displayValue;

  return createCpuField({ field: 'threadsCount', value, ctx });
}

function getTjMax($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'tJMax');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, TemperatureUnit> = {
    '°C': TemperatureUnit.c,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'tjMax', value, meta: { unit }, ctx });
}

function getTransistors($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Transistors');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, NumericUnit> = {
    million: NumericUnit.million,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'transistors', value, meta: { unit }, ctx });
}

function getTurboClock($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const values = tokenizeMultiLine($, 'Turbo Clock').map((value) =>
    value.replace('up to', '').trim(),
  );
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField({ field: 'turboClock', value, meta: { unit }, ctx });
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
    .filter((value) => value.toLowerCase() !== 'none')
    .filter((value) => value.toLowerCase() !== 'unknown')
    .filter((value) => value.toLowerCase() !== 'n/a');
}

function parseNumber(value: string): [number, string] {
  if (value == null) {
    return [null, null];
  }

  if (value.trim().toLowerCase() === 'n/a') {
    return [null, null];
  }

  try {
    const sanitizedValue = value.trim().replace(',', '');

    const [base] = sanitizedValue.match(/[.0-9]+/);
    const unit = sanitizedValue.slice(base.length).trim();
    const baseNumber = Number(base);
    return [baseNumber, unit || null];
  } catch (e) {
    console.error(`Cannot parse number: ${value}`);
    console.error((e as Error).stack);
    return [null, null];
  }
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
