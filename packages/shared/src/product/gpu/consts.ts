import { ListOrder, ListSort } from '../../common';
import { ListProductsQuery } from '../types';
import { ListGpusPresetSlug } from './types';

export const DEFAULT_LIST_GPUS_LIMIT = 50;
export const DEFAULT_LIST_GPUS_OFFSET = 0;
export const DEFAULT_LIST_GPUS_SORT = ListSort.PerformanceRating;
export const DEFAULT_LIST_GPUS_ORDER = ListOrder.Desc;

export const LIST_GPUS_PRESETS: Record<ListGpusPresetSlug, ListProductsQuery> =
  {
    [ListGpusPresetSlug.BestPerformance]: {
      filter: {},
      orderBy: {
        sort: ListSort.PerformanceRating,
        order: ListOrder.Desc,
      },
    },
    [ListGpusPresetSlug.BestPerformanceAmd]: {
      filter: { company: ['amd'] },
      orderBy: {
        sort: ListSort.PerformanceRating,
        order: ListOrder.Desc,
      },
    },
    [ListGpusPresetSlug.BestPerformanceNvidia]: {
      filter: { company: ['nvidia'] },
      orderBy: {
        sort: ListSort.PerformanceRating,
        order: ListOrder.Desc,
      },
    },
    [ListGpusPresetSlug.BestValue]: {
      filter: {},
      orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
    },
    [ListGpusPresetSlug.BestValueAmd]: {
      filter: { company: ['amd'] },
      orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
    },
    [ListGpusPresetSlug.BestValueNvidia]: {
      filter: { company: ['nvidia'] },
      orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
    },
    [ListGpusPresetSlug.Newest]: {
      filter: { hasReleaseDate: true },
      orderBy: { sort: ListSort.ReleaseDate, order: ListOrder.Desc },
    },
    [ListGpusPresetSlug.Oldest]: {
      filter: { hasReleaseDate: true },
      orderBy: { sort: ListSort.ReleaseDate, order: ListOrder.Asc },
    },
  };

export const SUPPORTED_GPU_COMPANIES = [
  'acer',
  'amd',
  'asrock',
  'asus',
  'ati',
  'evga',
  'gainward',
  'galax',
  'gigabyte',
  'inno3d',
  'intel',
  'msi',
  'nvidia',
  'pny',
  'powercolor',
  'sapphire',
  'xfx',
  'zotac',
];

export const GPU_FIELD_LABELS: Record<string, string> = {
  name: 'Name',

  // General
  partNumber: 'Part Number',
  marketSegment: 'Market Segment',
  msrp: 'Launch Price (MSRP)',
  releaseDate: 'Release Date',
  productionStatus: 'Production Status',

  // Processor
  codename: 'Codename',
  architecture: 'Architecture',
  processSize: 'Process Size',
  transistors: 'Transistors',

  // Memory
  memorySize: 'Memory Size',
  memoryType: 'Memory Type',
  memoryClock: 'Memory Clock',
  memoryInterface: 'Memory Interface',
  memoryBandwidth: 'Memory Bandwidth',

  // Board Design
  slotWidth: 'Slots',
  length: 'Length',
  width: 'Width',
  height: 'Height',
  weight: 'Weight',
  tdp: 'Thermal Design Power (TDP)',

  suggestedPsu: 'Suggested PSU',
  busInterface: 'Bus Interface',
  powerConnectors: 'Power Connectors',
  outputs: 'Outputs',

  // Cores & Clock Speeds
  gpuCores: 'GPU Cores',
  computeUnits: 'Compute Units',
  tmus: 'Texture Mapping Units (TMUs)',
  rops: 'Render Output Units (ROPs)',
  tensorCores: 'Tensor Cores',
  rtCores: 'Ray Tracing Cores',
  gpuCoreBaseClock: 'Clock Speed (Base)',
  gpuCoreBoostClock: 'Clock Speed (Boost)',
  l1Cache: 'L1 Cache',
  l2Cache: 'L2 Cache',

  // Theoretical Performance
  pixelRate: 'Pixel Fill Rate',
  textureRate: 'Texture Fill Rate',
  fp32: 'FP32 Performance',
  fp64: 'FP64 Performance',

  // API Support
  directxVersion: 'DirectX',
  openClVersion: 'OpenCL',
  openGlVersion: 'OpenGL',
  shaderModelVersion: 'Shader Model',
};
