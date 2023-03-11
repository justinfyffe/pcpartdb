import { importFromTechPowerUp } from '@pcpartdb/scraper';
import { Command } from 'commander';
import { buildSourceModel, readSourceModel } from './source-model';
import { scrapeTechPowerUpGpuUrls } from './techpowerup';
import { ScrapeSource } from './types';
import { scrapeUlBenchmarkGpuUrls } from './ul-benchmarks';
import { sanitizeVideocardBenchmarksGpuUrls } from './videocardbenchmarks';

const program = new Command();

program.parse(process.argv);

const parser = yargs(process.argv).options({
  scrapeUrls: {
    alias: 'u',
    choices: [
      'all',
      ScrapeSource.TechPowerUp,
      ScrapeSource.UlBenchmarks,
      ScrapeSource.VideocardBenchmarks,
    ],
  },
  buildSourceModel: { alias: 'b', type: 'boolean', default: false },
  scrapeData: { alias: 'd', type: 'boolean', default: false },
  count: { alias: 'c', type: 'number', default: 10 },
  offset: { alias: 'o', type: 'number', default: 0 },
});

async function main() {
  const args = await parser.argv;

  // Scrape GPU URLs
  const { scrapeUrls } = args;
  if (scrapeUrls) {
    if (scrapeUrls === ScrapeSource.TechPowerUp || scrapeUrls === 'all') {
      await scrapeTechPowerUpGpuUrls();
    }
    if (scrapeUrls === ScrapeSource.UlBenchmarks || scrapeUrls === 'all') {
      await scrapeUlBenchmarkGpuUrls();
    }
    if (
      scrapeUrls === ScrapeSource.VideocardBenchmarks ||
      scrapeUrls === 'all'
    ) {
      await sanitizeVideocardBenchmarksGpuUrls();
    }
  }

  // Update source model if scraping urls
  if (scrapeUrls) {
    await buildSourceModel(
      techPowerUpGpuUrls,
      ulBenchmarkGpus,
      videocardBenchmarksGpus,
    );
  }

  // Scrape details for saved gpus
  if (scrapeData) {
    const sourceModel = await readSourceModel();

    const { count, offset } = args;
    for (let i = offset; i < offset + count; ++i) {
      const model = sourceModel[i];

      const techpowerupData = await importFromTechPowerUp(model.techpowerupUrl);
      //  generate gpu database model, save to json
    }
  }
}

main();
