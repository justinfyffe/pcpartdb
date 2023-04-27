import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { fixDataCommand } from './fix-data';
import { gpuUpdaterCommand } from './gpu-updater';
import { refreshRatingsCommand } from './refresh-ratings';
import { scrapeDataCommand } from './scrape-data';
import { scrapeSourcesCommand } from './scrape-sources';
import { sitemapUpdaterCommand } from './sitemap-updater';

dotenv.config();

const program = new Command();

// Gpu Updater
program
  .command('gpu-updater')
  .option('--schedule')
  .action(async (options) => {
    await gpuUpdaterCommand({ schedule: options.schedule });
  });

// Sitemap Updater
program
  .command('sitemap-updater')
  .option('--schedule')
  .action(async (options) => {
    await sitemapUpdaterCommand({ schedule: options.schedule });
  });

// Scrape Sources command
program
  .command('scrape-sources')
  .option('--source [value]')
  .option('--proxy')
  .option('--skipScraping')
  .action(async (options) => {
    await scrapeSourcesCommand({
      source: options.source,
      proxy: options.proxy,
      skipScraping: options.skipScraping,
    });
  });

// Scrape Data command
program
  .command('scrape-data')
  .option('--model [value]')
  .option('--count [value]')
  .option('--offset [value]')
  .option('--file [value]')
  .option('--proxy')
  .action(async (options) => {
    await scrapeDataCommand({
      model: options.model,
      count: options.count,
      offset: options.offset,
      file: options.file,
      proxy: options.proxy,
    });
  });

// Refresh GPU Performance and Value Scores
program.command('refresh-ratings').action(async () => {
  await refreshRatingsCommand({});
});

// Remove this after data source structure has been fixed.
program.command('fix-data').action(async () => {
  await fixDataCommand({});
});

program.parse(process.argv);
