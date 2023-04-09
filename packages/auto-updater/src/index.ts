import * as scheduler from 'node-schedule';

const UPDATE_GPUS_CRON = '*/30 * * * *';

scheduler.scheduleJob(UPDATE_GPUS_CRON, () => {});
