import { ProductSourceGroup } from '../product';

export enum AutomationActionType {
  /**
   * Update sitemaps on the website. Pull CPUs and GPUs from API,
   * creates sitemap files, and uploads to the website.
   */
  UpdateSitemaps = 'UPDATE_SITEMAPS',

  /**
   * Downloads and parses CPU sources that later gets used for to fetch
   * CPU data. Sources require approval after being fetched.
   */
  UpdateCpuSources = 'UPDATE_CPU_SOURCES',

  /**
   * Downloads and parses GPU chipset sources that later gets used for to fetch
   * GPU data. Sources require approval after being fetched.
   */
  UpdateGpuSources = 'UPDATE_GPU_SOURCES',

  /**
   * Downloads and parses CPU data from the provided sources. Creates a
   * CPU_DATA approval entry for newly found data.
   */
  CreateCpu = 'CREATE_CPU',

  /**
   * Downloads and parses CPU data from the provided sources. Creates a
   * CPU_DATA approval entry for newly found data.
   */
  UpdateCpu = 'UPDATE_CPU',

  /**
   * Downloads and parses GPU data from the provided sources. Creates a
   * GPU_DATA approval entry for newly found data.
   */
  CreateGpu = 'CREATE_GPU',

  /**
   * Downloads and parses GPU data from the provided sources. Creates a
   * GPU_DATA approval entry for newly found data.
   */
  UpdateGpu = 'UPDATE_GPU',
}

export enum AutomationActionStatus {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Processed = 'PROCESSED',
  Failed = 'FAILED',
  Canceled = 'CANCELED',
}

/**
 * Automation actions that we want to prioritize in a queue. Some actions may
 * result in additional actions or require approvals
 *
 * Priority queue is ordered by `priority DESC, timestamp ASC`
 */
export interface AutomationAction<T = unknown> {
  id?: number;

  type: AutomationActionType;
  status: AutomationActionStatus;
  description?: string;

  data?: T;
  metadata?: AutomationActionMeta;

  priority?: number;
  timestamp?: number;
}

export interface AutomationActionMeta {}

export interface CreateCpuActionData {
  // Name to use when creating CPU
  preferredName?: string;

  // For fetching data based on a new CPU.
  sources?: ProductSourceGroup;
}

export interface UpdateCpuActionData {
  // For fetching data based on an existing CPU.
  cpuId?: number;
}

export interface CreateGpuActionData {
  // Name to use when creating GPU
  preferredName?: string;

  // For fetching data based on a new GPU.
  sources?: ProductSourceGroup;
}

export interface UpdateGpuActionData {
  // For fetching data based on an existing GPU.
  gpuId?: number;
}
