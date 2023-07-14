import * as scheduler from 'node-schedule';

const AUTOPILOT_CRON = '0,10 * * * *';

export interface AutopilotCommandArgs {
  schedule?: boolean;
}

export async function autopilotCommand(args: AutopilotCommandArgs) {
  // TODO:
  // Pull priority queue from website
  // Update sitemaps (fully automated) (daily? or weekly?)
  // Fetch new sources (approve/reject) (weekly? or bi-weekly?)
  // Fetch new/updated specs (approve/reject except for benchmarks) // Non-stop

  if (args.schedule) {
    scheduler.scheduleJob(AUTOPILOT_CRON, async () => {
      //
    });
  } else {
    //
  }
}
