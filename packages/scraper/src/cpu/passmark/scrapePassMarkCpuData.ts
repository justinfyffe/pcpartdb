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
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createCpuField } from '../utils';

const NULL_VALUES = ['n/a', 'none', 'unknown'];

export interface ScrapePassMarkCpuDataOptions extends CommonScraperOptions {
  url: string;
}

// TODO: scrape fields
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
  label: string;
  regexes: RegExp[];
  unitMapper?: Record<string, MeasurementUnit>;
  formatOptions?: FormatProductFieldOptions;
  parseValue?: (results: { value: string; unit?: MeasurementUnit }) => unknown;
}

const FIELDS: Partial<Record<CpuFieldKey, ProductFieldScraper>> = {
  clock: {
    label: 'clockspeed:',
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
    label: 'cores:', // TODO: support multiple labels: https://www.cpubenchmark.net/cpu.php?cpu=Intel+Core+i9-12900KS&id=4813
    regexes: [/^(?<value>[.\d]+)/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  eCores: {
    // TODO
  },
  eCoreClock: {
    // TODO
  },
  eCoreTurboClock: {
    // TODO
  },
  l1Cache: {
    label: 'cache size:',
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
    label: 'cache size:',
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
    label: 'cache size:',
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
    // TODO
  },
  pCoreClock: {
    // TODO
  },
  pCoreTurboClock: {
    // TODO
  },
  socket: {
    label: 'socket:',
    regexes: [/^(?<value>.+)/i],
  },
  tdp: {
    // TODO
  },
  threads: {
    label: 'threads:',
    regexes: [/^(?<value>[.\d]+)/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  turboClock: {
    label: 'turbo speed:',
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

function scrapeSpecRow($: cheerio.CheerioAPI, label: string) {
  const el = $('.desc-body strong')
    .filter(
      (_i, strong) =>
        $(strong).text().trim().toLowerCase() === label.toLowerCase(),
    )
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
