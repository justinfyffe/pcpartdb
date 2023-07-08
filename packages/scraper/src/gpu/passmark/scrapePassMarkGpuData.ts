import {
  Gpu,
  GpuField,
  GpuMarketSegmentValue,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';

export interface ScrapePassMarkGpuDataOptions {
  url: string;
  noProxy?: boolean;
}

// Example: https://www.videocardbenchmark.net/gpu.php?gpu=GeForce+RTX+4090&id=4606
export async function scrapePassMarkGpuData(
  options: ScrapePassMarkGpuDataOptions,
) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const product: Partial<Gpu> = {
    marketSegment: getMarketSegment($),
    g3dMark: getG3dMark($),
    g2dMark: getG2dMark($),
  };

  return { product } as ScrapeProductResponse;
}

function getG3dMark($: cheerio.CheerioAPI): GpuField<number> {
  const g3dMark = $('.speedicon').siblings('span').first().text();
  const value = g3dMark ? Number(g3dMark) : null;
  return {
    value,
    meta: {
      fieldKey: 'g3dMark',
      autoUpdate: true,
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
      autoUpdate: true,
    },
  };
}

function getMarketSegment(
  $: cheerio.CheerioAPI,
): GpuField<GpuMarketSegmentValue> {
  const text = $('.desc-foot p strong')
    .filter((_i, strong) => $(strong).text().trim() === 'Videocard Category:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  let value: GpuMarketSegmentValue = null;
  if (text === 'Desktop') {
    value = GpuMarketSegmentValue.Desktop;
  } else if (text === 'Mobile') {
    value = GpuMarketSegmentValue.Mobile;
  } else if (text === 'Workstation') {
    value = GpuMarketSegmentValue.Workstation;
  }

  return {
    value,
    meta: {
      fieldKey: 'marketSegment',
      autoUpdate: true,
    },
  };
}
