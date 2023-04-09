import * as scheduler from 'node-schedule';
import { gpuUpdater } from './gpu-updater';
import { getDatabase } from './shared/database';

// const UPDATE_GPUS_CRON = '*/30 * * * *';

// scheduler.scheduleJob(UPDATE_GPUS_CRON, async () => {
//   const db = await getDatabase();
//   await db.transaction(async (trx) => {
//     await gpuUpdater(trx);
//   });
// });

async function main() {
  const db = await getDatabase();
  await db.transaction(async (trx) => {
    await gpuUpdater(trx);
  });
}
main();
