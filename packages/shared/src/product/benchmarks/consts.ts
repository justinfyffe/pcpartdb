import { BenchmarkKey } from './types';

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
