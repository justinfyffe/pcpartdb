import { Gpu, GpuDataSource, GpuDataSourceKey } from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { scrapeTechPowerUpGpuDetails } from '../techpowerup';
import { scrapeUlBenchmarksGpuDetails } from '../ul-benchmarks';
import { scrapeVideocardBenchmarksGpuDetails } from '../videocardbenchmarks';

export interface ScrapeGpuOptions {
  dataSources: Record<string, GpuDataSource>;
  proxy?: boolean;
}

export interface ScrapeGpuResults {
  gpu: Partial<Gpu>;
}

export async function scrapeGpu(options: ScrapeGpuOptions) {
  const { dataSources, proxy } = options;

  const techPowerUpUrl = dataSources[GpuDataSourceKey.TechPowerUp]?.url;
  const ulBenchmarksUrl = dataSources[GpuDataSourceKey.UlBenchmarks]?.url;
  const videocardBenchmarkUrl =
    dataSources[GpuDataSourceKey.VideocardBenchmarks]?.url;

  let scrapedGpu: Partial<Gpu> = {};
  if (techPowerUpUrl != null) {
    const { gpu } = await scrapeTechPowerUpGpuDetails({
      url: techPowerUpUrl,
      proxy,
    });
    scrapedGpu = deepmerge(scrapedGpu, gpu);
  }
  if (ulBenchmarksUrl != null) {
    const { gpu } = await scrapeUlBenchmarksGpuDetails({
      url: ulBenchmarksUrl,
      proxy,
    });
    scrapedGpu = deepmerge(scrapedGpu, gpu);
  }
  if (videocardBenchmarkUrl != null) {
    const { gpu } = await scrapeVideocardBenchmarksGpuDetails({
      url: videocardBenchmarkUrl,
      proxy,
    });
    scrapedGpu = deepmerge(scrapedGpu, gpu);
  }

  return { gpu: scrapedGpu } as ScrapeGpuResults;
}
