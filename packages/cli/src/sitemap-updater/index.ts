import * as scheduler from 'node-schedule';
import { updateSitemap } from './updateSitemap';

const UPDATE_GPUS_CRON = '0 3 * * *';

export interface SitemapUpdaterCommandArgs {
  continuous?: boolean;
}

export async function sitemapUpdaterCommand(args: SitemapUpdaterCommandArgs) {
  if (args.continuous) {
    scheduler.scheduleJob(UPDATE_GPUS_CRON, async () => {
      await updateSitemap();
    });
  } else {
    await updateSitemap();
  }
}
