import { AutomationAction, AutomationQueueItem } from '@pcpartdb/shared';
import { createCpuAction } from './actions/createCpuAction';
import { updateCpuSourcesAction } from './actions/updateCpuSourcesAction';
import { AutomationContext } from './types';
import { saveAutomationMetadata } from './utils/metadata';

const UPDATE_SITEMAPS_FREQUENCY = 1000 * 60 * 60 * 24; // Daily
const UPDATE_CPU_SOURCES_FREQUENCY = 1000 * 60 * 60 * 24 * 7; // Weekly
const UPDATE_GPU_SOURCES_FREQUENCY = 1000 * 60 * 60 * 24 * 7; // Weekly

let executing = false;
export async function executeAutomation(context: AutomationContext) {
  if (executing) {
    // Already executing a task.
    return;
  }
  executing = true;

  const { action, payload, queueItem } = await getNextAction(context);

  // TODO: mark queue item as running

  if (action === AutomationAction.UpdateSitemaps) {
    //
  } else if (action === AutomationAction.UpdateCpuSources) {
    await updateCpuSourcesAction(context);
  } else if (action === AutomationAction.UpdateGpuSources) {
    //
  } else if (action === AutomationAction.CreateCpu) {
    await createCpuAction(payload, context);
  } else if (action === AutomationAction.CreateGpu) {
    //
  } else {
    console.error(`Unsupported Action: ${action}`);
  }

  // TODO: mark queue item as closed or failed

  await saveAutomationMetadata(context.metadata);

  executing = false;
}

async function getNextAction(context: AutomationContext) {
  // Action baesd on Priority Queue
  const queueAction = await getQueueAction(context);
  if (queueAction != null) {
    return queueAction;
  }

  // Action based on staleness (e.g. stale sitemaps, product sources)
  const stalenessAction = await getStalenessAction(context);
  if (stalenessAction != null) {
    return stalenessAction;
  }

  // No actions remaining, fallback to continuous ones (e.g. product updates)
  const fallbackAction = await getFallbackAction(context);
  if (fallbackAction != null) {
    return fallbackAction;
  }

  return { action: null, payload: null, queueItem: null };
}

async function getQueueAction(context: AutomationContext) {
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

async function getStalenessAction(context: AutomationContext) {
  const { metadata: executions } = context;

  if (isStale(executions?.updateSitemapsDate, UPDATE_SITEMAPS_FREQUENCY)) {
    //
  }

  if (isStale(executions?.updateCpuSourcesDate, UPDATE_CPU_SOURCES_FREQUENCY)) {
    //
  }

  if (isStale(executions?.updateGpuSourcesDate, UPDATE_GPU_SOURCES_FREQUENCY)) {
    //
  }

  return null;
}

async function getFallbackAction(context: AutomationContext) {
  return null;
}

function isStale(lastExecutionTime: number, frequency: number) {
  if (lastExecutionTime == null) {
    return true;
  }

  if (new Date().getTime() > lastExecutionTime + frequency) {
    return true;
  }

  return false;
}
