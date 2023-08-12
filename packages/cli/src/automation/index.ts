import { AutomationStatus } from '@pcpartdb/shared';
import axios from 'axios';
import * as scheduler from 'node-schedule';
import { ApiClient } from '../shared/ApiClient';
import { sleep } from '../shared/process';
import { executeAutomation } from './executeAutomation';
import { AutomationContext } from './types';
import { loadAutomationContext } from './utils/context';

const AUTOMATION_CRON = '0-59 * * * *';
const FIVE_MINUTES_MS = 1000 * 60 * 5;

export interface AutomationCommandArgs {
  schedule?: boolean;
}

export async function automationCommand(args: AutomationCommandArgs) {
  checkRequiredParameters();

  let executing = false;
  let terminate = false;
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log(
      'Received termination signal. Shutting down after execution finishes.',
    );
    terminate = true;
  });

  const context = await createContext();
  if (args.schedule) {
    scheduler.scheduleJob(AUTOMATION_CRON, async () => {
      if (executing) {
        // In the middle of executing, don't execute another.
        return;
      }

      if (terminate) {
        console.log('Process terminating');
        process.exit();
      }

      try {
        const status = await context.api.get<AutomationStatus>(
          'automation/status',
          { retries: 2 },
        );
        if (!status.enabled) {
          console.log(
            'Received disabled signal from API. Sleeping for 5 minutes and trying again.',
          );
          await sleep(FIVE_MINUTES_MS);
          return;
        }
      } catch (error) {
        console.log(
          'Encountered error when checking status. Sleeping for 5 minutes and trying again.',
        );
        await sleep(FIVE_MINUTES_MS);
        return;
      }

      executing = true;
      await executeAutomation(context);
      executing = false;
    });
  } else {
    await executeAutomation(context);
  }
}

function checkRequiredParameters() {
  if (!process.env.AUTOMATION_KEY) {
    throw new Error('Missing required env variable: AUTOMATION_KEY');
  }

  if (!process.env.AUTOMATION_URL) {
    throw new Error('Missing required env variable: AUTOMATION_URL');
  }
}

async function createContext() {
  const api = new ApiClient({
    axios,
    baseUrl: process.env.AUTOMATION_URL,
    apiKey: process.env.AUTOMATION_KEY,
  });
  const savedContext = await loadAutomationContext();
  return { api, ...savedContext } as AutomationContext;
}
