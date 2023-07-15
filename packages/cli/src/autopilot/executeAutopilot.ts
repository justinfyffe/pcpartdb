import { AutopilotAction } from '@pcpartdb/shared';
import { AutopilotContext } from './types';

let executing = false;
export async function executeAutopilot(context: AutopilotContext) {
  if (executing) {
    // Already executing a task.
    return;
  }
  executing = true;

  const action = getNextAction(context);

  // Pull next entry from priority queue, if no entry, then determine next general task
  //    Check local config file for last time sitemaps and sources was run
  //    Update sitemaps (fully automated) (daily? or weekly?)
  //    Fetch new sources (approve/reject) (weekly? or bi-weekly?)
  //    Fetch new/updated specs (approve/reject except for benchmarks) // Non-stop

  if (action === AutopilotAction.UpdateSitemaps) {
    //
  } else if (action === AutopilotAction.FetchCpuSources) {
    //
  } else if (action === AutopilotAction.FetchGpuSources) {
    //
  } else if (action === AutopilotAction.CreateCpu) {
    //
  } else if (action === AutopilotAction.UpdateCpu) {
    //
  } else if (action === AutopilotAction.CreateGpu) {
    //
  } else if (action === AutopilotAction.UpdateGpu) {
    //
  } else {
    console.error(`Unsupported Action: ${action}`);
  }

  executing = false;
}

function getNextAction(context: AutopilotContext) {
  // TODO: get next action, first check from priority queue,
  // then determine based on staleness, then update gpus/cpus
  return null as AutopilotAction;
}
