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
  .option('-c|--count <value>', '', '10')
  .option('-o|--offset <value>', '', '0')
  .action(async (options) => {
    await scrapeDataCommandHandler({
      count: options.count,
      offset: options.offset,
    });
  });

program.parse(process.argv);
