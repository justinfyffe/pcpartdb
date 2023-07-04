import { buildSourceModel } from './buildSourceModel';
import { sanitizePassMarkGpuSources } from './sanitizeVideocardBenchmarksGpuSources';
import { scrapeTechPowerUpGpuSources } from './scrapeTechPowerUpGpuSources';
import { scrapeUlBenchmarkGpuSources } from './scrapeUlBenchmarkGpuSources';
import { ScrapeGpuSourceOption } from './types';

interface ScrapeGpuSourcesArgs {
  source?: string;
  skipScraping?: boolean;
  skipSourceModel?: boolean;
  noProxy?: boolean;
}

export async function scrapeGpuSources(args: ScrapeGpuSourcesArgs) {
  const skipScraping = args.skipScraping ?? false;
  const skipSourceModel = args.skipSourceModel ?? false;
  const { source, noProxy } = args;

  if (!skipScraping) {
    if (source === ScrapeGpuSourceOption.TechPowerUp) {
      await scrapeTechPowerUpGpuSources({ noProxy });
    } else if (source === ScrapeGpuSourceOption.UlBenchmarks) {
      await scrapeUlBenchmarkGpuSources({ noProxy });
    } else if (source === ScrapeGpuSourceOption.VideocardBenchmarks) {
      await sanitizePassMarkGpuSources();
    } else {
      await scrapeTechPowerUpGpuSources({ noProxy });
      await scrapeUlBenchmarkGpuSources({ noProxy });
      await sanitizePassMarkGpuSources();
    }
  }

  if (!skipSourceModel) {
    await buildSourceModel();
  }
}
