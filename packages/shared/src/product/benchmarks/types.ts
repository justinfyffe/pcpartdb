export enum BenchmarkKey {
  //
  // CPU Benchmarks
  //

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
  GeekBench_Multi_Core = 'GEEKBENCH_MULTI_CORE', // TODO: DELETE
  GeekBench_Single_Core = 'GEEKBENCH_SINGLE_CORE', // TODO: DELETE
  Geekbench_4_4_Multi_Core = 'GEEKBENCH_4_4_MULTI_CORE',
  Geekbench_4_4_Single_Core = 'GEEKBENCH_4_4_SINGLE_CORE',
  Geekbench_5_0_Multi_Core = 'GEEKBENCH_5_0_MULTI_CORE',
  Geekbench_5_0_Single_Core = 'GEEKBENCH_5_0_SINGLE_CORE',
  Geekbench_5_4_Multi_Core = 'GEEKBENCH_5_4_MULTI_CORE',
  Geekbench_5_4_Single_Core = 'GEEKBENCH_5_4_SINGLE_CORE',
  Geekbench_6_2_Multi_Core = 'GEEKBENCH_6_2_MULTI_CORE',
  Geekbench_6_2_Single_Core = 'GEEKBENCH_6_2_SINGLE_CORE',

  // CPU - PassMark
  PassMark_CpuMark_Multi_Thread = 'CPU_MARK_MULTI_THREAD',
  PassMark_CpuMark_Single_Thread = 'CPU_MARK_SINGLE_THREAD',

  // CPU - WinRar
  WinRar_4_0 = 'WINRAR_4_0',

  //
  // GPU Benchmarks
  //

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
  _3dMark_Timespy_Graphics = 'TIMESPY_GRAPHICS', // TODO: rename in scratchpad
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
  PassMark_G2dMark = 'G2D_MARK', // TODO: rename in scratchpad: PASSMARK_G2D_MARK
  PassMark_G3dMark = 'G3D_MARK', // TODO: rename in scratchpad: PASSMARK_G3D_MARK

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

export interface ProductBenchmarkMeta {}

export interface ProductBenchmark {
  productId?: number;
  benchmarkKey: BenchmarkKey;

  value?: number;
  valuePerMsrp?: number;

  metadata?: ProductBenchmarkMeta;
}
