import {
  importFromTechPowerUp,
  sanitizeVideocardBenchmarksRawGpus,
  scrapeTechPowerUpGpus,
  scrapeUlBenchmarkGpus,
  TechPowerUpUrlData,
  UlBenchmarkUrlData,
  VideocardBenchmarksUrlData,
} from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import yargs from 'yargs';
import { buildSourceModel, readSourceModel } from './source-model';
import { ScrapeSource } from './types';

const TECHPOWERUP_OUTPUT_FILE = '../../data/scraper/techpowerup/gpus.json';

const UL_BENCHMARKS_OUTPUT_FILE = '../../data/scraper/ul-benchmarks/gpus.json';

const VIDEOCARDBENCHMARKS_RAW_FILE =
  '../../data/scraper/videocardbenchmarks/raw-gpus.json';
const VIDEOCARDBENCHMARKS_OUTPUT_FILE =
  '../../data/scraper/videocardbenchmarks/gpus.json';

async function main() {
  const parser = yargs(process.argv)
    .option('scrapeUrls', {
      choices: [
        'all',
        ScrapeSource.TechPowerUp,
        ScrapeSource.UlBenchmarks,
        ScrapeSource.VideocardBenchmarks,
      ],
      default: false,
    })
    .option('scrapeData', { type: 'boolean', default: false })
    .option('count', { type: 'number', default: 10 })
    .option('offset', { type: 'number', default: 0 });

  const args = await parser.argv;

  // Make data directories
  await fsPromises.mkdir('../../data/scraper/source-models', {
    recursive: true,
  });
  await fsPromises.mkdir('../../data/scraper/techpowerup', { recursive: true });
  await fsPromises.mkdir('../../data/scraper/ul-benchmarks', {
    recursive: true,
  });
  await fsPromises.mkdir('../../data/scraper/videocardbenchmarks', {
    recursive: true,
  });

  // Scrape GPU URLs
  const { scrapeUrls, scrapeData } = args;

  const techpowerupGpus: TechPowerUpUrlData[] =
    scrapeUrls === ScrapeSource.TechPowerUp || scrapeUrls === 'all'
      ? await scrapeTechPowerUpGpus(TECHPOWERUP_OUTPUT_FILE)
      : [];
  const ulBenchmarkGpus: UlBenchmarkUrlData[] =
    scrapeUrls === ScrapeSource.UlBenchmarks || scrapeUrls === 'all'
      ? await scrapeUlBenchmarkGpus(UL_BENCHMARKS_OUTPUT_FILE)
      : [];
  const videocardBenchmarksGpus: VideocardBenchmarksUrlData[] =
    scrapeUrls === ScrapeSource.VideocardBenchmarks || scrapeUrls === 'all'
      ? await sanitizeVideocardBenchmarksRawGpus(
          VIDEOCARDBENCHMARKS_RAW_FILE,
          VIDEOCARDBENCHMARKS_OUTPUT_FILE,
        )
      : [];

  // Update source model if scraping urls
  if (scrapeUrls) {
    await buildSourceModel(
      techpowerupGpus,
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
