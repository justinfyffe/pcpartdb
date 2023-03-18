import { ScrapeSource } from '../types';
import { scrapeTechPowerUpGpuSources } from './techpowerup';
import { scrapeUlBenchmarkGpuSources } from './ul-benchmarks';
import { sanitizeVideocardBenchmarksGpuSources } from './videocardbenchmarks';

export type ScrapeSourcesCommandArgs = {
  source: string;
  proxy?: boolean;
};

export async function scrapeSourcesCommandHandler(
  args: ScrapeSourcesCommandArgs,
) {
  console.log(`Scraping sources with args=${JSON.stringify(args)}`);
  const { source, proxy } = args;

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
