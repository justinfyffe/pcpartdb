import { buildSourceModel } from './buildSourceModel';
import { scrapeGeekBenchCpuSources } from './scrapeGeekBenchCpuSources';
import { scrapePassMarkCpuSources } from './scrapePassMarkCpuSources';
import { scrapeTechPowerUpCpuSources } from './scrapeTechPowerUpCpuSources';
import { ScrapeCpuSourceOption } from './types';

interface ScrapeCpuSourcesArgs {
  source?: string;
  skipScraping?: boolean;
  skipSourceModel?: boolean;
  noProxy?: boolean;
}

export async function scrapeCpuSources(args: ScrapeCpuSourcesArgs) {
  const skipScraping = args.skipScraping ?? false;
  const skipSourceModel = args.skipSourceModel ?? false;
  const { source, noProxy } = args;

  if (!skipScraping) {
    if (source === ScrapeCpuSourceOption.TechPowerUp) {
      await scrapeTechPowerUpCpuSources({ noProxy });
    } else if (source === ScrapeCpuSourceOption.PassMark) {
      await scrapePassMarkCpuSources({ noProxy });
    } else if (source === ScrapeCpuSourceOption.GeekBench) {
      await scrapeGeekBenchCpuSources({ noProxy });
    } else {
      await scrapeTechPowerUpCpuSources({ noProxy });
      await scrapePassMarkCpuSources({ noProxy });
      await scrapeGeekBenchCpuSources({ noProxy });
    }
  }

  if (!skipSourceModel) {
    await buildSourceModel();
  }
}
