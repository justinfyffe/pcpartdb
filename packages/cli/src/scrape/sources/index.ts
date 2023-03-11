import { ScrapeSource } from '../types';
import { scrapeTechPowerUpGpuSources } from './techpowerup';
import { scrapeUlBenchmarkGpuSources } from './ul-benchmarks';
import { sanitizeVideocardBenchmarksGpuSources } from './videocardbenchmarks';

export type ScrapeSourcesCommandArgs = {
  source: string;
};

export async function scrapeSourcesCommandHandler(
  args: ScrapeSourcesCommandArgs,
) {
  const { source } = args;

  if (source === ScrapeSource.TechPowerUp) {
    await scrapeTechPowerUpGpuSources();
  } else if (source === ScrapeSource.UlBenchmarks) {
    await scrapeUlBenchmarkGpuSources();
  } else if (source === ScrapeSource.VideocardBenchmarks) {
    await sanitizeVideocardBenchmarksGpuSources();
  } else {
    await scrapeTechPowerUpGpuSources();
    await scrapeUlBenchmarkGpuSources();
    await sanitizeVideocardBenchmarksGpuSources();
  }
}
