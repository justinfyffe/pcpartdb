import * as scheduler from 'node-schedule';
import { executeAutopilot } from './executeAutopilot';
import { AutopilotContext } from './types';
import { autopilotDataPath, loadAutopilotConfig } from './utils';

const AUTOPILOT_CRON = '0-59 * * * *';

export interface AutopilotCommandArgs {
  schedule?: boolean;
}

export async function autopilotCommand(args: AutopilotCommandArgs) {
  checkRequiredParameters();

  const context = await createContext();
  if (args.schedule) {
    scheduler.scheduleJob(AUTOPILOT_CRON, async () => {
      await executeAutopilot(context);
    });
  } else {
    await executeAutopilot(context);
  }
}

function checkRequiredParameters() {
  if (!process.env.API_KEY) {
    throw new Error('Missing required env variable: API_KEY');
  }

  if (!process.env.API_URL) {
    throw new Error('Missing required env variable: API_URL');
  }
}

async function createContext() {
  const config = await loadAutopilotConfig(autopilotDataPath('config.json'));

  return { config } as AutopilotContext;
}
