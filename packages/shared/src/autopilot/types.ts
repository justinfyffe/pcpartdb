import { User } from '../user';

export enum AutopilotQueueStatus {
  Pending = 'PENDING',
  Processed = 'PROCESSED',
  Deleted = 'DELETED',
}

export enum AutopilotQueueAction {
  /**
   * Update sitemaps on the website. Pull CPUs and GPUs from API,
   * creates sitemap files, and uploads to the website.
   */
  UpdateSitemaps = 'UPDATE_SITEMAPS',

  /**
   * Downloads and parses CPU sources that later gets used for to fetch
   * CPU data. Sources require approval after being fetched.
   */
  FetchCpuSources = 'FETCH_CPU_SOURCES',

  /**
   * Downloads and parses GPU sources that later gets used for to fetch
   * GPU data. Sources require approval after being fetched.
   */
  FetchGpuSources = 'FETCH_GPU_SOURCES',

  /**
   * Downloads and parses CPU data from the provided sources. Creates a
   * CPU_DATA approval entry for newly found data.
   */
  FetchCpuData = 'FETCH_CPU_DATA',

  /**
   * Downloads and parses GPU data from the provided sources. Creates a
   * GPU_DATA approval entry for newly found data.
   */
  FetchGpuData = 'FETCH_GPU_DATA',
}

/**
 * Automation actions that we want to prioritize in a queue. Some actions may
 * result in additional actions or require approvals Examples:
 * - FETCH_CPU_SOURCES creates a CPU_SOURCE approval entry.
 * - Approving a CPU_SOURCE entry queues a FETCH_CPU_DATA action.
 * - FETCH_CPU_DATA creates a CPU_DATA approval entry.
 *   - Note: UPDATE_CPU does not always create an approval entry, depending on
 *     what data is being updated.
 * -
 * Priority queue is ordered by `priority DESC, timestamp ASC`
 */
export interface AutopilotQueueItem<T = unknown> {
  id?: number;
  statusUserId?: number;

  description?: string;
  status?: AutopilotQueueStatus;
  action?: AutopilotQueueAction;

  data?: T;
  metadata?: unknown;

  priority?: number;
  timestamp?: number;

  statusUpdatedAt?: number;

  // Relations
  statusUser?: User;
}

export enum AutopilotApprovalStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
}

export enum AutopilotApprovalType {
  /**
   * Approve new CPU sources, or apply it to an existing CPU.
   */
  CpuSource = 'CPU_SOURCE',

  /**
   * Approve fetched CPU data for new or exisitng CPUs.
   */
  CpuData = 'CPU_DATA',

  /**
   * Approve new GPU sources, or apply it to an existing GPU.
   */
  GpuSource = 'GPU_SOURCE',

  /**
   * Approve fetched GPU data for new or existing GPUs.
   */
  GpuData = 'GPU_DATA',
}

/**
 * Data pulled from autopilot that we want manual approval before applying it
 * to our database. Not every autopilot action results in an approval entry.
 */
export interface AutopilotApprovalItem<T = unknown> {
  id?: number;
  statusUserId?: number;
  queueItemId?: number;

  description?: string;
  status?: AutopilotApprovalStatus;
  type?: AutopilotApprovalType;

  data?: T;
  metadata?: unknown;

  statusUpdatedAt?: number;

  // Relations
  statusUser?: User;
  queueItem?: AutopilotQueueItem;
}

/**
 * Logs generated from autopilot
 */
export interface AutopilotLogItem<T = unknown> {
  id?: number;
  queueItemId?: number;
  approvalItemId?: number;

  description?: string;

  data?: T;
  metadata?: unknown;

  timestamp?: number;

  // Relations
  queueItem?: AutopilotQueueItem;
  approvalItem?: AutopilotApprovalItem;
}
