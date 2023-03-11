import { Command } from 'commander';

const program = new Command();

// Scrape command
const scrape = program.command('scrape');
scrape.command('sources').action(() => {});
scrape.command('data').action(() => {});

program.parse(process.argv);
