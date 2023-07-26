import {
  AutomationAction,
  AutomationActionStatus,
  AutomationActionType,
} from '@pcpartdb/shared';
import { createCpuAction } from './actions/createCpuAction';
import { updateCpuAction } from './actions/updateCpuAction';
import { updateCpuSourcesAction } from './actions/updateCpuSourcesAction';
import { AutomationContext } from './types';
import { saveAutomationContext } from './utils/context';

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

  let execution: AutomationAction = null;
  try {
    execution = await getNextAction(context);
    if (execution == null) {
      executing = false;
      return;
    }

    const { type: action } = execution;

    await markAsProcessing(execution, context);

    if (action === AutomationActionType.UpdateSitemaps) {
      //
    } else if (action === AutomationActionType.UpdateCpuSources) {
      await updateCpuSourcesAction(execution, context);
    } else if (action === AutomationActionType.CreateCpu) {
      await createCpuAction(execution, context);
    } else if (action === AutomationActionType.UpdateCpu) {
      await updateCpuAction(execution, context);
    } else if (action === AutomationActionType.CreateGpu) {
      //
    } else if (action === AutomationActionType.UpdateGpu) {
      //
    } else if (action === AutomationActionType.UpdateGpuChipsetSources) {
      //
    } else if (action === AutomationActionType.UpdateGpuRetailModelSources) {
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
  execution: AutomationAction,
  context: AutomationContext,
) {
  if (execution?.id != null) {
    await context.api.post(
      `automation/actions/${execution.id}/processing`,
      null,
    );
  }

  console.info('Automation execution has started', execution);
}

async function markAsProcessed(
  execution: AutomationAction,
  context: AutomationContext,
) {
  if (execution?.id != null) {
    await context.api.post(
      `automation/actions/${execution.id}/processed`,
      null,
    );
  }

  console.info('Automation execution has completed');
}

async function markAsFailed(
  execution: AutomationAction,
  error: Error,
  context: AutomationContext,
) {
  if (execution?.id != null) {
    await context.api.post(`automation/actions/${execution.id}/failed`, null);
  }

  console.error('Automation execution has failed', error);
}

async function getNextAction(
  context: AutomationContext,
): Promise<AutomationAction> {
  // Action based on staleness (e.g. stale sitemaps, product sources)
  const staleAction = await getActionFromStalenessCheck(context);
  if (staleAction != null) {
    console.info('Found next action based on staleness', staleAction);
    return staleAction;
  }

  // Action baesd on Priority Queue
  const queueAction = await getActionFromQueue(context);
  if (queueAction != null) {
    console.info('Found next action based on queue', queueAction);
    return queueAction;
  }

  // No actions remaining, fallback to continuous ones (e.g. product updates)
  const backlogAction = await getActionFromBacklog(context);
  if (backlogAction != null) {
    console.info('Found next action based on backlog', staleAction);
    return backlogAction;
  }

  return null;
}

async function getActionFromStalenessCheck(
  context: AutomationContext,
): Promise<AutomationAction> {
  const { metadata } = context;

  return null; // TODO: remove

  if (isStale(metadata?.updateSitemapsDate, UPDATE_SITEMAPS_FREQUENCY)) {
    return {
      status: AutomationActionStatus.Pending,
      type: AutomationActionType.UpdateSitemaps,
    };
  }

  if (isStale(metadata?.updateCpuSourcesDate, UPDATE_CPU_SOURCES_FREQUENCY)) {
    return {
      status: AutomationActionStatus.Pending,
      type: AutomationActionType.UpdateCpuSources,
    };
  }

  if (isStale(metadata?.updateGpuSourcesDate, UPDATE_GPU_SOURCES_FREQUENCY)) {
    return {
      status: AutomationActionStatus.Pending,
      type: AutomationActionType.UpdateGpuChipsetSources,
    };
  }

  return null;
}

async function getActionFromQueue(
  context: AutomationContext,
): Promise<AutomationAction> {
  const execution = await context.api.get<AutomationAction>(
    'automation/actions/next',
  );

  return execution || null;
}

async function getActionFromBacklog(
  context: AutomationContext,
): Promise<AutomationAction> {
  const execution = await context.api.post<AutomationAction>(
    'automation/actions/next-backlog',
    null,
  );

  return execution || null;
}

function isStale(lastActionTime: number, frequency: number) {
  if (lastActionTime == null) {
    return true;
  }

  if (new Date().getTime() > lastActionTime + frequency) {
    return true;
  }

  return false;
}
