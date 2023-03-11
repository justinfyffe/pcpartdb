import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fsPromises from 'fs/promises';
import { sleep } from '../utils';

export interface UlBenchmarkUrlData {
  name: string;
  company: string;
  timespyScore: number;
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
  'intel',
  'amd',
  'nvidia',
];

const SEARCH_URL = 'https://benchmarks.ul.com/compare/best-gpus?search={query}';
const SLEEP_DELAY = 5_000;

export async function scrapeUlBenchmarkGpus(outputFile: string) {
  const map: Record<string, UlBenchmarkUrlData> = {};
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

  const gpus: UlBenchmarkUrlData[] = [];

  const el = $('table#productTable tbody tr');
  el.each((_i, tr) => {
    const $tr = $(tr);

    const $deviceEl = $tr.find('a.OneLinkNoTx');
    const url = $deviceEl.attr('href');
    const { company, name } = parseGpuName($deviceEl.text().trim());

    const $scoreEl = $tr.find('span.bar-score');
    const timespyScore = Number($scoreEl.text().trim().replace(',', ''));

    gpus.push({ name, company, timespyScore, url });
  });

  return gpus;
}

async function fetchSearchPage(query: string) {
  const url = buildSearchUrl(query);
  const response = await axios.get(url);
  return response.data;
}

function buildSearchUrl(query: string) {
  return SEARCH_URL.replace('{query}', encodeURIComponent(query));
}

function parseGpuName(gpuName: string) {
  const idx = gpuName.indexOf(' ');
  const company = gpuName.substring(0, idx);
  const name = gpuName.substring(idx + 1);
  if (company === 'AMD' || company === 'Intel' || company === 'NVIDIA') {
    return { company, name };
  }

  return { company: null, name: null };
}
