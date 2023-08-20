import { AutomationStatus } from '@pcpartdb/shared';
import axios from 'axios';
import * as scheduler from 'node-schedule';
import { ApiClient } from '../shared/ApiClient';
import { sleep } from '../shared/process';
import { executeAutomation } from './executeAutomation';
import { AutomationContext } from './types';
import { loadAutomationContext } from './utils/context';

const REQUEST_CHUNK_DELAY = 5_000;
const CONCURRENCY = false;

const AUTOMATION_CRON = '0-59 * * * *';
const FIVE_MINUTES_MS = 1000 * 60 * 5;
const DEFAULT_ENV = 'dev';

export interface AutomationCommandArgs {
  continuous?: boolean;
  env?: string;
}

export async function automationCommand(args: AutomationCommandArgs) {
  checkRequiredParameters(args.env || DEFAULT_ENV);

  let executing = false;
  let terminate = false;
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    if (terminate) {
      console.log('Received another termination signal. Killing the process.');
      process.exit();
    } else {
      console.log(
        'Received termination signal. Shutting down after execution finishes.',
      );
      terminate = true;
    }
  });

  const context = await createContext(args.env || DEFAULT_ENV);
  if (args.continuous) {
    scheduler.scheduleJob(AUTOMATION_CRON, async () => {
      if (executing) {
        // In the middle of executing, don't execute another.
        return;
      }

      if (terminate) {
        console.log('Process terminated');
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

function checkRequiredParameters(env: string) {
  if (!getAutomationKey(env)) {
    throw new Error(
      `Missing required env variable: AUTOMATION_KEY_${env.toUpperCase()}`,
    );
  }

  if (!getAutomationUrl(env)) {
    throw new Error(
      `Missing required env variable: AUTOMATION_URL_${env.toUpperCase()}`,
    );
  }
}

async function createContext(env: string) {
  const api = new ApiClient({
    axios,
    baseUrl: getAutomationUrl(env),
    apiKey: getAutomationKey(env),
  });
  const savedContext = await loadAutomationContext();
  return {
    api,
    concurrency: CONCURRENCY,
    requestChunkDelay: REQUEST_CHUNK_DELAY,
    ...savedContext,
  } as AutomationContext;
}

function getAutomationUrl(env: string) {
  const ucEnv = env.toUpperCase();
  return process.env[`AUTOMATION_URL_${ucEnv}`];
}

function getAutomationKey(env: string) {
  const ucEnv = env.toUpperCase();
  return process.env[`AUTOMATION_KEY_${ucEnv}`];
}
