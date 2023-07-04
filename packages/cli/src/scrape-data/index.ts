import { scrapeCpuData } from './cpu';
import { scrapeGpuData } from './gpu';

export type ScrapeDataCommandArgs = {
  product: 'cpu' | 'gpu';
  model?: string;
  count?: string;
  offset?: string;
  file?: string;
  noProxy?: boolean;
};

export async function scrapeDataCommand(args: ScrapeDataCommandArgs) {
  console.log(`Scraping data with args=${JSON.stringify(args)}`);

  const { product } = args;
  if (product === 'cpu') {
    await scrapeCpuData(args);
  } else if (product === 'gpu') {
    await scrapeGpuData(args);
  } else {
    await scrapeGpuData(args);
    await scrapeCpuData(args);
  }
}
