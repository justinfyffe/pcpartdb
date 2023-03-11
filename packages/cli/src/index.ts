import { Command } from 'commander';
import { scrapeDataCommandHandler } from './scrape/data';
import { scrapeSourcesCommandHandler } from './scrape/sources';

const program = new Command();

// Scrape command
const scrape = program.command('scrape');
scrape
  .command('sources')
  .argument('[source]')
  .action(async (source) => {
    await scrapeSourcesCommandHandler({ source });
  });
scrape
  .command('data')
  .option('-m|--model')
  .option('-c|--count <value>')
  .option('-o|--offset <value>')
  .action(async (options) => {
    await scrapeDataCommandHandler({
      model: options.model,
      count: options.count,
      offset: options.offset,
    });
  });

program.parse(process.argv);
