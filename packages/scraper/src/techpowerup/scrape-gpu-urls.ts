import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fsPromises from 'fs/promises';
import { sleep } from '../utils';

export interface TechPowerUpUrlData {
  name: string;
  company: string;
  url: string;
}

const QUERIES = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

const BASE_URL = 'https://www.techpowerup.com';
const SEARCH_URL =
  'https://www.techpowerup.com/gpu-specs/?ajaxsrch={query}&_={timestamp}';
const SLEEP_DELAY = 5_000;

export async function scrapeTechPowerUpGpuUrls(outputFile: string) {
  const map: Record<string, TechPowerUpUrlData> = {};
  for (let i = 0; i < QUERIES.length; ++i) {
    const gpusForQuery = await scrapeSearchData(QUERIES[0]);
    gpusForQuery.forEach((gpu) => {
      map[gpu.name] = gpu;
    });
    await sleep(SLEEP_DELAY);
  }

  const gpus = Object.values(map);

  await fsPromises.writeFile(
    outputFile,
    JSON.stringify(gpus, undefined, 2),
    'utf-8',
  );

  return gpus;
}

async function scrapeSearchData(query: string) {
  const $ = cheerio.load(await fetchSearchPage(query));

  const gpus: TechPowerUpUrlData[] = [];

  const el = $('table tbody tr td:first-child');
  el.each((i, td) => {
    const $td = $(td);

    const className = $td.attr('class');
    let company = '';
    if (className === 'vendor-NVIDIA') {
      company = 'NVIDIA';
    } else if (className === 'vendor-AMD') {
      company = 'AMD';
    } else if (className === 'vendor-Intel') {
      company = 'Intel';
    }

    const url = BASE_URL + $td.find('a').attr('href').trim();
    const name = $td.text().trim();

    gpus.push({ name, company, url });
  });

  return gpus;
}

async function fetchSearchPage(query: string) {
  const url = buildSearchUrl(query);
  const response = await axios.get(url);
  return response.data;
}

function buildSearchUrl(query: string) {
  return SEARCH_URL.replace('{query}', encodeURIComponent(query)).replace(
    '{timestamp}',
    `${new Date().getTime()}`,
  );
}
