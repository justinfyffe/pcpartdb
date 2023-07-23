import * as dotenv from 'dotenv';
dotenv.config();

import { Command } from 'commander';
import { automationCommand } from './automation';
import { gpuUpdaterCommand } from './gpu-updater';
import { refreshRatingsCommand } from './refresh-ratings';
import { scrapeDataCommand } from './scrape-data';
import { scrapeRetailModelsCommand } from './scrape-retail-models';
import { scrapeSourcesCommand } from './scrape-sources';
import { fixDataCommand } from './scratch-pad';
import { sitemapUpdaterCommand } from './sitemap-updater';

const program = new Command();

// Scratch Pad script for one-off scripts.
program.command('scratch-pad').action(async () => {
  await fixDataCommand({});
});

// Automation program
//
// Handles general automation of the website. Pulls sources and data, and
// uploads it to the site. Some things are fully automated, while some things
// require approval from the admin panel.
//
// Run from another machine than the web server. Requires AUTOMATION_KEY and
// AUTOMATION_URL in env file.
//
// npm run cli autopilot
program
  .command('automation')
  .option('--schedule')
  .action(async (options) => {
    await automationCommand({ schedule: options.schedule });
  });

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
// Run this command to get URLs of data sources. Creates a source model file.
// npm run cli scrape-sources:cpu
// npm run cli scrape-sources:gpu
program
  .command('scrape-sources')
  .option('--product [value]')
  .option('--source [value]')
  .option('--noProxy')
  .option('--skipScraping')
  .option('--skipSourceModel')
  .action(async (options) => {
    await scrapeSourcesCommand({
      product: options.product,
      source: options.source,
      noProxy: options.noProxy,
      skipScraping: options.skipScraping,
      skipSourceModel: options.skipSourceModel,
    });
  });

// Scrape Data command
// Run this command to get data from sources in the source model.
// npm run cli scrape-data:cpu -- -- --offset 0 --count 25
// npm run cli scrape-data:gpu -- -- --offset 0 --count 25
program
  .command('scrape-data')
  .option('--product [value]')
  .option('--model [value]')
  .option('--count [value]') // Defaulit 10
  .option('--offset [value]') // Default 0
  .option('--file [value]')
  .option('--noProxy')
  .action(async (options) => {
    await scrapeDataCommand({
      product: options.product,
      model: options.model,
      count: options.count,
      offset: options.offset,
      file: options.file,
      noProxy: options.noProxy,
    });
  });

// Scrape Retail Models command
// Run this command to get retail models for a GPU
// Example:
// npm run cli scrape-retail-models:sourcesOnly -- -- --chipsetId 1 --marketSegment DESKTOP --techPowerUpUrl "https://www.techpowerup.com/gpu-specs/geforce-rtx-4090.c3889"
// npm run cli scrape-retail-models:dataOnly -- -- --chipsetId 1
program
  .command('scrape-retail-models')
  .option('--chipsetId [value]')
  .option('--marketSegment [value]')
  .option('--techPowerUpUrl [value]')
  .option('--segments [value]')
  .option('--sourcesFile [value]')
  .option('--sourcesOnly')
  .option('--dataOnly')
  .option('--noProxy')
  .action(async (options) => {
    await scrapeRetailModelsCommand({
      chipsetId: options.chipsetId,
      marketSegment: options.marketSegment,
      techPowerUpUrl: options.techPowerUpUrl,
      segments: options.segments,
      sourcesOnly: options.sourcesOnly,
      dataOnly: options.dataOnly,
      noProxy: options.noProxy,
    });
  });

// Refresh GPU Performance and Value Scores
program.command('refresh-ratings').action(async () => {
  await refreshRatingsCommand({});
});

program.parse(process.argv);
