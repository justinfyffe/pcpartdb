import { buildSourceModel } from './buildSourceModel';
import { scrapePassMarkGpuSources } from './scrapePassMarkGpuSources';
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
    } else if (source === ScrapeGpuSourceOption.PassMark) {
      await scrapePassMarkGpuSources({ noProxy });
    } else {
      await scrapeTechPowerUpGpuSources({ noProxy });
      await scrapePassMarkGpuSources({ noProxy });
      await scrapeUlBenchmarkGpuSources({ noProxy });
    }
  }

  if (!skipSourceModel) {
    await buildSourceModel();
  }
}
