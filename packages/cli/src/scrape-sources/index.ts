import { buildSourceModel } from './buildSourceModel';
import { sanitizeVideocardBenchmarksGpuSources } from './sanitizeVideocardBenchmarksGpuSources';
import { scrapeTechPowerUpGpuSources } from './scrapeTechPowerUpGpuSources';
import { scrapeUlBenchmarkGpuSources } from './scrapeUlBenchmarkGpuSources';
import { ScrapeSource } from './types';

export type ScrapeSourcesCommandArgs = {
  source: string;
  skipScraping?: boolean;
  proxy?: boolean;
};

export async function scrapeSourcesCommand(args: ScrapeSourcesCommandArgs) {
  console.log(`Scraping sources with args=${JSON.stringify(args)}`);
  const { source, proxy } = args;
  const skipScraping = args.skipScraping ?? false;

  if (!skipScraping) {
    if (source === ScrapeSource.TechPowerUp) {
      await scrapeTechPowerUpGpuSources({ proxy });
    } else if (source === ScrapeSource.UlBenchmarks) {
      await scrapeUlBenchmarkGpuSources({ proxy });
    } else if (source === ScrapeSource.VideocardBenchmarks) {
      await sanitizeVideocardBenchmarksGpuSources();
    } else {
      await scrapeTechPowerUpGpuSources({ proxy });
      await scrapeUlBenchmarkGpuSources({ proxy });
      await sanitizeVideocardBenchmarksGpuSources();
    }
  }

  await buildSourceModel();
}
