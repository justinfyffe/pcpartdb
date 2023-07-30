import { AutomationAction, AutomationQueueItem } from '@pcpartdb/shared';
import { createCpuAction } from './actions/createCpuAction';
import { updateCpuSourcesAction } from './actions/updateCpuSourcesAction';
import { AutomationContext } from './types';

let executing = false;
export async function executeAutomation(context: AutomationContext) {
  if (executing) {
    // Already executing a task.
    return;
  }
  executing = true;

  const { action, payload } = await getNextAction(context);

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

  // TODO: close queue item

  executing = false;
}

async function getNextAction(context: AutomationContext) {
  const queueAction = await getActionFromQueue(context);
  if (queueAction != null) {
    return queueAction;
  }

  // TODO: get next action, first check from priority queue,
  // then determine based on staleness, then update gpus/cpus
  return {
    action: AutomationAction.UpdateCpuSources,
    payload: null,
    queueItem: null,
  };
}

async function getActionFromQueue(context: AutomationContext) {
  const queueItem = await context.api.get<AutomationQueueItem>(
    'automation/queue/next',
  );

  if (queueItem != null) {
    const action = queueItem.action;
    const payload = queueItem.data;
    return { action, payload, queueItem };
  }

  return null;
}

async function getActionFromStaleness() {}
