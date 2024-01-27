import {
  BenchmarkKey,
  CpuFieldKey,
  CpuFields,
  CpuProduct,
  formatCompanyName,
  formatProductField,
  FormatProductFieldOptions,
  FrequencyUnit,
  getBaseUnitValue,
  MeasurementUnit,
  parseProductName,
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

export interface ScrapeGeekBenchCpuDataOptions extends CommonScraperOptions {
  url: string;
}

// Example: https://browser.geekbench.com/processors/intel-core-i9-10900kf
export async function scrapeGeekBenchCpuData(
  options: ScrapeGeekBenchCpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const name = getName($);
  const company = getCompany($);
  const fields = scrapeFields($, ctx);

  const benchmarks: ProductBenchmark[] = [
    getSingleCoreScore($),
    getMultiCoreScore($),
  ].filter((value) => value != null);

  const product: Partial<CpuProduct> = {
    productType: ProductType.Cpu,
    name,
    company,
    fields,
    benchmarks,
  };

  return { product } as ScrapeProductResponse;
}

function getName($: cheerio.CheerioAPI): string {
  const fullName = scrapeSpecRow($, 'processor')[0];
  const { company } = parseProductName(fullName);

  return fullName.substring(company?.length || 0).trim();
}

function getCompany($: cheerio.CheerioAPI) {
  const fullName = scrapeSpecRow($, 'processor')[0];
  const { company } = parseProductName(fullName);
  return formatCompanyName(company);
}

function getSingleCoreScore($: cheerio.CheerioAPI): ProductBenchmark {
  const el = $('.score-container .note')
    .filter(
      (_i, div) => $(div).text().trim().toLowerCase() === 'single-core score',
    )
    .siblings('.score')
    .first();
  const value = Number(el.text());
  return {
    benchmarkKey: BenchmarkKey.Geekbench_6_2_Single_Core,
    value,
    metadata: null,
  };
}

function getMultiCoreScore($: cheerio.CheerioAPI): ProductBenchmark {
  const el = $('.score-container .note')
    .filter(
      (_i, div) => $(div).text().trim().toLowerCase() === 'multi-core score',
    )
    .siblings('.score')
    .first();
  const value = Number(el.text());

  return {
    benchmarkKey: BenchmarkKey.Geekbench_6_2_Multi_Core,
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
    label: 'frequency',
    regexes: [/^(?<value>[.\d]+) (?<unit>KHz|MHz|GHz)/i],
    unitMapper: {
      khz: FrequencyUnit.khz,
      mhz: FrequencyUnit.mhz,
      ghz: FrequencyUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  codename: {
    label: 'codename',
    regexes: [/^(?<value>.+)/i],
  },
  cores: {
    label: 'cores',
    regexes: [/^(?<value>[.\d]+)/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  integratedGraphics: {
    label: 'gpu',
    regexes: [/^(?<value>.+)/i],
  },
  socket: {
    label: 'package',
    regexes: [/^(?<value>.+)/i],
  },
  tdp: {
    label: 'tdp',
    regexes: [/(?<value>[.\d]+) (?<unit>W)/i],
    unitMapper: {
      w: WattageUnit.w,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  threads: {
    label: 'threads',
    regexes: [/^(?<value>[.\d]+)/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  turboClock: {
    label: 'maximum frequency',
    regexes: [/^(?<value>[.\d]+) (?<unit>KHz|MHz|GHz)/i],
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

function scrapeSpecRow($: cheerio.CheerioAPI, label: string) {
  const el = $('td.system-name')
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
