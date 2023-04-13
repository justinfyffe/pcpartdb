import * as scheduler from 'node-schedule';
import { updateNextGpu } from './updateNextGpu';

const UPDATE_GPUS_CRON = '*/30 * * * *';

export interface GpuUpdaterCommandArgs {
  schedule?: boolean;
}

export async function gpuUpdaterCommand(args: GpuUpdaterCommandArgs) {
  if (args.schedule) {
    scheduler.scheduleJob(UPDATE_GPUS_CRON, async () => {
      await updateNextGpu();
    });
  } else {
    await updateNextGpu();
  }
}
