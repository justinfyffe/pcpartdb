import { scrapeCpuSources } from './cpu';
import { scrapeGpuSources } from './gpu';

export type ScrapeSourcesCommandArgs = {
  product: 'cpu' | 'gpu';
  source?: string;
  skipScraping?: boolean;
  skipSourceModel?: boolean;
  noProxy?: boolean;
};

export async function scrapeSourcesCommand(args: ScrapeSourcesCommandArgs) {
  console.log(`Scraping sources with args=${JSON.stringify(args)}`);
  const { product } = args;

  if (product === 'cpu') {
    await scrapeCpuSources(args);
  } else if (product === 'gpu') {
    await scrapeGpuSources(args);
  } else {
    await scrapeGpuSources(args);
    await scrapeCpuSources(args);
  }
}
