import { AutopilotQueueAction } from '@pcpartdb/shared';
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

  if (action === AutopilotQueueAction.UpdateSitemaps) {
    //
  } else if (action === AutopilotQueueAction.FetchCpuSources) {
    //
  } else if (action === AutopilotQueueAction.FetchGpuSources) {
    //
  } else if (action === AutopilotQueueAction.CreateCpu) {
    //
  } else if (action === AutopilotQueueAction.UpdateCpu) {
    //
  } else if (action === AutopilotQueueAction.CreateGpu) {
    //
  } else if (action === AutopilotQueueAction.UpdateGpu) {
    //
  } else {
    console.error(`Unsupported Action: ${action}`);
  }

  executing = false;
}

function getNextAction(context: AutopilotContext) {
  // TODO: get next action, first check from priority queue,
  // then determine based on staleness, then update gpus/cpus
  return null as AutopilotQueueAction;
}
