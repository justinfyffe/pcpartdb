import { cleanUrl, parseProductName } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions } from '../../types';
import { NotebookCheckCpuSource } from '../types';
import { generateCpuGroupKey } from '../utils';

const URL =
  'https://www.notebookcheck.net/Mobile-Processors-Benchmark-List.2436.0.html';

export interface ScrapeNotebookCheckCpuSourcesOptions
  extends CommonScraperOptions {}

export async function scrapeNotebookCheckCpuSources(
  options: ScrapeNotebookCheckCpuSourcesOptions,
) {
  const { noProxy } = options;

  const response = await scraper.scrapeGet(URL, {
    retries: 1,
    noProxy,
    browser: true,
    returnPageSource: true,
    jsonExtended: true,
  });
  const $ = cheerio.load(response.data.html);

  const sources: NotebookCheckCpuSource[] = [];

  const el = $('.gpuform table tr');
  el.each((i, tr) => {
    const $tr = $(tr);

    // Exclude header
    if ($tr.hasClass('header')) {
      return;
    }

    // Exclude smartphones
    if ($tr.hasClass('smartphone_even') || $tr.hasClass('smartphone_odd')) {
      return;
    }

    const $a = $tr.find('.specs a');

    // Cannot find element.
    if (!$a.length) {
      return;
    }

    const href = $a.attr('href');
    if (!href) {
      return;
    }

    const url = cleanUrl(href.trim());
    const { company: companyFromName, name } = parseProductName(
      $a.text().trim(),
    );

    const company = companyFromName;
    const externalKey = getExternalKey(url);
    if (company) {
      const groupKey = generateCpuGroupKey({
        name,
        company,
      });
      sources.push({ groupKey, externalKey, name, company, url });
    }
  });

  $('.gputable_archived a').each((i, a) => {
    const $a = $(a);

    const href = $a.attr('href');
    if (!href) {
      return;
    }

    const url = cleanUrl(href.trim());
    const { company: companyFromName, name } = parseProductName(
      $a.text().trim(),
    );

    const company = companyFromName;
    const externalKey = getExternalKey(url);
    if (company) {
      const groupKey = generateCpuGroupKey({
        name,
        company,
      });
      sources.push({ groupKey, externalKey, name, company, url });
    }
  });

  return sources;
}

function getExternalKey(url: string) {
  const matches = url.match(/\.([0-9.]+)\.html$/);
  return matches[1] || null;
}
