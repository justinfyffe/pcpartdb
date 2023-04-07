import {
  GpuBenchmarks,
  GpuDataSourceKey,
  GpuField,
  MarketSegmentValue,
  ScrapeGpuDetailsResponse,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../scraper';

export interface ScrapeVideocardBenchmarksGpuDetailsOptions {
  url: string;
  proxy?: boolean;
}

// Example: https://www.videocardbenchmark.net/gpu.php?gpu=GeForce+RTX+4090&id=4606
export async function scrapeVideocardBenchmarksGpuDetails(
  options: ScrapeVideocardBenchmarksGpuDetailsOptions,
) {
  const response = await scraper.scrape(options.url, { retries: 1 });
  const $ = cheerio.load(response.data);

  // Get Benchmark Values
  const benchmarks: GpuBenchmarks = {
    g3dMark: getG3dMark($),
    g2dMark: getG2dMark($),
  };

  return {
    gpu: { marketSegment: getMarketSegment($), benchmarks },
  } as ScrapeGpuDetailsResponse;
}

function getG3dMark($: cheerio.CheerioAPI): GpuField<number> {
  const g3dMark = $('.speedicon').siblings('span').first().text();
  const value = g3dMark ? Number(g3dMark) : null;
  return {
    value,
    meta: {
      fieldKey: 'g3dMark',
      dataSource: {
        source: GpuDataSourceKey.VideocardBenchmarks,
        enabled: value != null,
      },
    },
  };
}

function getG2dMark($: cheerio.CheerioAPI): GpuField<number> {
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
    value,
    meta: {
      fieldKey: 'g2dMark',
      dataSource: {
        source: GpuDataSourceKey.VideocardBenchmarks,
        enabled: value != null,
      },
    },
  };
}

function getMarketSegment($: cheerio.CheerioAPI): GpuField<MarketSegmentValue> {
  const text = $('.desc-foot p strong')
    .filter((_i, strong) => $(strong).text().trim() === 'Videocard Category:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  let value: MarketSegmentValue = null;
  if (text === 'Desktop') {
    value = MarketSegmentValue.Desktop;
  } else if (text === 'Mobile') {
    value = MarketSegmentValue.Mobile;
  } else if (text === 'Workstation') {
    value = MarketSegmentValue.Workstation;
  }

  return {
    value,
    meta: {
      fieldKey: 'marketSegment',
      dataSource: {
        source: GpuDataSourceKey.VideocardBenchmarks,
        enabled: value != null,
      },
    },
  };
}
