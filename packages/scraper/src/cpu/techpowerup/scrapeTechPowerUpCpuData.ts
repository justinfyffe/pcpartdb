import {
  ClockSpeedUnit,
  convertToCpuMemoryChannelNumber,
  Cpu,
  CpuFieldKey,
  CpuFieldMeta,
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

export interface ScrapeTechPowerUpCpuDataOptions {
  url: string;
  noProxy?: boolean;
}

export async function scrapeTechPowerUpCpuData(
  options: ScrapeTechPowerUpCpuDataOptions,
) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const product: Partial<Cpu> = {
    name: getName($),
    partNumber: getPartNumber($),
    company: getCompany($),
    marketSegments: getMarketSegments($),
    launchPrice: getLaunchPrice($),
    releaseDate: getReleaseDate($),
    productionStatus: getProductionStatus($),
    bundledCooler: getBundledCooler($),

    socket: getSocket($),
    foundry: getFoundry($),
    processSize: getProcessSize($),
    transistors: getTransistors($),
    tCaseMax: getTCaseMax($),
    tjMax: getTjMax($),

    architecture: getArchitecture($),
    codename: getCodename($),
    generation: getGeneration($),
    pciExpress: getPciExpress($),
    chipsets: getChipsets($),

    memorySupport: getMemorySupport($),
    memoryChannels: getMemoryChannels($),
    hasEccMemory: getEccMemory($),

    coresCount: getCoresCount($),
    threadsCount: getThreadsCount($),
    performanceCoresCount: getPerformanceCoresCount($),
    efficientCoresCount: getEfficientCoresCount($),
    clock: getClock($),
    turboClock: getTurboClock($),
    performanceCoreClock: getPerformanceCoreClock($),
    performanceCoreTurboClock: getPerformanceCoreTurboClock($),
    efficientCoreClock: getEfficientCoreClock($),
    efficientCoreTurboClock: getEfficientCoreTurboClock($),
    baseClock: getBaseClock($),
    multiplier: getMultiplier($),
    isMultiplierUnlocked: getMultiplierUnlocked($),

    tdp: getTdp($),
    pl1: getPl1($),
    pl2: getPl2($),
    ppt: getPpt($),

    l1Cache: getL1Cache($),
    l2Cache: getL2Cache($),
    l3Cache: getL3Cache($),
    efficientCoreL1Cache: getEfficientCoreL1Cache($),
    efficientCoreL2Cache: getEfficientCoreL2Cache($),

    integratedGraphics: getIntegratedGraphics($),
    extensionsTechnologies: getExtensionsTechnologies($),
  };

  return { product } as ScrapeProductResponse;
}

function getArchitecture($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Generation');
  let value = values[1]?.trim();
  if (value?.startsWith('(')) {
    value = value.substring(1);
  }
  if (value?.endsWith(')')) {
    value = value.substring(0, value.length - 1);
  }
  value = value.replaceAll(/\(.*\)/g, '').trim();

  return createCpuField('architecture', value);
}

function getBaseClock($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Base Clock');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('baseClock', value, { unit });
}

function getBundledCooler($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Bundled Cooler');
  const value = values.join(', ') || null;

  return createCpuField('bundledCooler', value);
}

function getChipsets($: cheerio.CheerioAPI) {
  const values1 = tokenizeMultiLine($, 'Chipset');
  const values2 = tokenizeMultiLine($, 'Chipsets');
  const values = values1.length > 0 ? values1 : values2;

  const chipsets =
    values?.[0]
      ?.split(',')
      .map((value) => value.trim().replace('*', ''))
      .filter((value) => value.length > 0) || [];
  const value = chipsets;

  return createCpuField('chipsets', value);
}

function getClock($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Frequency');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('clock', value, { unit });
}

function getCodename($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Codename');
  const value = values.join(', ') || null;

  return createCpuField('codename', value);
}

function getCompany($: cheerio.CheerioAPI) {
  const fullName = $('.cpuname').text();
  const { company } = parseProductName(fullName);

  return createCpuField('company', company);
}

function getCoresCount($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, '# of Cores');
  const [displayValue] = parseNumber(values[0] || null);
  const value = displayValue;

  return createCpuField('coresCount', value);
}

function getEccMemory($: cheerio.CheerioAPI) {
  const text = tokenizeMultiLine($, 'ECC Memory');
  const textTrimmed = text[0]?.trim().toLowerCase();

  let value: boolean = null;
  if (textTrimmed === 'yes') {
    value = true;
  } else if (textTrimmed === 'no') {
    value = false;
  }

  return createCpuField('hasEccMemory', value);
}

function getEfficientCoreL1Cache($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'E-Core L1');
  const sanitizedValue = values[0]?.split(' ')[0];
  const [displayValue, displayUnit] = parseNumber(sanitizedValue || null);

  const formats: Record<string, MemorySizeUnit> = {
    K: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('efficientCoreL1Cache', value, { unit });
}

function getEfficientCoreL2Cache($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'E-Core L2');
  const sanitizedValue = values[0]?.split(' ')[0];
  const [displayValue, displayUnit] = parseNumber(sanitizedValue || null);

  const formats: Record<string, MemorySizeUnit> = {
    K: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('efficientCoreL2Cache', value, { unit });
}

function getEfficientCoreClock($: cheerio.CheerioAPI) {
  if (!hasProductFieldValue(getEfficientCoresCount($))) {
    return createCpuField('efficientCoreClock', null);
  }

  const values = tokenizeMultiLine($, 'E-Core Frequency').map((value) =>
    value.replace('up to', '').trim(),
  );

  // Doesn't have 2 values for this field. Cannot determine clock
  if (values.length !== 2) {
    return createCpuField('efficientCoreClock', null);
  }

  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('efficientCoreClock', value, { unit });
}

function getEfficientCoreTurboClock($: cheerio.CheerioAPI) {
  if (!hasProductFieldValue(getEfficientCoresCount($))) {
    return createCpuField('efficientCoreTurboClock', null);
  }

  const values = tokenizeMultiLine($, 'E-Core Frequency').map((value) =>
    value.replace('up to', '').trim(),
  );

  // Doesn't have 2 values for this field. Cannot determine clock
  if (values.length !== 2) {
    return createCpuField('efficientCoreTurboClock', null);
  }

  const [displayValue, displayUnit] = parseNumber(values[1] || null);

  const formats: Record<string, ClockSpeedUnit> = {
    KHz: ClockSpeedUnit.khz,
    MHz: ClockSpeedUnit.mhz,
    GHz: ClockSpeedUnit.ghz,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('efficientCoreTurboClock', value, { unit });
}

function getEfficientCoresCount($: cheerio.CheerioAPI) {
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

  return createCpuField('efficientCoresCount', value);
}

function getExtensionsTechnologies($: cheerio.CheerioAPI) {
  const items =
    $('ul.features li')
      .map((_i, li) => $(li).text().trim())
      .get()
      .filter((text) => text != null && text.length > 0) || [];

  return createCpuField('extensionsTechnologies', items);
}

function getFoundry($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Foundry');
  const value = values.join(', ') || null;

  return createCpuField('foundry', value);
}

function getGeneration($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Generation');
  const value = values[0]?.trim();

  return createCpuField('generation', value);
}

function getIntegratedGraphics($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Integrated Graphics');
  const value = values[0]?.trim();
  if (value?.toLowerCase() === 'n/a') {
    return createCpuField('integratedGraphics', null);
  }

  return createCpuField('integratedGraphics', value);
}

function getL1Cache($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Cache L1');
  const sanitizedValue = values[0]?.split(' ')[0];
  const [displayValue, displayUnit] = parseNumber(sanitizedValue || null);

  const formats: Record<string, MemorySizeUnit> = {
    K: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('l1Cache', value, { unit });
}

function getL2Cache($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Cache L2');
  const sanitizedValue = values[0]?.split(' ')[0];
  const [displayValue, displayUnit] = parseNumber(sanitizedValue || null);

  const formats: Record<string, MemorySizeUnit> = {
    K: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('l2Cache', value, { unit });
}

function getL3Cache($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Cache L3');
  const sanitizedValue = values[0]?.split(' ')[0];
  const [displayValue, displayUnit] = parseNumber(sanitizedValue || null);

  const formats: Record<string, MemorySizeUnit> = {
    K: MemorySizeUnit.kb,
    MB: MemorySizeUnit.mb,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('l3Cache', value, { unit });
}

function getLaunchPrice($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Launch Price');
  const [displayValue, displayCurrency] = parseNumber(values[0] || null);

  const formats: Record<string, string> = {
    USD: 'usd',
  };

  const currency = formats[displayCurrency] || null;
  const value = displayValue;

  return createCpuField('launchPrice', value, { currency });
}

function getMarketSegments($: cheerio.CheerioAPI) {
  const marketSegments: CpuMarketSegmentValue[] = [];
  if (isDesktopMarketSegment($)) {
    marketSegments.push(CpuMarketSegmentValue.Desktop);
  }
  if (isMobileMarketSegment($)) {
    marketSegments.push(CpuMarketSegmentValue.Mobile);
  }
  if (isWorkstationMarketSegment($)) {
    marketSegments.push(CpuMarketSegmentValue.Workstation);
  }
  if (isServerMarketSegment($)) {
    marketSegments.push(CpuMarketSegmentValue.Server);
  }
  if (isEmbeddedMarketSegment($)) {
    marketSegments.push(CpuMarketSegmentValue.Embedded);
  }

  return createCpuField('marketSegments', marketSegments);
}

function isDesktopMarketSegment($: cheerio.CheerioAPI) {
  const name = getName($).toLowerCase();
  const marketSegments = tokenizeMultiLine($, 'Market')
    .map((value) => value.toLowerCase())
    .filter((value) => value != null);

  if (marketSegments.includes('desktop')) {
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
  const marketSegments = tokenizeMultiLine($, 'Market')
    .map((value) => value.toLowerCase())
    .filter((value) => value != null);

  if (marketSegments.includes('mobile')) {
    return true;
  }

  return false;
}

function isWorkstationMarketSegment($: cheerio.CheerioAPI) {
  const name = getName($).toLowerCase();
  const marketSegments = tokenizeMultiLine($, 'Market')
    .map((value) => value.toLowerCase())
    .filter((value) => value != null);

  // Handle edge cases where desktop cpus are mislabeled as workstations
  if (marketSegments.includes('desktop')) {
    if (name.includes(' pro-') || name.includes(' pro ')) {
      return true;
    }

    return false;
  }

  if (!marketSegments.includes('server/workstation')) {
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
  const marketSegments = tokenizeMultiLine($, 'Market')
    .map((value) => value.toLowerCase())
    .filter((value) => value != null);

  if (!marketSegments.includes('server/workstation')) {
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

function getMemoryChannels($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Memory Support');

  let value: number = null;
  for (let i = 0; i < values.length; ++i) {
    const channels = convertToCpuMemoryChannelNumber(values[i]);
    if (channels != null) {
      value = channels;
      break;
    }
  }

  return createCpuField('memoryChannels', value);
}

function getMemorySupport($: cheerio.CheerioAPI) {
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

  return createCpuField('memorySupport', value);
}

function getMultiplier($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Multiplier');
  const [displayValue] = parseNumber(values[0] || null);
  const value = displayValue;

  return createCpuField('multiplier', value);
}

function getMultiplierUnlocked($: cheerio.CheerioAPI) {
  const text = tokenizeMultiLine($, 'Multiplier Unlocked');
  const textTrimmed = text[0]?.trim().toLowerCase();

  let value: boolean = null;
  if (textTrimmed === 'yes') {
    value = true;
  } else if (textTrimmed === 'no') {
    value = false;
  }

  return createCpuField('isMultiplierUnlocked', value);
}

function getName($: cheerio.CheerioAPI) {
  const fullName = $('.cpuname').text();
  const company = getCompany($)?.value ?? '';

  return fullName.substring(company.length).trim();
}

function getPartNumber($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Part#');
  const value = values.join(', ') || null;

  return createCpuField('partNumber', value);
}

function getPciExpress($: cheerio.CheerioAPI) {
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

  return createCpuField('pciExpress', value);
}

function getPerformanceCoreClock($: cheerio.CheerioAPI) {
  if (!hasProductFieldValue(getPerformanceCoresCount($))) {
    return createCpuField('performanceCoreClock', null);
  }

  const ret = getClock($);
  if (ret != null) {
    ret.meta.fieldKey = 'performanceCoreClock';
  }
  return ret;
}

function getPerformanceCoreTurboClock($: cheerio.CheerioAPI) {
  if (!hasProductFieldValue(getPerformanceCoresCount($))) {
    return createCpuField('performanceCoreTurboClock', null);
  }

  const ret = getTurboClock($);
  if (ret != null) {
    ret.meta.fieldKey = 'performanceCoreTurboClock';
  }
  return ret;
}

function getPerformanceCoresCount($: cheerio.CheerioAPI) {
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

  return createCpuField('performanceCoresCount', value);
}

function getPl1($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'PL1');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('pl1', value, { unit });
}

function getPl2($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'PL2');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('pl2', value, { unit });
}

function getPpt($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'PPT');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('ppt', value, { unit });
}

function getProcessSize($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Process Size');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, LengthUnit> = {
    μm: LengthUnit.um,
    nm: LengthUnit.nm,
    mm: LengthUnit.mm,
  };
  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('processSize', value, { unit });
}

function getProductionStatus($: cheerio.CheerioAPI) {
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

  return createCpuField('productionStatus', productionStatus[0] || null);
}

function getReleaseDate($: cheerio.CheerioAPI) {
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

  return createCpuField('releaseDate', value, { dateFormat: format });
}

function getSocket($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Socket');
  const value = values.join(', ') || null;

  return createCpuField('socket', value);
}

function getTCaseMax($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'tCaseMax');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, TemperatureUnit> = {
    '°C': TemperatureUnit.c,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('tCaseMax', value, { unit });
}

function getTdp($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'TDP');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, WattageUnit> = {
    W: WattageUnit.w,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('tdp', value, { unit });
}

function getThreadsCount($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, '# of Threads');
  const [displayValue] = parseNumber(values[0] || null);
  const value = displayValue;

  return createCpuField('threadsCount', value);
}

function getTjMax($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'tJMax');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, TemperatureUnit> = {
    '°C': TemperatureUnit.c,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('tjMax', value, { unit });
}

function getTransistors($: cheerio.CheerioAPI) {
  const values = tokenizeMultiLine($, 'Transistors');
  const [displayValue, displayUnit] = parseNumber(values[0] || null);

  const formats: Record<string, NumericUnit> = {
    million: NumericUnit.million,
  };

  const unit = formats[displayUnit] || null;
  const value = getBaseUnitValue(displayValue, unit);

  return createCpuField('transistors', value, { unit });
}

function getTurboClock($: cheerio.CheerioAPI) {
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

  return createCpuField('turboClock', value, { unit });
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

function createCpuField<T = unknown>(
  fieldKey: CpuFieldKey,
  value: T,
  meta?: CpuFieldMeta,
) {
  const productField = {
    value,
    meta: { ...(meta ?? {}), fieldKey, autoUpdate: true },
  };

  if (!hasProductFieldValue(productField)) {
    productField.value = null;
  }

  return productField;
}
