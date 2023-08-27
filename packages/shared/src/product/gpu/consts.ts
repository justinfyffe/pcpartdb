import {
  ListGpusOrder,
  ListGpusPresetSlug,
  ListGpusQuery,
  ListGpusSort,
} from './types';

export const DEFAULT_LIST_GPUS_LIMIT = 50;
export const DEFAULT_LIST_GPUS_OFFSET = 0;
export const DEFAULT_LIST_GPUS_SORT = ListGpusSort.PerformanceRating;
export const DEFAULT_LIST_GPUS_ORDER = ListGpusOrder.Desc;

export const LIST_GPUS_PRESETS: Record<ListGpusPresetSlug, ListGpusQuery> = {
  [ListGpusPresetSlug.BestPerformance]: {
    filter: {},
    orderBy: {
      sort: ListGpusSort.PerformanceRating,
      order: ListGpusOrder.Desc,
    },
  },
  [ListGpusPresetSlug.BestPerformanceAmd]: {
    filter: { company: ['amd'] },
    orderBy: {
      sort: ListGpusSort.PerformanceRating,
      order: ListGpusOrder.Desc,
    },
  },
  [ListGpusPresetSlug.BestPerformanceNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: {
      sort: ListGpusSort.PerformanceRating,
      order: ListGpusOrder.Desc,
    },
  },
  [ListGpusPresetSlug.BestValue]: {
    filter: {},
    orderBy: { sort: ListGpusSort.ValueRating, order: ListGpusOrder.Desc },
  },
  [ListGpusPresetSlug.BestValueAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: ListGpusSort.ValueRating, order: ListGpusOrder.Desc },
  },
  [ListGpusPresetSlug.BestValueNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: ListGpusSort.ValueRating, order: ListGpusOrder.Desc },
  },
  [ListGpusPresetSlug.Newest]: {
    filter: {},
    orderBy: { sort: ListGpusSort.ReleaseDate, order: ListGpusOrder.Desc },
  },
  [ListGpusPresetSlug.Oldest]: {
    filter: {},
    orderBy: { sort: ListGpusSort.ReleaseDate, order: ListGpusOrder.Asc },
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
  company: 'Manufacturer',
  marketSegment: 'Market Segment',
  launchPrice: 'Launch Price (MSRP)',
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
  thermalDesignPower: 'Thermal Design Power (TDP)',
  suggestedPsu: 'Suggested PSU',
  busInterface: 'Bus Interface',
  powerConnectors: 'Power Connectors',
  outputs: 'Outputs',

  // Cores & Clock Speeds
  shaderUnitsCudaCores: 'Shader Units / CUDA Cores',
  computeUnitsSmCount: 'Compute Units / SM Count',
  textureMappingUnits: 'Texture Mapping Units (TMUs)',
  renderOutputUnits: 'Render Output Units (ROPs)',
  tensorCores: 'Tensor Cores',
  rayTracingCores: 'Ray Tracing Cores',
  coreClockSpeedBase: 'Clock Speed (Base)',
  coreClockSpeedBoost: 'Clock Speed (Boost)',
  l1Cache: 'L1 Cache',
  l2Cache: 'L2 Cache',

  // Theoretical Performance
  pixelFillRate: 'Pixel Fill Rate',
  textureFillRate: 'Texture Fill Rate',
  fp32Performance: 'FP32 Performance',
  fp64Performance: 'FP64 Performance',

  // API Support
  directxVersion: 'DirectX',
  openClVersion: 'OpenCL',
  openGlVersion: 'OpenGL',
  shaderModelVersion: 'Shader Model',

  // Benchmarks
  g3dMark: 'G3D Mark',
  g2dMark: 'G2D Mark',
  timespyGraphics: '3DMark Time Spy Graphics',
};
