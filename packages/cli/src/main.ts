import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { fixDataHandler, refreshRatingsHandler } from './gpus';
import { scrapeDataCommandHandler } from './scrape/data';
import { scrapeSourcesCommandHandler } from './scrape/sources';

dotenv.config();

const program = new Command();

// Scrape command
const scrape = program.command('scrape');
scrape
  .command('sources')
  .option('--source [value]')
  .option('--proxy')
  .action(async (options) => {
    await scrapeSourcesCommandHandler({
      source: options.source,
      proxy: options.proxy,
    });
  });
scrape
  .command('data')
  .option('--model [value]')
  .option('--count [value]')
  .option('--offset [value]')
  .option('--proxy')
  .action(async (options) => {
    await scrapeDataCommandHandler({
      model: options.model,
      count: options.count,
      offset: options.offset,
      proxy: options.proxy,
    });
  });

const gpus = program.command('gpus');
gpus.command('refreshRatings').action(async () => {
  await refreshRatingsHandler();
});

// Remove this after data source structure has been fixed.
gpus.command('fixData').action(async () => {
  await fixDataHandler();
});

program.parse(process.argv);
