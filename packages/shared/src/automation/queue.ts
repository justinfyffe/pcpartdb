export enum AutomationQueueStatus {
  Pending = 'PENDING',
  Processed = 'PROCESSED',
  Deleted = 'DELETED',
}

export enum AutomationQueueAction {
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
export interface AutomationQueueItem<T = unknown> {
  id?: number;

  description?: string;
  status?: AutomationQueueStatus;
  action?: AutomationQueueAction;

  data?: T;
  metadata?: unknown;

  priority?: number;
  timestamp?: number;

  statusUpdatedAt?: number;
}
