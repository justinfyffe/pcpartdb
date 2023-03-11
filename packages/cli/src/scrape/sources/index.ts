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

  if (source === 'techpowerup') {
    await scrapeTechPowerUpGpuSources();
  } else if (source === 'ul-benchmarks') {
    await scrapeUlBenchmarkGpuSources();
  } else if (source === 'videocardbenchmarks') {
    await sanitizeVideocardBenchmarksGpuSources();
  } else {
    await scrapeTechPowerUpGpuSources();
    await scrapeUlBenchmarkGpuSources();
    await sanitizeVideocardBenchmarksGpuSources();
  }
}
