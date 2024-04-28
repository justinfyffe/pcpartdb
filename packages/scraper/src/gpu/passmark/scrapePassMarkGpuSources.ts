import { cleanUrl, parseProductName } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { PassMarkGpuSource } from '../types';
import { generateGpuGroupKey } from '../utils';

export interface ScrapePassMarkGpuSourcesOptions {
  url: string;
  noProxy?: boolean;
}

const BASE_URL = 'https://www.videocardbenchmark.net/';

export async function scrapePassMarkGpuSources(
  options: ScrapePassMarkGpuSourcesOptions,
) {
  const { url } = options;
  const sources: PassMarkGpuSource[] = [];

  const $ = cheerio.load(await fetchListPage(url, options));
  const el = $('.main ul.chartlist li');
  el.each((_i, li) => {
    const $li = $(li);

    const url = cleanUrl(BASE_URL + $li.find('a').attr('href').trim());
    const { company: parsedCompany, name } = parseProductName(
      $li.find('a span.prdname').text().trim(),
    );

    const scoreText = $li.find('a span.count').text().trim().replace(',', '');
    const score = scoreText ? Number(scoreText) : null;

    const externalKey = getExternalKey(url);
    const company = parsedCompany || guessCompanyName(name);
    if (externalKey && company) {
      const groupKey = generateGpuGroupKey({
        name,
        company,
      });
      sources.push({
        groupKey,
        externalKey,
        name,
        company,
        url,
        g3dMark: !Number.isNaN(score) ? score : null,
      });
    }
  });

  return sources;
}

async function fetchListPage(
  url: string,
  options: ScrapePassMarkGpuSourcesOptions,
) {
  const { noProxy } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  return response.data;
}

function getExternalKey(url: string) {
  const obj = new URL(url);
  if (!obj.searchParams.has('id')) {
    return null;
  }
  return obj.searchParams.get('id');
}

const NVIDIA_HINTS = [
  'rtx ',
  ' rtx',
  'geforce',
  'quadro',
  'titan ',
  'tesla ',
  'grid',
  'gtx ',
  'nvs ',
  'nforce',
];
const AMD_HINTS = ['radeon', 'ryzen', 'firepro', 'firestream'];
const INTEL_HINTS = ['arc ', 'uhd graphics'];
const ATI_HINTS = ['firegl'];
function guessCompanyName(name: string) {
  const lcName = name.toLowerCase();
  if (NVIDIA_HINTS.some((hint) => lcName.includes(hint))) {
    return 'NVIDIA';
  }
  if (AMD_HINTS.some((hint) => lcName.includes(hint))) {
    return 'AMD';
  }
  if (INTEL_HINTS.some((hint) => lcName.includes(hint))) {
    return 'Intel';
  }
  if (ATI_HINTS.some((hint) => lcName.includes(hint))) {
    return 'ATI';
  }
  return null;
}
