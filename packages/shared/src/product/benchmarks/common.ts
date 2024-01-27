import { ProductType } from '../common';

// Enums

export enum BenchmarkKey {
  // CPU Benchmarks

  // CPU - 7-Zip
  _7Zip_18_03_Multi_Thread = '7ZIP_18_03_MULTI_THREAD',
  _7Zip_18_03_Single_Thread = '7ZIP_18_03_SINGLE_THREAD',

  // CPU - 3D Mark
  _3dMark_06_Cpu = '3DMARK_06_CPU',
  _3dMark_11_Performance_Physics = '3DMARK_11_PERFORMANCE_PHYSICS',
  _3dMark_Cloud_Gate_Physics = '3DMARK_CLOUD_GATE_PHYSICS',
  _3dMark_Fire_Strike_Standard_Physics = '3DMARK_FIRE_STRIKE_STANDARD_PHYSICS',
  _3dMark_Ice_Storm_Extreme_Physics = '3DMARK_ICE_STORM_EXTREME_PHYSICS',
  _3dMark_Ice_Storm_Physics = '3DMARK_ICE_STORM_PHYSICS',
  _3dMark_Ice_Storm_Unlimited_Physics = '3DMARK_ICE_STORM_UNLIMITED_PHYSICS',
  _3dMark_Time_Spy_Cpu = '3DMARK_TIME_SPY_CPU',

  // CPU - Cinebench
  Cinebench_R11_5_Multi_Core = 'CINEBENCH_R11_5_MULTI_CORE',
  Cinebench_R11_5_Single_Core = 'CINEBENCH_R11_5_SINGLE_CORE',
  Cinebench_R15_Multi_Core = 'CINEBENCH_R15_MULTI_CORE',
  Cinebench_R15_Single_Core = 'CINEBENCH_R15_SINGLE_CORE',
  Cinebench_R20_Multi_Core = 'CINEBENCH_R20_MULTI_CORE',
  Cinebench_R20_Single_Core = 'CINEBENCH_R20_SINGLE_CORE',
  Cinebench_R23_Multi_Core = 'CINEBENCH_R23_MULTI_CORE',
  Cinebench_R23_Single_Core = 'CINEBENCH_R23_SINGLE_CORE',

  // CPU - Geekbench
  Geekbench_4_4_Multi_Core = 'GEEKBENCH_4_4_MULTI_CORE',
  Geekbench_4_4_Single_Core = 'GEEKBENCH_4_4_SINGLE_CORE',
  Geekbench_5_0_Multi_Core = 'GEEKBENCH_5_0_MULTI_CORE',
  Geekbench_5_0_Single_Core = 'GEEKBENCH_5_0_SINGLE_CORE',
  Geekbench_5_4_Multi_Core = 'GEEKBENCH_5_4_MULTI_CORE',
  Geekbench_5_4_Single_Core = 'GEEKBENCH_5_4_SINGLE_CORE',
  Geekbench_6_2_Multi_Core = 'GEEKBENCH_6_2_MULTI_CORE',
  Geekbench_6_2_Single_Core = 'GEEKBENCH_6_2_SINGLE_CORE',

  // CPU - PassMark
  PassMark_CpuMark_Multi_Thread = 'PASSMARK_CPU_MARK_MULTI_THREAD',
  PassMark_CpuMark_Single_Thread = 'PASSMARK_CPU_MARK_SINGLE_THREAD',
  CpuMark_Multi_Thread = 'CPU_MARK_MULTI_THREAD', // TODO: delete after removed from db
  CpuMark_Single_Thread = 'CPU_MARK_SINGLE_THREAD', // TODO: delete after removed from db

  // CPU - WinRar
  WinRar_4_0 = 'WINRAR_4_0',

  // GPU Benchmarks

  // GPU - 3DMark
  _3dMark_2001SE_Standard = '3DMARK_2001_STANDARD',
  _3dMark_03_Standard = '3DMARK_03_STANDARD',
  _3dMark_05_Standard = '3DMARK_05_STANDARD',
  _3dMark_06_Standard = '3DMARK_06_STANDARD',
  _3dMark_11_Performance_Gpu = '3DMARK_11_PERFORMANCE_GPU',
  _3dMark_11_Performance_Score = '3DMARK_11_PERFORMANCE_SCORE',
  _3dMark_Cloud_Gate_Graphics = '3DMARK_CLOUD_GATE_GRAPHICS',
  _3dMark_Cloud_Gate_Score = '3DMARK_CLOUD_GATE_SCORE',
  _3dMark_Fire_Strike_Standard_Graphics = '3DMARK_FIRE_STRIKE_STANDARD_GRAPHICS',
  _3dMark_Fire_Strike_Standard_Score = '3DMARK_FIRE_STRIKE_STANDARD_SCORE',
  _3dMark_Ice_Storm_Extreme_Graphics = '3DMARK_ICE_STORM_EXTREME_GRAPHICS',
  _3dMark_Ice_Storm_Graphics = '3DMARK_ICE_STORM_GRAPHICS',
  _3dMark_Ice_Storm_Unlimited_Graphics = '3DMARK_ICE_STORM_UNLIMITED_GRAPHICS',
  _3dMark_Night_Raid_Score = '3DMARK_NIGHT_RAID_SCORE',
  _3dMark_Night_Raid_Graphics = '3DMARK_NIGHT_RAID_GRAPHICS',
  Timespy_Graphics = 'TIMESPY_GRAPHICS', // TODO: delete after removed from db
  _3dMark_Timespy_Graphics = '3DMARK_TIMESPY_GRAPHICS',
  _3dMark_Timespy_Score = '3DMARK_TIMESPY_SCORE',
  _3dMark_Vantage_Perf = '3DMARK_VANTAGE_PERF',
  _3dMark_Wild_Life_Extreme_Unlimited = '3DMARK_WILD_LIFE_EXTREME_UNLIMITED',
  _3dMark_Wild_Life_Unlimited = '3DMARK_WILD_LIFE_UNLIMITED',

  // GPU - Blender
  Blender_3_3_Classroom_Cuda = 'BLENDER_3_3_CLASSROOM_CUDA',
  Blender_3_3_Classroom_Hip = 'BLENDER_3_3_CLASSROOM_HIP',
  Blender_3_3_Classroom_Metal = 'BLENDER_3_3_CLASSROOM_METAL',
  Blender_3_3_Classroom_Optix = 'BLENDER_3_3_CLASSROOM_OPTIX',

  // GPU - Cinebench
  Cinebench_R10_Shading_32_Bit = 'CINEBENCH_R10_SHADING',
  Cinebench_R11_5_OpenGl_64_Bit = 'CINEBENCH_R11_5_OPENGL_64_BIT',
  Cinebench_R15_OpenGl_64_Bit = 'CINEBENCH_R15_OPENGL_64_BIT',

  // ComputeMark
  ComputeMark_2_1_Result = 'COMPUTE_MARK_2_1_RESULT',

  // GPU - Geekbench
  Geekbench_6_2_Gpu_OpenCl = 'GEEKBENCH_6_2_GPU_OPENCL',
  Geekbench_6_2_Gpu_Vulkan = 'GEEKBENCH_6_2_GPU_VULKAN',

  // GPU - LuxMark
  LuxMark_2_0_Room_Gpu = 'LUXMARK_2_0_ROOM_GPU',
  LuxMark_2_0_Sala_Gpu = 'LUXMARK_2_0_SALA_GPU',

  // GPU - PassMark
  G2dMark = 'G2D_MARK', // TODO: delete after removed from db
  G3dMark = 'G3D_MARK', // TODO: delete after removed from db
  PassMark_G2dMark = 'PASSMARK_G2D_MARK',
  PassMark_G3dMark = 'PASSMARK_G3D_MARK',

  // GPU - SPECviewperf
  Specvp11_Catia_03 = 'SPECVP11_CATIA_03',
  Specvp11_Ensight_04 = 'SPECVP11_ENSIGHT_04',
  Specvp11_Lightwave_01 = 'SPECVP11_LIGHTWAVE_01',
  Specvp11_Maya_03 = 'SPECVP11_MAYA_03',
  Specvp11_Proe_05 = 'SPECVP11_PROE_05',
  Specvp11_Snx_01 = 'SPECVP11_SNX_01',
  Specvp11_Sw_02 = 'SPECVP11_SW_02',
  Specvp11_Tcvis_02 = 'SPECVP11_TCVIS_02',

  Specvp12_3dsMax_05 = 'SPECVP12_3dSMAX_05',
  Specvp12_Catia_04 = 'SPECVP12_CATIA_04',
  Specvp12_Creo_01 = 'SPECVP12_CREO_01',
  Specvp12_Energy_01 = 'SPECVP12_ENERGY_01',
  Specvp12_Maya_04 = 'SPECVP12_MAYA_04',
  Specvp12_Medical_01 = 'SPECVP12_MEDICAL_01',
  Specvp12_Showcase_01 = 'SPECVP12_SHOWCASE_01',
  Specvp12_Snx_02 = 'SPECVP12_SNX_02',
  Specvp12_Sw_03 = 'SPECVP12_SW_03',

  Specvp13_3dsMax_06 = 'SPECVP13_3dSMAX_06',
  Specvp13_Catia_05 = 'SPECVP13_CATIA_05',
  Specvp13_Creo_02 = 'SPECVP13_CREO_03',
  Specvp13_Energy_02 = 'SPECVP13_ENERGY_02',
  Specvp13_Maya_05 = 'SPECVP13_MAYA_05',
  Specvp13_Medical_02 = 'SPECVP13_MEDICAL_02',
  Specvp13_Showcase_02 = 'SPECVP13_SHOWCASE_02',
  Specvp13_Snx_03 = 'SPECVP13_SNX_03',
  Specvp13_Sw_04 = 'SPECVP13_SW_04',

  Specvp2020_3dsMax_07_4k = 'SPECVP2020_3dSMAX_07_4K',
  Specvp2020_Catia_06_4k = 'SPECVP2020_CATIA_06_4K',
  Specvp2020_Creo_03_4k = 'SPECVP2020_CREO_03_4K',
  Specvp2020_Energy_03_4k = 'SPECVP2020_ENERGY_03_4K',
  Specvp2020_Maya_06_4k = 'SPECVP2020_MAYA_06_4K',
  Specvp2020_Medical_03_4k = 'SPECVP2020_MEDICAL_03_4K',
  Specvp2020_Snx_03_4k = 'SPECVP2020_SNX_03_4K',
  Specvp2020_Sw_05_4k = 'SPECVP2020_SW_05_4K',

  // GPU - Unigine
  UnigineValley_1_0_Dx = 'UNIGINE_VALLEY_1_0_DX',
  UnigineHeaven_2_1_High = 'UNIGINE_HEAVEN_2_1_HIGH',
  UnigineHeaven_3_0_Dx_11 = 'UNIGINE_HEAVEN_3_0_DX_11',
  UnigineHeaven_3_0_OpenGl = 'UNIGINE_HEAVEN_3_0_OPENGL',
}

// Types

export interface ProductBenchmark {
  productId?: number;
  benchmarkKey: BenchmarkKey;

  value?: number;
  valuePerMsrp?: number;

  metadata?: ProductBenchmarkMeta;
}
export interface ProductBenchmarkMeta {}

export type PreferredBenchmarks = Partial<Record<ProductType, BenchmarkKey>>;

// Consts

export const CPU_BENCHMARKS = [
  BenchmarkKey._7Zip_18_03_Multi_Thread,
  BenchmarkKey._7Zip_18_03_Single_Thread,
  BenchmarkKey._3dMark_06_Cpu,
  BenchmarkKey._3dMark_11_Performance_Physics,
  BenchmarkKey._3dMark_Cloud_Gate_Physics,
  BenchmarkKey._3dMark_Fire_Strike_Standard_Physics,
  BenchmarkKey._3dMark_Ice_Storm_Extreme_Physics,
  BenchmarkKey._3dMark_Ice_Storm_Physics,
  BenchmarkKey._3dMark_Ice_Storm_Unlimited_Physics,
  BenchmarkKey._3dMark_Time_Spy_Cpu,
  BenchmarkKey.Cinebench_R11_5_Multi_Core,
  BenchmarkKey.Cinebench_R11_5_Single_Core,
  BenchmarkKey.Cinebench_R15_Multi_Core,
  BenchmarkKey.Cinebench_R15_Single_Core,
  BenchmarkKey.Cinebench_R20_Multi_Core,
  BenchmarkKey.Cinebench_R20_Single_Core,
  BenchmarkKey.Cinebench_R23_Multi_Core,
  BenchmarkKey.Cinebench_R23_Single_Core,
  BenchmarkKey.Geekbench_4_4_Multi_Core,
  BenchmarkKey.Geekbench_4_4_Single_Core,
  BenchmarkKey.Geekbench_5_0_Multi_Core,
  BenchmarkKey.Geekbench_5_0_Single_Core,
  BenchmarkKey.Geekbench_5_4_Multi_Core,
  BenchmarkKey.Geekbench_5_4_Single_Core,
  BenchmarkKey.Geekbench_6_2_Multi_Core,
  BenchmarkKey.Geekbench_6_2_Single_Core,
  BenchmarkKey.PassMark_CpuMark_Multi_Thread,
  BenchmarkKey.PassMark_CpuMark_Single_Thread,
  BenchmarkKey.WinRar_4_0,
];

export const GPU_BENCHMARKS = [
  BenchmarkKey._3dMark_2001SE_Standard,
  BenchmarkKey._3dMark_03_Standard,
  BenchmarkKey._3dMark_05_Standard,
  BenchmarkKey._3dMark_06_Standard,
  BenchmarkKey._3dMark_11_Performance_Gpu,
  BenchmarkKey._3dMark_11_Performance_Score,
  BenchmarkKey._3dMark_Cloud_Gate_Graphics,
  BenchmarkKey._3dMark_Cloud_Gate_Score,
  BenchmarkKey._3dMark_Fire_Strike_Standard_Graphics,
  BenchmarkKey._3dMark_Fire_Strike_Standard_Score,
  BenchmarkKey._3dMark_Ice_Storm_Extreme_Graphics,
  BenchmarkKey._3dMark_Ice_Storm_Graphics,
  BenchmarkKey._3dMark_Ice_Storm_Unlimited_Graphics,
  BenchmarkKey._3dMark_Night_Raid_Score,
  BenchmarkKey._3dMark_Night_Raid_Graphics,
  BenchmarkKey._3dMark_Timespy_Graphics,
  BenchmarkKey._3dMark_Timespy_Score,
  BenchmarkKey._3dMark_Vantage_Perf,
  BenchmarkKey._3dMark_Wild_Life_Extreme_Unlimited,
  BenchmarkKey._3dMark_Wild_Life_Unlimited,
  BenchmarkKey.Blender_3_3_Classroom_Cuda,
  BenchmarkKey.Blender_3_3_Classroom_Hip,
  BenchmarkKey.Blender_3_3_Classroom_Metal,
  BenchmarkKey.Blender_3_3_Classroom_Optix,
  BenchmarkKey.Cinebench_R10_Shading_32_Bit,
  BenchmarkKey.Cinebench_R11_5_OpenGl_64_Bit,
  BenchmarkKey.Cinebench_R15_OpenGl_64_Bit,
  BenchmarkKey.ComputeMark_2_1_Result,
  BenchmarkKey.Geekbench_6_2_Gpu_OpenCl,
  BenchmarkKey.Geekbench_6_2_Gpu_Vulkan,
  BenchmarkKey.LuxMark_2_0_Room_Gpu,
  BenchmarkKey.LuxMark_2_0_Sala_Gpu,
  BenchmarkKey.PassMark_G2dMark,
  BenchmarkKey.PassMark_G3dMark,
  BenchmarkKey.Specvp11_Catia_03,
  BenchmarkKey.Specvp11_Ensight_04,
  BenchmarkKey.Specvp11_Lightwave_01,
  BenchmarkKey.Specvp11_Maya_03,
  BenchmarkKey.Specvp11_Proe_05,
  BenchmarkKey.Specvp11_Snx_01,
  BenchmarkKey.Specvp11_Sw_02,
  BenchmarkKey.Specvp11_Tcvis_02,
  BenchmarkKey.Specvp12_3dsMax_05,
  BenchmarkKey.Specvp12_Catia_04,
  BenchmarkKey.Specvp12_Creo_01,
  BenchmarkKey.Specvp12_Energy_01,
  BenchmarkKey.Specvp12_Maya_04,
  BenchmarkKey.Specvp12_Medical_01,
  BenchmarkKey.Specvp12_Showcase_01,
  BenchmarkKey.Specvp12_Snx_02,
  BenchmarkKey.Specvp12_Sw_03,
  BenchmarkKey.Specvp13_3dsMax_06,
  BenchmarkKey.Specvp13_Catia_05,
  BenchmarkKey.Specvp13_Creo_02,
  BenchmarkKey.Specvp13_Energy_02,
  BenchmarkKey.Specvp13_Maya_05,
  BenchmarkKey.Specvp13_Medical_02,
  BenchmarkKey.Specvp13_Showcase_02,
  BenchmarkKey.Specvp13_Snx_03,
  BenchmarkKey.Specvp13_Sw_04,
  BenchmarkKey.Specvp2020_3dsMax_07_4k,
  BenchmarkKey.Specvp2020_Catia_06_4k,
  BenchmarkKey.Specvp2020_Creo_03_4k,
  BenchmarkKey.Specvp2020_Energy_03_4k,
  BenchmarkKey.Specvp2020_Maya_06_4k,
  BenchmarkKey.Specvp2020_Medical_03_4k,
  BenchmarkKey.Specvp2020_Snx_03_4k,
  BenchmarkKey.Specvp2020_Sw_05_4k,
  BenchmarkKey.UnigineValley_1_0_Dx,
  BenchmarkKey.UnigineHeaven_2_1_High,
  BenchmarkKey.UnigineHeaven_3_0_Dx_11,
  BenchmarkKey.UnigineHeaven_3_0_OpenGl,
];

interface BenchmarkLabel {
  full: string;
  short?: string;
  abbrev?: string;
}

export const BENCHMARK_LABELS: Record<BenchmarkKey, BenchmarkLabel> = {
  // CPU - 7-Zip
  [BenchmarkKey._7Zip_18_03_Multi_Thread]: {
    full: '7-Zip 18.03 Multi-Thread',
  },
  [BenchmarkKey._7Zip_18_03_Single_Thread]: {
    full: '7-Zip 18.03 Single-Thread',
  },

  // CPU - 3D Mark
  [BenchmarkKey._3dMark_06_Cpu]: {
    full: '3DMark 06 CPU',
  },
  [BenchmarkKey._3dMark_11_Performance_Physics]: {
    full: '3DMark 11 Performance Physics',
    short: '3DMark 11 Perf. Physics',
    abbrev: '3DM 11 Perf. Physics',
  },
  [BenchmarkKey._3dMark_Cloud_Gate_Physics]: {
    full: '3DMark Cloud Gate Physics',
  },
  [BenchmarkKey._3dMark_Fire_Strike_Standard_Physics]: {
    full: '3DMark Fire Strike Standard Physics',
    short: 'Fire Strike Physics',
    abbrev: 'Fire Strike',
  },
  [BenchmarkKey._3dMark_Ice_Storm_Extreme_Physics]: {
    full: '3DMark Ice Storm Extreme Physics',
  },
  [BenchmarkKey._3dMark_Ice_Storm_Physics]: {
    full: '3DMark Ice Storm Physics',
  },
  [BenchmarkKey._3dMark_Ice_Storm_Unlimited_Physics]: {
    full: '3DMark Ice Storm Unlimited Physics',
  },
  [BenchmarkKey._3dMark_Time_Spy_Cpu]: {
    full: '3DMark Time Spy CPU',
    short: 'Time Spy CPU',
    abbrev: 'Time Spy',
  },

  // CPU - Cinebench
  [BenchmarkKey.Cinebench_R11_5_Multi_Core]: {
    full: 'Cinebench R11.5 Multi-Core',
  },
  [BenchmarkKey.Cinebench_R11_5_Single_Core]: {
    full: 'Cinebench R11.5 Single-Core',
  },
  [BenchmarkKey.Cinebench_R15_Multi_Core]: {
    full: 'Cinebench R15 Multi-Core',
  },
  [BenchmarkKey.Cinebench_R15_Single_Core]: {
    full: 'Cinebench R15 Single-Core',
  },
  [BenchmarkKey.Cinebench_R20_Multi_Core]: {
    full: 'Cinebench R20 Multi-Core',
  },
  [BenchmarkKey.Cinebench_R20_Single_Core]: {
    full: 'Cinebench R20 Single-Core',
  },
  [BenchmarkKey.Cinebench_R23_Multi_Core]: {
    full: 'Cinebench R23 Multi-Core',
  },
  [BenchmarkKey.Cinebench_R23_Single_Core]: {
    full: 'Cinebench R23 Single-Core',
  },

  // CPU - Geekbench
  [BenchmarkKey.Geekbench_4_4_Multi_Core]: {
    full: 'Geekbench 4.4 Multi-Core',
  },
  [BenchmarkKey.Geekbench_4_4_Single_Core]: {
    full: 'Geekbench 4.4 Single-Core',
  },
  [BenchmarkKey.Geekbench_5_0_Multi_Core]: {
    full: 'Geekbench 5.0 Multi-Core',
  },
  [BenchmarkKey.Geekbench_5_0_Single_Core]: {
    full: 'Geekbench 5.0 Single-Core',
  },
  [BenchmarkKey.Geekbench_5_4_Multi_Core]: {
    full: 'Geekbench 5.5 Multi-Core',
  },
  [BenchmarkKey.Geekbench_5_4_Single_Core]: {
    full: 'Geekbench 5.5 Single-Core',
  },
  [BenchmarkKey.Geekbench_6_2_Multi_Core]: {
    full: 'Geekbench 6.2 Multi-Core',
    short: 'Geekbench Multi-Core',
    abbrev: 'Geekbench M-Core',
  },
  [BenchmarkKey.Geekbench_6_2_Single_Core]: {
    full: 'Geekbench 6.2 Single-Core',
    short: 'Geekbench Single-Core',
    abbrev: 'Geekbench S-Core',
  },

  // CPU - PassMark
  [BenchmarkKey.CpuMark_Multi_Thread]: {
    // TODO: delete
    full: '',
  },
  [BenchmarkKey.CpuMark_Single_Thread]: {
    // TODO: delete
    full: '',
  },
  [BenchmarkKey.PassMark_CpuMark_Multi_Thread]: {
    full: 'CPU Mark Multi-Thread',
    short: 'CPU Mark Multi-Thread',
    abbrev: 'CPU Mark MT',
  },
  [BenchmarkKey.PassMark_CpuMark_Single_Thread]: {
    full: 'CPU Mark Single-Thread',
    short: 'CPU Mark Single-Thread',
    abbrev: 'CPU Mark ST',
  },

  // CPU - WinRar
  [BenchmarkKey.WinRar_4_0]: {
    full: 'WinRAR 4.0',
  },

  // GPU - 3DMark
  [BenchmarkKey.Timespy_Graphics]: {
    // TODO: delete
    full: '',
  },
  [BenchmarkKey._3dMark_2001SE_Standard]: {
    full: '3DMark2001 SE Score',
  },
  [BenchmarkKey._3dMark_03_Standard]: {
    full: '3DMark03 Score',
  },
  [BenchmarkKey._3dMark_05_Standard]: {
    full: '3DMark05 Score',
  },
  [BenchmarkKey._3dMark_06_Standard]: {
    full: '3DMark06 Score',
  },
  [BenchmarkKey._3dMark_11_Performance_Gpu]: {
    full: '3DMark 11 Performance GPU',
    short: '3DMark 11 Perf. GPU',
    abbrev: '3DM 11 Perf. GPU',
  },
  [BenchmarkKey._3dMark_11_Performance_Score]: {
    full: '3DMark 11 Performance Score',
  },
  [BenchmarkKey._3dMark_Cloud_Gate_Graphics]: {
    full: '3DMark Cloud Gate Graphics',
  },
  [BenchmarkKey._3dMark_Cloud_Gate_Score]: {
    full: '3DMark Cloud Gate Score',
  },
  [BenchmarkKey._3dMark_Fire_Strike_Standard_Graphics]: {
    full: '3DMark Fire Strike Standard Graphics',
    short: 'Fire Strike Graphics',
    abbrev: 'Fire Strike',
  },
  [BenchmarkKey._3dMark_Fire_Strike_Standard_Score]: {
    full: '3DMark Fire Strike Standard Score',
  },
  [BenchmarkKey._3dMark_Ice_Storm_Extreme_Graphics]: {
    full: '3DMark Ice Storm Extreme Graphics',
  },
  [BenchmarkKey._3dMark_Ice_Storm_Graphics]: {
    full: '3DMark Ice Storm Graphics',
  },
  [BenchmarkKey._3dMark_Ice_Storm_Unlimited_Graphics]: {
    full: '3DMark Ice Storm Unlimited Graphics',
  },
  [BenchmarkKey._3dMark_Night_Raid_Score]: {
    full: '3DMark Night Raid Score',
  },
  [BenchmarkKey._3dMark_Night_Raid_Graphics]: {
    full: '3DMark Night Raid Graphics',
  },
  [BenchmarkKey._3dMark_Timespy_Graphics]: {
    full: '3DMark Time Spy Graphics',
    short: 'Time Spy Graphics',
    abbrev: 'Time Spy',
  },
  [BenchmarkKey._3dMark_Timespy_Score]: {
    full: '3DMark Time Spy Score',
  },
  [BenchmarkKey._3dMark_Vantage_Perf]: {
    full: '3DMark Vantage Performance',
  },
  [BenchmarkKey._3dMark_Wild_Life_Extreme_Unlimited]: {
    full: '3DMark Wild Life Extreme',
  },
  [BenchmarkKey._3dMark_Wild_Life_Unlimited]: {
    full: '3DMark Wild Life',
  },

  // GPU - Blender
  [BenchmarkKey.Blender_3_3_Classroom_Cuda]: {
    full: 'Blender 3.3 Classroom CUDA',
  },
  [BenchmarkKey.Blender_3_3_Classroom_Hip]: {
    full: 'Blender 3.3 Classroom HIP',
  },
  [BenchmarkKey.Blender_3_3_Classroom_Metal]: {
    full: 'Blender 3.3 Classroom METAL',
  },
  [BenchmarkKey.Blender_3_3_Classroom_Optix]: {
    full: 'Blender 3.3 Classroom OptiX',
  },

  // GPU - Cinebench
  [BenchmarkKey.Cinebench_R10_Shading_32_Bit]: {
    full: 'Cinebench R10 Shading 32 Bit',
  },
  [BenchmarkKey.Cinebench_R11_5_OpenGl_64_Bit]: {
    full: 'Cinebench R11.5 OpenGL 64 Bit',
  },
  [BenchmarkKey.Cinebench_R15_OpenGl_64_Bit]: {
    full: 'Cinebench R15 OpenGL 64 Bit',
  },

  // ComputeMark
  [BenchmarkKey.ComputeMark_2_1_Result]: {
    full: 'ComputeMark v2.1 Result',
  },

  // GPU - Geekbench
  [BenchmarkKey.Geekbench_6_2_Gpu_OpenCl]: {
    full: 'Geekbench 6.2 GPU OpenCL',
  },
  [BenchmarkKey.Geekbench_6_2_Gpu_Vulkan]: {
    full: 'Geekbench 6.2 GPU Vulkan',
  },

  // GPU - LuxMark
  [BenchmarkKey.LuxMark_2_0_Room_Gpu]: {
    full: 'LuxMark v2.0 Room GPU',
  },
  [BenchmarkKey.LuxMark_2_0_Sala_Gpu]: {
    full: 'LuxMark v2.0 Sala GPU',
  },

  // GPU - PassMark
  [BenchmarkKey.G2dMark]: {
    // TODO: delete
    full: '',
  },
  [BenchmarkKey.G3dMark]: {
    // TODO: delete
    full: '',
  },
  [BenchmarkKey.PassMark_G2dMark]: {
    full: 'PassMark G2D Mark',
    short: 'G2D Mark',
    abbrev: 'G2D',
  },
  [BenchmarkKey.PassMark_G3dMark]: {
    full: 'PassMark G3D Mark',
    short: 'G3D Mark',
    abbrev: 'G3D',
  },

  // GPU - SPECviewperf
  [BenchmarkKey.Specvp11_Catia_03]: {
    full: 'specvp11 catia-03',
  },
  [BenchmarkKey.Specvp11_Ensight_04]: {
    full: 'specvp11 ensight-04',
  },
  [BenchmarkKey.Specvp11_Lightwave_01]: {
    full: 'specvp11 lightwave-01',
  },
  [BenchmarkKey.Specvp11_Maya_03]: {
    full: 'specvp11 maya-03',
  },
  [BenchmarkKey.Specvp11_Proe_05]: {
    full: 'specvp11 proe-05',
  },
  [BenchmarkKey.Specvp11_Snx_01]: {
    full: 'specvp11 snx-01',
  },
  [BenchmarkKey.Specvp11_Sw_02]: {
    full: 'specvp11 sw-02',
  },
  [BenchmarkKey.Specvp11_Tcvis_02]: {
    full: 'specvp11 tcvis-02',
  },
  [BenchmarkKey.Specvp12_3dsMax_05]: {
    full: 'specvp12 3dsmax-05',
  },
  [BenchmarkKey.Specvp12_Catia_04]: {
    full: 'specvp12 catia-04',
  },
  [BenchmarkKey.Specvp12_Creo_01]: {
    full: 'specvp12 creo-01',
  },
  [BenchmarkKey.Specvp12_Energy_01]: {
    full: 'specvp12 energy-01',
  },
  [BenchmarkKey.Specvp12_Maya_04]: {
    full: 'specvp12 maya-04',
  },
  [BenchmarkKey.Specvp12_Medical_01]: {
    full: 'specvp12 mediacal-01',
  },
  [BenchmarkKey.Specvp12_Showcase_01]: {
    full: 'specvp12 showcase-01',
  },
  [BenchmarkKey.Specvp12_Snx_02]: {
    full: 'specvp12 snx-02',
  },
  [BenchmarkKey.Specvp12_Sw_03]: {
    full: 'specvp12 sw-03',
  },
  [BenchmarkKey.Specvp13_3dsMax_06]: {
    full: 'specvp13 3dsmax-06',
  },
  [BenchmarkKey.Specvp13_Catia_05]: {
    full: 'specvp13 catia-05',
  },
  [BenchmarkKey.Specvp13_Creo_02]: {
    full: 'specvp13 creo-02',
  },
  [BenchmarkKey.Specvp13_Energy_02]: {
    full: 'specvp13 energy-02',
  },
  [BenchmarkKey.Specvp13_Maya_05]: {
    full: 'specvp13 maya-05',
  },
  [BenchmarkKey.Specvp13_Medical_02]: {
    full: 'specvp13 medical-02',
  },
  [BenchmarkKey.Specvp13_Showcase_02]: {
    full: 'specvp13 showcase-02',
  },
  [BenchmarkKey.Specvp13_Snx_03]: {
    full: 'specvp13 snx-03',
  },
  [BenchmarkKey.Specvp13_Sw_04]: {
    full: 'specvp13 sw-04',
  },
  [BenchmarkKey.Specvp2020_3dsMax_07_4k]: {
    full: 'specvp2020 3dsmax-07 4k',
  },
  [BenchmarkKey.Specvp2020_Catia_06_4k]: {
    full: 'specvp2020 catia-06 4k',
  },
  [BenchmarkKey.Specvp2020_Creo_03_4k]: {
    full: 'specvp2020 creo-03 4k',
  },
  [BenchmarkKey.Specvp2020_Energy_03_4k]: {
    full: 'specvp2020 energy-03 4k',
  },
  [BenchmarkKey.Specvp2020_Maya_06_4k]: {
    full: 'specvp2020 maya-06 4k',
  },
  [BenchmarkKey.Specvp2020_Medical_03_4k]: {
    full: 'specvp2020 medical-03 4k',
  },
  [BenchmarkKey.Specvp2020_Snx_03_4k]: {
    full: 'specvp2020 snx-04 4k',
  },
  [BenchmarkKey.Specvp2020_Sw_05_4k]: {
    full: 'specvp2020 solidworks-05 4k',
  },

  // GPU - Unigine
  [BenchmarkKey.UnigineValley_1_0_Dx]: {
    full: 'Unigine Valley 1.0 DirectX',
  },
  [BenchmarkKey.UnigineHeaven_2_1_High]: {
    full: 'Unigine Heaven 2.1 - High',
  },
  [BenchmarkKey.UnigineHeaven_3_0_Dx_11]: {
    full: 'Unigine Heaven 3.0 DirectX 11',
  },
  [BenchmarkKey.UnigineHeaven_3_0_OpenGl]: {
    full: 'Unigine Heaven 3.0 OpenGL',
  },
};
