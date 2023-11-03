import {
  BenchmarkKey,
  ClockSpeedUnit,
  CpuFieldKey,
  CpuFields,
  CpuProduct,
  formatProductField,
  FormatProductFieldOptions,
  getBaseUnitValue,
  MeasurementUnit,
  MemorySizeUnit,
  ProductBenchmark,
  ProductType,
  ScrapeProductResponse,
  WattageUnit,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createCpuField } from '../utils';

const NULL_VALUES = ['n/a', 'none', 'unknown'];

export interface ScrapePassMarkCpuDataOptions extends CommonScraperOptions {
  url: string;
}

// Example: https://www.cpubenchmark.net/cpu.php?cpu=AMD+EPYC+9654&id=5088
export async function scrapePassMarkCpuData(
  options: ScrapePassMarkCpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const fields = scrapeFields($, ctx);

  const benchmarks: ProductBenchmark[] = [
    getMultiThreadScore($),
    getSingleThreadScore($),
  ].filter((value) => value != null);

  const product: Partial<CpuProduct> = {
    productType: ProductType.Cpu,
    fields,
    benchmarks,
  };

  return { product } as ScrapeProductResponse;
}

function getMultiThreadScore($: cheerio.CheerioAPI): ProductBenchmark {
  const PassMark_CpuMark_Multi_Thread = $('.speedicon')
    .siblings('span')
    .first()
    .text();

  const value = PassMark_CpuMark_Multi_Thread
    ? Number(PassMark_CpuMark_Multi_Thread)
    : null;
  return {
    benchmarkKey: BenchmarkKey.PassMark_CpuMark_Multi_Thread,
    value,
    metadata: null,
  };
}

function getSingleThreadScore($: cheerio.CheerioAPI): ProductBenchmark {
  const singleThreadScore = $('strong')
    .filter((_i, el) => $(el).text().trim() === 'Single Thread Rating:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  const value = singleThreadScore ? Number(singleThreadScore) : null;
  return {
    benchmarkKey: BenchmarkKey.PassMark_CpuMark_Single_Thread,
    value,
    metadata: null,
  };
}

interface ProductFieldScraper {
  labels: string[];
  regexes: RegExp[];
  unitMapper?: Record<string, MeasurementUnit>;
  formatOptions?: FormatProductFieldOptions;
  parseValue?: (results: { value: string; unit?: MeasurementUnit }) => unknown;
}

const FIELDS: Partial<Record<CpuFieldKey, ProductFieldScraper>> = {
  clock: {
    labels: ['clockspeed:'],
    regexes: [/^(?<value>[.\d]+) (?<unit>KHz|MHz|GHz)/i],
    unitMapper: {
      khz: ClockSpeedUnit.khz,
      mhz: ClockSpeedUnit.mhz,
      ghz: ClockSpeedUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  cores: {
    labels: ['cores:', 'total cores:'],
    regexes: [/^(?<value>[.\d]+)/i, /(?<value>[.\d]+) Cores/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  eCores: {
    labels: ['efficient cores:'],
    regexes: [/(?<value>[.\d]+) Cores/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  eCoreClock: {
    labels: ['efficient cores:'],
    regexes: [/(?<value>[.\d]+) (?<unit>KHz|MHz|GHz) Base/i],
    unitMapper: {
      khz: ClockSpeedUnit.khz,
      mhz: ClockSpeedUnit.mhz,
      ghz: ClockSpeedUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  eCoreTurboClock: {
    labels: ['efficient cores:'],
    regexes: [/(?<value>[.\d]+) (?<unit>KHz|MHz|GHz) Turbo/i],
    unitMapper: {
      khz: ClockSpeedUnit.khz,
      mhz: ClockSpeedUnit.mhz,
      ghz: ClockSpeedUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  l1Cache: {
    labels: ['cache size:'],
    regexes: [/L1: (?<value>[.\d]+) (?<unit>KB|MB|GB)/i],
    unitMapper: {
      kb: MemorySizeUnit.kb,
      mb: MemorySizeUnit.mb,
      gb: MemorySizeUnit.gb,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  l2Cache: {
    labels: ['cache size:'],
    regexes: [/L2: (?<value>[.\d]+) (?<unit>KB|MB|GB)/i],
    unitMapper: {
      kb: MemorySizeUnit.kb,
      mb: MemorySizeUnit.mb,
      gb: MemorySizeUnit.gb,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  l3Cache: {
    labels: ['cache size:'],
    regexes: [/L3: (?<value>[.\d]+) (?<unit>KB|MB|GB)/i],
    unitMapper: {
      kb: MemorySizeUnit.kb,
      mb: MemorySizeUnit.mb,
      gb: MemorySizeUnit.gb,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  pCores: {
    labels: ['performance cores:'],
    regexes: [/(?<value>[.\d]+) Cores/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  pCoreClock: {
    labels: ['performance cores:'],
    regexes: [/(?<value>[.\d]+) (?<unit>KHz|MHz|GHz) Base/i],
    unitMapper: {
      khz: ClockSpeedUnit.khz,
      mhz: ClockSpeedUnit.mhz,
      ghz: ClockSpeedUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  pCoreTurboClock: {
    labels: ['performance cores:'],
    regexes: [/(?<value>[.\d]+) (?<unit>KHz|MHz|GHz) Turbo/i],
    unitMapper: {
      khz: ClockSpeedUnit.khz,
      mhz: ClockSpeedUnit.mhz,
      ghz: ClockSpeedUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  socket: {
    labels: ['socket:'],
    regexes: [/^(?<value>.+)/i],
  },
  tdp: {
    labels: ['typical tdp:'],
    regexes: [/(?<value>[.\d]+) (?<unit>W)/i],
    unitMapper: {
      watt: WattageUnit.w,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  threads: {
    labels: ['threads:', 'total cores:'],
    regexes: [/^(?<value>[.\d]+)/i, /(?<value>[.\d]+) Threads/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  turboClock: {
    labels: ['turbo speed:'],
    regexes: [/^(?<value>[.\d]+) (?<unit>KHz|MHz|GHz)/i],
    unitMapper: {
      khz: ClockSpeedUnit.khz,
      mhz: ClockSpeedUnit.mhz,
      ghz: ClockSpeedUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
};
function scrapeFields($: cheerio.CheerioAPI, ctx: ScraperContext) {
  const fields = Object.entries(FIELDS).map(([fieldKey, scraper]) => {
    const scraped = scrapeSpecRow($, scraper.labels) || null;

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

function scrapeSpecRow($: cheerio.CheerioAPI, labels: string[]) {
  const el = $('.desc-body strong')
    .filter((_i, strong) => {
      const scrapedLabel = $(strong).text().trim().toLowerCase();
      return labels.some((label) => scrapedLabel === label.toLowerCase());
    })
    .map((_i, strong) => strong.nextSibling)
    .first();

  if (!el.length) {
    return null;
  }

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
