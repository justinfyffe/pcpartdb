import { cleanUrl, parseProductName, SubProductType } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions } from '../../types';
import { NotebookCheckGpuSource } from '../types';
import { generateGpuGroupKey } from '../utils';

const URL =
  'https://www.notebookcheck.net/Mobile-Graphics-Cards-Benchmark-List.844.0.html?type=&sort=&professional=0&deskornote=2&or=0&gpu_fullname=1';

export interface ScrapeNotebookCheckGpuSourcesOptions
  extends CommonScraperOptions {}

export async function scrapeNotebookCheckGpuSources(
  options: ScrapeNotebookCheckGpuSourcesOptions,
) {
  const { noProxy } = options;

  const response = await scraper.scrapeGet(URL, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const sources: NotebookCheckGpuSource[] = [];

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

    const $a = $tr.find('.specs.fullname a');

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
      const groupKey = generateGpuGroupKey({
        gpuType: SubProductType.GpuChipset,
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
