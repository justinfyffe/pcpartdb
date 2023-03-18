import { Command } from 'commander';
import * as dotenv from 'dotenv';
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

program.parse(process.argv);
