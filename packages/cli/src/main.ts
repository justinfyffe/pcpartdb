import * as dotenv from 'dotenv';
dotenv.config();

import { Command } from 'commander';
import { automationCommand } from './automation';
import { fixDataCommand } from './scratch-pad';

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
// npm run cli automation
program
  .command('automation')
  .option('--continuous')
  .action(async (options) => {
    await automationCommand({ continuous: options.continuous });
  });

program.parse(process.argv);
