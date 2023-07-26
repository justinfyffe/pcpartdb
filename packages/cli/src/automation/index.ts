import axios from 'axios';
import * as scheduler from 'node-schedule';
import { ApiClient } from '../shared/ApiClient';
import { executeAutomation } from './executeAutomation';
import { AutomationContext } from './types';
import { loadAutomationMetadata } from './utils/metadata';

const AUTOMATION_CRON = '0-59 * * * *';

export interface AutomationCommandArgs {
  schedule?: boolean;
}

export async function automationCommand(args: AutomationCommandArgs) {
  checkRequiredParameters();

  const context = await createContext();
  if (args.schedule) {
    scheduler.scheduleJob(AUTOMATION_CRON, async () => {
      await executeAutomation(context);
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
  const metadata = await loadAutomationMetadata();
  return { api, metadata } as AutomationContext;
}
