import { ProductSourceGroup } from '../product';

// TODO: Rename to
// UPDATE_CPU_SOURCES
// UPDATE_CPU
// CREATE_CPU
export enum AutomationAction {
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
   * Downloads and parses GPU sources that later gets used for to fetch
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
