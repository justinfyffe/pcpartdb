import { Command } from 'commander';

const program = new Command();

// Scrape command
const scrape = program.command('scrape');
scrape
  .command('sources')
  .argument('[source]')
  .action(() => {});
scrape
  .command('data')
  .option('c|--count <value>', '', '10')
  .option('-o|--offset <value>', '', '0')
  .action(() => {});

program.parse(process.argv);
