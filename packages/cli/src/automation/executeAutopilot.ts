import { AutomationAction } from '@pcpartdb/shared';
import { createCpuAction, updateCpuSourcesAction } from './actions';
import { AutomationContext } from './types';

let executing = false;
export async function executeAutopilot(context: AutomationContext) {
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

  if (action === AutomationAction.UpdateSitemaps) {
    //
  } else if (action === AutomationAction.UpdateCpuSources) {
    await updateCpuSourcesAction(context);
  } else if (action === AutomationAction.UpdateGpuSources) {
    //
  } else if (action === AutomationAction.CreateCpu) {
    await createCpuAction(null, context);
  } else if (action === AutomationAction.CreateGpu) {
    //
  } else {
    console.error(`Unsupported Action: ${action}`);
  }

  executing = false;
}

function getNextAction(context: AutomationContext) {
  // TODO: get next action, first check from priority queue,
  // then determine based on staleness, then update gpus/cpus
  return AutomationAction.UpdateCpuSources as AutomationAction;
}
