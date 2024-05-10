import { CpuAutomationSourceGroup, GpuAutomationSourceGroup } from './types';

export enum AutomationActionType {
  /**
   * Update sitemaps on the website. Pull CPUs and GPUs from API,
   * creates sitemap files, and uploads to the website.
   */
  UpdateSitemaps = 'UPDATE_SITEMAPS',

  /**
   * Updates sitemaps that have priority URLs. These are a limited set
   * of URLs that we have determined are more important for indexing.
   */
  UpdatePrioritySitemaps = 'UPDATE_PRIORITY_SITEMAPS',

  /**
   * Downloads and parses CPU sources that later gets used for to fetch
   * CPU data. Sources require approval after being fetched.
   */
  UpdateCpuSources = 'UPDATE_CPU_SOURCES',

  /**
   * Downloads and parses GPU sources that later gets used for to fetch
   * GPU data. Sources require approval after being fetched.
   */
  UpdateGpuChipsetSources = 'UPDATE_GPU_CHIPSET_SOURCES',

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

  /**
   * Recalculates performance and value ranks for each product.
   */
  UpdateRanks = 'UPDATE_RANKS',

  /**
   * Recalculates related products for some products
   */
  UpdateRelatedProducts = 'UPDATE_RELATED_PRODUCTS',
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

  // Slug to use when creating CPU
  preferredSlug?: string;

  // For fetching data based on a new CPU.
  sources?: CpuAutomationSourceGroup;
}

export interface UpdateCpuActionData {
  // For fetching data based on an existing CPU.
  cpuId?: number;
}

export interface CreateGpuActionData {
  // Name to use when creating GPU
  preferredName?: string;

  // Slug to use when creating GPU
  preferredSlug?: string;

  // For fetching data based on a new GPU.
  sources?: GpuAutomationSourceGroup;
  relatedProductId?: number;
}

export interface UpdateGpuActionData {
  // For fetching data based on an existing GPU.
  gpuId?: number;
}
