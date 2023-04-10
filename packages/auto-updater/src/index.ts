import * as scheduler from 'node-schedule';
import { gpuUpdater } from './gpu-updater';

const UPDATE_GPUS_CRON = '*/30 * * * *';

scheduler.scheduleJob(UPDATE_GPUS_CRON, async () => {
  await gpuUpdater();
});
