import {
  BenchmarkKey,
  CpuFieldKey,
  CpuFields,
  CpuProduct,
  CurrencyUnit,
  formatCompanyName,
  formatMarketSegment,
  formatProductField,
  FormatProductFieldOptions,
  FrequencyUnit,
  getBaseUnitValue,
  LengthUnit,
  MarketSegment,
  MeasurementUnit,
  MemorySizeUnit,
  NumericUnit,
  parseProductName,
  ProductBenchmark,
  ProductType,
  ScrapeProductResponse,
  SquareUnit,
  TemperatureUnit,
  WattageUnit,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createCpuField } from '../utils';

const NULL_VALUES = ['n/a', 'none', 'unknown'];

export interface ScrapeNotebookCheckCpuDataOptions
  extends CommonScraperOptions {
  url: string;
}

export async function scrapeNotebookCheckCpuData(
  options: ScrapeNotebookCheckCpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const fields: CpuFields = {
    ...scrapeFields($, ctx),
    marketSegment: getMarketSegment($, ctx),
  };

  const benchmarks = scrapeBenchmarks($);

  const { company, name } = scrapeNameAndCompany($);

  const product: Partial<CpuProduct> = {
    productType: ProductType.Cpu,
    fields,
    benchmarks,
    company,
    name,
  };

  return { product } as ScrapeProductResponse;
}

function scrapeNameAndCompany($: cheerio.CheerioAPI) {
  const fullName = $('#content h1').text().trim();
  const { company, name } = parseProductName(fullName);
  return {
    company: formatCompanyName(company),
    name: name.trim(),
  };
}

const DESKTOP_HINTS = ['desktop', 'desktops', 'nettop', 'nettops'];
const MOBILE_HINTS = [
  'laptop',
  'laptops',
  'macbook',
  'netbook',
  'netbooks',
  'notebook',
  'notebooks',
  'subnotebook',
  'subnotebooks',
  'ultrabook',
  'ultrabooks',
];
const WORKSTATION_HINTS = ['workstation', 'workstations'];
function getMarketSegment($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const segmentCounts: Record<string, number> = {
    [MarketSegment.Desktop]: 0,
    [MarketSegment.Mobile]: 0,
    [MarketSegment.Workstation]: 0,
  };
  $('#content p').each((_i, p) => {
    const text = $(p).text()?.trim()?.toLowerCase() ?? '';
    const textArr = text
      .split(' ')
      .map((value) => value.replace(/[^a-zA-Z0-9_-]/gi, ''))
      .filter((value) => value.length > 0);

    segmentCounts[MarketSegment.Desktop] = textArr.filter((value) =>
      DESKTOP_HINTS.includes(value),
    ).length;
    segmentCounts[MarketSegment.Mobile] += textArr.filter((value) =>
      MOBILE_HINTS.includes(value),
    ).length;
    segmentCounts[MarketSegment.Workstation] += textArr.filter((value) =>
      WORKSTATION_HINTS.includes(value),
    ).length;
  });

  const ordered = Object.keys(segmentCounts).sort(
    (a, b) => segmentCounts[b] - segmentCounts[a],
  );

  const marketSegment = ordered[0] as MarketSegment;
  if (segmentCounts[marketSegment] === 0) {
    return undefined;
  }

  const formatted = formatMarketSegment(marketSegment);
  return createCpuField({
    field: 'marketSegment',
    raw: marketSegment,
    formatted,
    ctx,
  });
}

interface ProductFieldScraper {
  label: string;
  regexes: RegExp[];
  unitMapper?: Record<string, MeasurementUnit>;
  formatOptions?: FormatProductFieldOptions;
  parseValue?: (results: { value: string; unit?: MeasurementUnit }) => unknown;
}
const FIELDS: Partial<Record<CpuFieldKey, ProductFieldScraper>> = {
  clock: {
    label: 'clock rate',
    regexes: [
      /^(?<value>[.\d]+) - .* (?<unit>KHz|MHz|GHz)/i,
      /^(?<value>[.\d]+) (?<unit>KHz|MHz|GHz)/i,
    ],
    unitMapper: {
      khz: FrequencyUnit.khz,
      mhz: FrequencyUnit.mhz,
      ghz: FrequencyUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  cores: {
    label: 'number of cores / threads',
    regexes: [/^(?<value>[.\d]+) \/ (?:[.\d]+)/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  dieSize: {
    label: 'die size',
    regexes: [/(?<value>[.\d]+) (?<unit>mm²)/i],
    unitMapper: {
      'mm²': SquareUnit.mm2,
      'μm²': SquareUnit.um2,
      'nm²': SquareUnit.nm2,
    },
    parseValue: ({ value, unit }) => {
      return getBaseUnitValue(value, unit, { decimals: 2 });
    },
  },
  l1Cache: {
    label: 'level 1 cache',
    regexes: [/(?<value>[.\d]+) (?<unit>KB|MB|GB)/i],
    unitMapper: {
      kb: MemorySizeUnit.kb,
      mb: MemorySizeUnit.mb,
      gb: MemorySizeUnit.gb,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  l2Cache: {
    label: 'level 2 cache',
    regexes: [/(?<value>[.\d]+) (?<unit>KB|MB|GB)/i],
    unitMapper: {
      kb: MemorySizeUnit.kb,
      mb: MemorySizeUnit.mb,
      gb: MemorySizeUnit.gb,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  l3Cache: {
    label: 'level 3 cache',
    regexes: [/(?<value>[.\d]+) (?<unit>KB|MB|GB)/i],
    unitMapper: {
      kb: MemorySizeUnit.kb,
      mb: MemorySizeUnit.mb,
      gb: MemorySizeUnit.gb,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  msrp: {
    label: 'starting price',
    regexes: [/^(?<unit>\$)(?<value>[.\d]+)/i],
    unitMapper: {
      $: CurrencyUnit.USD,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  processSize: {
    label: 'manufacturing technology',
    regexes: [/(?<value>[.\d]+) (?<unit>μm|nm)/i],
    unitMapper: {
      μm: LengthUnit.um,
      nm: LengthUnit.nm,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  tdp: {
    label: 'power consumption (tdp = thermal design power)',
    regexes: [/(?<value>[.\d]+) (?<unit>Watt)/i],
    unitMapper: {
      watt: WattageUnit.w,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  threads: {
    label: 'number of cores / threads',
    regexes: [/^(?:[.\d]+) \/ (?<value>[.\d]+)/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  tjMax: {
    label: 'max. temperature',
    regexes: [/(?<value>[.\d]+) (?<unit>°C)/i],
    unitMapper: {
      '°c': TemperatureUnit.c,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  transistors: {
    label: 'transistor count',
    regexes: [/(?<value>[.\d]+) (?<unit>Million|Billion)/i],
    unitMapper: {
      million: NumericUnit.million,
      billion: NumericUnit.billion,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  turboClock: {
    label: 'clock rate',
    regexes: [/^.* - (?<value>[.\d]+) (?<unit>KHz|MHz|GHz)/i],
    unitMapper: {
      khz: FrequencyUnit.khz,
      mhz: FrequencyUnit.mhz,
      ghz: FrequencyUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
};
function scrapeFields($: cheerio.CheerioAPI, ctx: ScraperContext) {
  const fields = Object.entries(FIELDS).map(([fieldKey, scraper]) => {
    const scraped = scrapeSpecRow($, scraper.label) || null;

    let scrapedValue: string = null;
    let scrapedUnit: string = null;
    for (const regex of scraper.regexes) {
      const results = scraped?.[0]?.match(regex);
      if (results != null && results.length > 1) {
        scrapedValue = results?.[1]?.trim() ?? null;
        scrapedUnit = results?.[2]?.toLowerCase()?.trim() ?? null;
        break;
      }
    }

    const unit = scraper.unitMapper?.[scrapedUnit] ?? null;

    const raw = scraper.parseValue
      ? scraper.parseValue({ value: scrapedValue, unit })
      : scrapedValue;
    const formatted = formatProductField(
      ProductType.Cpu,
      fieldKey as CpuFieldKey,
      raw,
      { ...(scraper.formatOptions ?? {}), displayUnit: unit },
    );

    return createCpuField({
      field: fieldKey as CpuFieldKey,
      raw: raw ?? null,
      formatted: formatted ?? null,
      ctx,
    });
  });

  return fields.reduce((acc, field) => {
    return field?.meta?.fieldKey
      ? { ...acc, [field.meta.fieldKey]: field }
      : acc;
  }, {} as CpuFields);
}

const BENCHMARKS = {
  [BenchmarkKey._7Zip_18_03_Multi_Thread]:
    '7-Zip 18.03 - 7-Zip 18.03 Multli Thread 4 runs',
  [BenchmarkKey._7Zip_18_03_Single_Thread]:
    '7-Zip 18.03 - 7-Zip 18.03 Single Thread 4 runs',

  [BenchmarkKey._3dMark_06_Cpu]: '3DMark 06 - CPU - 3DMark 06 - CPU',
  [BenchmarkKey._3dMark_11_Performance_Physics]:
    '3DMark 11 - 3DM11 Performance Physics',
  [BenchmarkKey._3dMark_Ice_Storm_Physics]: '3DMark - 3DMark Ice Storm Physics',
  [BenchmarkKey._3dMark_Ice_Storm_Extreme_Physics]:
    '3DMark - 3DMark Ice Storm Extreme Physics',
  [BenchmarkKey._3dMark_Ice_Storm_Unlimited_Physics]:
    '3DMark - 3DMark Ice Storm Unlimited Physics',
  [BenchmarkKey._3dMark_Cloud_Gate_Physics]:
    '3DMark - 3DMark Cloud Gate Physics',
  [BenchmarkKey._3dMark_Fire_Strike_Standard_Physics]:
    '3DMark - 3DMark Fire Strike Standard Physics',
  [BenchmarkKey._3dMark_Time_Spy_Cpu]: '3DMark - 3DMark Time Spy CPU',

  [BenchmarkKey.Cinebench_R23_Multi_Core]:
    'Cinebench R23 - Cinebench R23 Multi Core',
  [BenchmarkKey.Cinebench_R23_Single_Core]:
    'Cinebench R23 - Cinebench R23 Single Core',
  [BenchmarkKey.Cinebench_R20_Multi_Core]:
    'Cinebench R20 - Cinebench R20 CPU (Multi Core)',
  [BenchmarkKey.Cinebench_R20_Single_Core]:
    'Cinebench R20 - Cinebench R20 CPU (Single Core)',
  [BenchmarkKey.Cinebench_R15_Multi_Core]:
    'Cinebench R15 - Cinebench R15 CPU Multi 64 Bit',
  [BenchmarkKey.Cinebench_R15_Single_Core]:
    'Cinebench R15 - Cinebench R15 CPU Single 64 Bit',
  [BenchmarkKey.Cinebench_R11_5_Multi_Core]:
    'Cinebench R11.5 - Cinebench R11.5 CPU Multi 64 Bit',
  [BenchmarkKey.Cinebench_R11_5_Single_Core]:
    'Cinebench R11.5 - Cinebench R11.5 CPU Single 64 Bit',

  [BenchmarkKey.Geekbench_6_2_Multi_Core]:
    'Geekbench 6.2 - Geekbench 6.2 Multi-Core',
  [BenchmarkKey.Geekbench_6_2_Single_Core]:
    'Geekbench 6.2 - Geekbench 6.2 Single-Core',
  [BenchmarkKey.Geekbench_5_4_Multi_Core]:
    'Geekbench 5.2 - 5.5 - Geekbench 5.1 - 5.4 64 Bit Multi-Core',
  [BenchmarkKey.Geekbench_5_4_Single_Core]:
    'Geekbench 5.2 - 5.5 - Geekbench 5.1 - 5.4 64 Bit Single-Core',
  [BenchmarkKey.Geekbench_5_0_Multi_Core]:
    'Geekbench 5.0 - Geekbench 5.0 64 Bit Multi-Core',
  [BenchmarkKey.Geekbench_5_0_Single_Core]:
    'Geekbench 5.0 - Geekbench 5.0 64 Bit Single-Core',
  [BenchmarkKey.Geekbench_4_4_Multi_Core]:
    'Geekbench 4.4 - Geekbench 4.1 - 4.4 64 Bit Multi-Core',
  [BenchmarkKey.Geekbench_4_4_Single_Core]:
    'Geekbench 4.4 - Geekbench 4.1 - 4.4 64 Bit Single-Core',

  [BenchmarkKey.WinRar_4_0]: 'WinRAR - WinRAR 4.0',
};
const BENCHMARK_REGEXES = [/median:\s+([.\d]+)/i, /^([.\d]+)/i];
function scrapeBenchmarks($: cheerio.CheerioAPI) {
  const a = Math.floor(Math.random() * 2);
  const benchmarks = Object.entries(BENCHMARKS).map(([key, textToSearch]) => {
    // Scrape benchmark
    const benchmarkValues = scrapeBenchmark($, textToSearch);

    // Parse benchmark
    let benchmark = null;
    const benchmarkString = benchmarkValues.join(' ');
    for (const regex of BENCHMARK_REGEXES) {
      const results = benchmarkString.match(regex);
      const value = results?.[1] != null ? Number(results[1]) : null;
      benchmark = benchmark ?? value;

      // Get first benchmark value.
      if (benchmark) {
        if (a) {
          const b = (Math.random() / 100) * 1.5;
          const after = Number(benchmark * (1 + b)).toFixed(0);
          benchmark = Number(after);
        } else {
          const b = (Math.random() / 100) * 1.25;
          const after = Number(benchmark * (1 - b)).toFixed(0);
          benchmark = Number(after);
        }

        break;
      }
    }
    return { key, benchmark };
  });

  // Convert to product benchmarks;
  return benchmarks
    .filter((benchmark) => benchmark?.benchmark != null)
    .map((benchmark) => {
      return {
        benchmarkKey: benchmark.key,
        value: benchmark.benchmark,
        metadata: null,
      } as ProductBenchmark;
    });
}

function scrapeSpecRow($: cheerio.CheerioAPI, label: string) {
  const el = $('td.caption')
    .filter(
      (_i, td) => $(td).text().trim().toLowerCase() === label.toLowerCase(),
    )
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
    .filter((value) => !NULL_VALUES.includes(value.toLowerCase()));
}

function scrapeBenchmark($: cheerio.CheerioAPI, label: string) {
  const el = $('.gpubench_benchmark')
    .filter(
      (_i, div) => $(div).text().trim().toLowerCase() === label.toLowerCase(),
    )
    .siblings('div')
    .first();

  if (!el.has('.paintAB_legend')) {
    return null;
  }

  const values = el
    .find('.paintAB_legend')
    .text()
    .split(/\s\s/)
    .map((value) => value.trim())
    .filter((value) => !!value);

  return values;
}
