import { AutomationAction, AutomationQueueItem } from '@pcpartdb/shared';
import { createCpuAction } from './actions/createCpuAction';
import { updateCpuSourcesAction } from './actions/updateCpuSourcesAction';
import { AutomationContext, AutomationExecution } from './types';
import { saveAutomationContext } from './utils/context';
import { createExecutionError } from './utils/error';

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

  let execution: AutomationExecution = null;
  try {
    execution = await getNextExecution(context);
    const { action } = execution;

    await markAsProcessing(execution, context);

    if (action === AutomationAction.UpdateSitemaps) {
      //
    } else if (action === AutomationAction.UpdateCpuSources) {
      await updateCpuSourcesAction(execution, context);
    } else if (action === AutomationAction.UpdateGpuSources) {
      //
    } else if (action === AutomationAction.CreateCpu) {
      await createCpuAction(execution, context);
    } else if (action === AutomationAction.CreateGpu) {
      //
    } else {
      console.error(`Unsupported Action: ${action}`);
    }

    await saveAutomationContext(context);

    await markAsProcessed(execution, context);
  } catch (e) {
    console.error('Error occurred during automation execution', e);
    await markAsFailed(execution, e as Error, context);
  }

  executing = false;
}

async function markAsProcessing(
  execution: AutomationExecution,
  context: AutomationContext,
) {
  if (execution.queueItem != null) {
    await context.api.post(
      `automation/queue/${execution.queueItem.id}/processing`,
      null,
    );
  }

  console.info('Automation execution has started', execution);
}

async function markAsProcessed(
  execution: AutomationExecution,
  context: AutomationContext,
) {
  if (execution.queueItem != null) {
    await context.api.post(
      `automation/queue/${execution.queueItem.id}/processed`,
      null,
    );
  }

  console.info('Automation execution has completed');
}

async function markAsFailed(
  execution: AutomationExecution,
  error: Error,
  context: AutomationContext,
) {
  const executionError = createExecutionError(error);
  if (execution?.queueItem != null) {
    await context.api.post(
      `automation/queue/${execution.queueItem.id}/failed`,
      null,
    );
  }

  console.error('Automation execution has failed', executionError);
}

async function getNextExecution(
  context: AutomationContext,
): Promise<AutomationExecution> {
  // Action baesd on Priority Queue
  const queueAction = await getQueueExecution(context);
  if (queueAction != null) {
    return queueAction;
  }

  // Action based on staleness (e.g. stale sitemaps, product sources)
  const stalenessAction = await getStalenessExecution(context);
  if (stalenessAction != null) {
    return stalenessAction;
  }

  // No actions remaining, fallback to continuous ones (e.g. product updates)
  const fallbackAction = await getFallbackExecution(context);
  if (fallbackAction != null) {
    return fallbackAction;
  }

  return { action: null, payload: null, queueItem: null };
}

async function getQueueExecution(
  context: AutomationContext,
): Promise<AutomationExecution> {
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

async function getStalenessExecution(
  context: AutomationContext,
): Promise<AutomationExecution> {
  const { metadata } = context;

  if (isStale(metadata?.updateSitemapsDate, UPDATE_SITEMAPS_FREQUENCY)) {
    return { action: AutomationAction.UpdateSitemaps };
  }

  if (isStale(metadata?.updateCpuSourcesDate, UPDATE_CPU_SOURCES_FREQUENCY)) {
    return { action: AutomationAction.UpdateCpuSources };
  }

  if (isStale(metadata?.updateGpuSourcesDate, UPDATE_GPU_SOURCES_FREQUENCY)) {
    return { action: AutomationAction.UpdateGpuSources };
  }

  return null;
}

// TODO: determine order by last auto-updated
async function getFallbackExecution(
  context: AutomationContext,
): Promise<AutomationExecution> {
  // Determine which next thing to update.
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
