import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.techpowerup.com';
const SEARCH_URL =
  'https://www.techpowerup.com/gpu-specs/?ajaxsrch={query}&_={timestamp}';

export async function getTechPowerUpGpuUrls() {
  const query = 'a';
  const $ = cheerio.load(await fetchSearchPage(query));

  const urls: { company: string; name: string; url: string }[] = [];

  const el = $('table tbody tr td:first-child');
  el.each((i, td) => {
    const $td = $(td);

    const className = $td.attr('class');
    let company = '';
    // TODO: handle other company names
    if (className === 'vendor-NVIDIA') {
      company = 'NVIDIA';
    } else if (className === 'vendor-AMD') {
      company = 'AMD';
    }

    const url = BASE_URL + $td.find('a').attr('href').trim();

    const name = $td.text().trim();

    urls.push({ company, url, name });
  });

  console.log(urls);
}

async function fetchSearchPage(query: string) {
  const url = buildSearchUrl(query);
  const response = await axios.get(url);
  return response.data;
}

function buildSearchUrl(query: string) {
  return SEARCH_URL.replace('{query}', query).replace(
    '{timestamp}',
    `${new Date().getTime()}`,
  );
}
