import { ProductSourceGroup } from '../product';

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

export interface FetchCpuDataAction {
  // Name to use when creating CPU
  preferredName?: string;

  // For fetching data based on a new CPU.
  sources?: ProductSourceGroup;

  // For fetching data based on an existing CPU.
  cpuId?: number;
}
