import {
  AutomationAction,
  AutomationActionStatus,
  AutomationActionType,
} from '@pcpartdb/shared';
import { createCpuAction } from './actions/createCpuAction';
import { createGpuAction } from './actions/createGpuAction';
import { updateCpuAction } from './actions/updateCpuAction';
import { updateCpuSourcesAction } from './actions/updateCpuSourcesAction';
import { updateGpuAction } from './actions/updateGpuAction';
import { updateGpuChipsetSourcesAction } from './actions/updateGpuChipsetSourcesAction';
import { updatePrioritySitemapsAction } from './actions/updatePrioritySitemapsAction';
import { updateRanksAction } from './actions/updateRanksAction';
import { updateRelatedProductsAction } from './actions/updateRelatedProductsAction';
import { updateSitemapsAction } from './actions/updateSitemapsAction';
import { AutomationContext } from './types';
import { saveAutomationContext } from './utils/context';

const UPDATE_PRIORITY_SITEMAPS_FREQUENCY = 1000 * 60 * 60 * 24 * 7; // Weekly
const UPDATE_SITEMAPS_FREQUENCY = 1000 * 60 * 60 * 24 * 7; // Weekly
const UPDATE_CPU_SOURCES_FREQUENCY = 1000 * 60 * 60 * 24 * 7; // Weekly
const UPDATE_GPU_CHIPSET_SOURCES_FREQUENCY = 1000 * 60 * 60 * 24 * 7; // Weekly
const UPDATE_RANKS_FREQUENCY = 1000 * 60 * 30; // Every 30 minutes
const UPDATE_RELATED_PRODUCTS_FREQUENCY = 1000 * 60 * 60 * 12; // Every 12 hours

export async function executeAutomation(context: AutomationContext) {
  const action = await getNextAction(context);

  if (action == null) {
    return;
  }

  const { type } = action;

  await markAsProcessing(action, context);

  if (type === AutomationActionType.UpdatePrioritySitemaps) {
    await updatePrioritySitemapsAction(action, context);
  } else if (type === AutomationActionType.UpdateSitemaps) {
    await updateSitemapsAction(action, context);
  } else if (type === AutomationActionType.UpdateCpuSources) {
    await updateCpuSourcesAction(action, context);
  } else if (type === AutomationActionType.CreateCpu) {
    await createCpuAction(action, context);
  } else if (type === AutomationActionType.UpdateCpu) {
    await updateCpuAction(action, context);
  } else if (type === AutomationActionType.CreateGpu) {
    await createGpuAction(action, context);
  } else if (type === AutomationActionType.UpdateGpu) {
    await updateGpuAction(action, context);
  } else if (type === AutomationActionType.UpdateGpuChipsetSources) {
    await updateGpuChipsetSourcesAction(action, context);
  } else if (type === AutomationActionType.UpdateRanks) {
    await updateRanksAction(action, context);
  } else if (type === AutomationActionType.UpdateRelatedProducts) {
    await updateRelatedProductsAction(action, context);
  } else {
    console.error(`Unsupported Action: ${action}`);
  }

  await saveAutomationContext(context);

  await markAsProcessed(action, context);
}

async function markAsProcessing(
  execution: AutomationAction,
  context: AutomationContext,
) {
  if (execution?.id != null) {
    await context.api.post(
      `automation/actions/${execution.id}/processing`,
      null,
      { retries: 2 },
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
      { retries: 2 },
    );
  }

  console.info('Automation execution has completed');
}

async function getNextAction(
  context: AutomationContext,
): Promise<AutomationAction> {
  // Action based on staleness (e.g. stale sitemaps, automation sources)
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
    console.info('Found next action based on backlog', backlogAction);
    return backlogAction;
  }

  return null;
}

async function getActionFromStalenessCheck(
  context: AutomationContext,
): Promise<AutomationAction> {
  const { metadata } = context;
  if (isStale(metadata?.updateRanksDate, UPDATE_RANKS_FREQUENCY)) {
    return {
      status: AutomationActionStatus.Pending,
      type: AutomationActionType.UpdateRanks,
    };
  }

  if (
    isStale(
      metadata?.updateRelatedProductsDate,
      UPDATE_RELATED_PRODUCTS_FREQUENCY,
    )
  ) {
    return {
      status: AutomationActionStatus.Pending,
      type: AutomationActionType.UpdateRelatedProducts,
    };
  }

  if (
    isStale(
      metadata?.updatePrioritySitemapsDate,
      UPDATE_PRIORITY_SITEMAPS_FREQUENCY,
    )
  ) {
    return {
      status: AutomationActionStatus.Pending,
      type: AutomationActionType.UpdatePrioritySitemaps,
    };
  }

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

  if (
    isStale(
      metadata?.updateGpuChipsetSourcesDate,
      UPDATE_GPU_CHIPSET_SOURCES_FREQUENCY,
    )
  ) {
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
    { retries: 2 },
  );

  return execution || null;
}

async function getActionFromBacklog(
  context: AutomationContext,
): Promise<AutomationAction> {
  const execution = await context.api.post<AutomationAction>(
    'automation/actions/next-backlog',
    null,
    { retries: 2 },
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
