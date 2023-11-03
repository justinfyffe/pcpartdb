import {
  BenchmarkKey,
  ClockSpeedUnit,
  formatProductField,
  FormatProductFieldOptions,
  getBaseUnitValue,
  GpuFieldKey,
  GpuFields,
  GpuProduct,
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
import { createGpuField } from '../utils';

const NULL_VALUES = ['n/a', 'none', 'unknown'];

export interface ScrapePassMarkGpuDataOptions extends CommonScraperOptions {
  url: string;
}

// TODO: scrape fields
// Example: https://www.videocardbenchmark.net/gpu.php?gpu=GeForce+RTX+4090&id=4606
export async function scrapePassMarkGpuData(
  options: ScrapePassMarkGpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const fields = scrapeFields($, ctx);

  const benchmarks: ProductBenchmark[] = [getG3dMark($), getG2dMark($)].filter(
    (value) => value != null,
  );

  const product: Partial<GpuProduct> = {
    productType: ProductType.Gpu,
    fields,
    benchmarks,
  };

  return { product } as ScrapeProductResponse;
}

function getG3dMark($: cheerio.CheerioAPI): ProductBenchmark {
  const g3dMark = $('.speedicon').siblings('span').first().text();
  const value = g3dMark ? Number(g3dMark) : null;
  return {
    benchmarkKey: BenchmarkKey.PassMark_G3dMark,
    value,
    metadata: null,
  } as ProductBenchmark;
}

function getG2dMark($: cheerio.CheerioAPI): ProductBenchmark {
  const g2dMark = $('strong')
    .filter((_i, el) => $(el).text().trim() === 'Average G2D Mark:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  const value = g2dMark ? Number(g2dMark) : null;
  return {
    benchmarkKey: BenchmarkKey.PassMark_G2dMark,
    value,
    metadata: null,
  } as ProductBenchmark;
}

interface ProductFieldScraper {
  labels: string[];
  regexes: RegExp[];
  unitMapper?: Record<string, MeasurementUnit>;
  formatOptions?: FormatProductFieldOptions;
  parseValue?: (results: { value: string; unit?: MeasurementUnit }) => unknown;
}

const FIELDS: Partial<Record<GpuFieldKey, ProductFieldScraper>> = {
  busInterface: {
    labels: ['bus interface:'],
    regexes: [/^(?<value>.+)/i],
  },
  directxVersion: {
    labels: ['directx:'],
    regexes: [/^(?<value>[_-,.\d]+)/i],
  },
  gpuCoreBaseClock: {
    labels: ['core clock(s):'],
    regexes: [/^(?<value>[.\d]+) (?<unit>KHz|MHz|GHz)/i],
    unitMapper: {
      khz: ClockSpeedUnit.khz,
      mhz: ClockSpeedUnit.mhz,
      ghz: ClockSpeedUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  memorySize: {
    labels: ['max memory size:'],
    regexes: [/^(?<value>[.\d]+) (?<unit>KB|MB|GB)/i],
    unitMapper: {
      kb: MemorySizeUnit.kb,
      mb: MemorySizeUnit.mb,
      gb: MemorySizeUnit.gb,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  openGlVersion: {
    labels: ['opengl:'],
    regexes: [/^(?<value>[_-,.\d]+)/i],
  },
  tdp: {
    labels: ['max tdp:'],
    regexes: [/(?<value>[.\d]+) (?<unit>W)/i],
    unitMapper: {
      watt: WattageUnit.w,
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
      ProductType.Gpu,
      fieldKey as GpuFieldKey,
      raw,
      { ...(scraper.formatOptions ?? {}), displayUnit: unit },
    );

    return createGpuField({
      field: fieldKey as GpuFieldKey,
      raw: raw ?? null,
      formatted: formatted ?? null,
      ctx,
    });
  });

  return fields.reduce((acc, field) => {
    return field?.meta?.fieldKey
      ? { ...acc, [field.meta.fieldKey]: field }
      : acc;
  }, {} as GpuFields);
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
