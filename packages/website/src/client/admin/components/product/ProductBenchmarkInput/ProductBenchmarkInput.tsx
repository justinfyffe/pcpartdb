import {
  BenchmarkKey,
  getProductBenchmarkName,
  ProductBenchmark,
  ProductType,
} from '@pcpartdb/shared';
import { NumberInput } from 'packages/website/src/client/shared/components/Input/NumberInput';
import {
  Select,
  SelectValue,
} from 'packages/website/src/client/shared/components/Select/Select';
import { SelectOption } from 'packages/website/src/client/shared/components/Select/SelectOption';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useCallback } from 'react';

const BENCHMARKS = {
  [ProductType.Cpu]: [
    BenchmarkKey._7Zip_18_03_Multi_Thread,
    BenchmarkKey._7Zip_18_03_Single_Thread,

    BenchmarkKey._3dMark_06_Cpu,
    BenchmarkKey._3dMark_11_Performance_Physics,
    BenchmarkKey._3dMark_Fire_Strike_Standard_Physics,
    BenchmarkKey._3dMark_Cloud_Gate_Physics,
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

    BenchmarkKey.Geekbench_6_2_Multi_Core,
    BenchmarkKey.Geekbench_6_2_Single_Core,
    BenchmarkKey.Geekbench_5_4_Multi_Core,
    BenchmarkKey.Geekbench_5_4_Single_Core,
    BenchmarkKey.Geekbench_5_0_Multi_Core,
    BenchmarkKey.Geekbench_5_0_Single_Core,
    BenchmarkKey.Geekbench_4_4_Multi_Core,
    BenchmarkKey.Geekbench_4_4_Single_Core,

    BenchmarkKey.PassMark_CpuMark_Multi_Thread,
    BenchmarkKey.PassMark_CpuMark_Single_Thread,

    BenchmarkKey.WinRar_4_0,
  ],
  [ProductType.Gpu]: [
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

    BenchmarkKey.PassMark_G3dMark,
    BenchmarkKey.PassMark_G2dMark,

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
  ],
};

interface ProductBenchmarkInputProps {
  productType: ProductType;
  value?: ProductBenchmark;
  onChange?: (value: ProductBenchmark) => void;

  className?: string;
  ref?: unknown;
}

export const ProductBenchmarkInput: FunctionComponent<
  ProductBenchmarkInputProps
> = (props) => {
  const { productType, value, onChange, className } = props;

  const handleKeyChange = useCallback(
    (key: SelectValue) => {
      if (key != null) {
        onChange?.({ benchmarkKey: key as BenchmarkKey });
      } else {
        onChange?.(null);
      }
    },
    [onChange],
  );

  const handleValueChange = useCallback(
    (benchmarkValue: number) => {
      onChange?.({ benchmarkKey: value?.benchmarkKey, value: benchmarkValue });
    },
    [onChange, value?.benchmarkKey],
  );

  return (
    <div className={classNames('flex gap-4', className)}>
      <Select
        placeholder="Select Benchmark"
        value={value?.benchmarkKey}
        onChange={handleKeyChange}
        className="flex-1"
        clearable
      >
        {BENCHMARKS[productType].map((benchmark, i) => (
          <SelectOption
            key={i}
            label={getProductBenchmarkName(benchmark)}
            value={benchmark}
          >
            {getProductBenchmarkName(benchmark)}
          </SelectOption>
        ))}
      </Select>

      <NumberInput
        placeholder="Benchmark Value"
        disabled={value?.benchmarkKey == null}
        value={value?.value}
        onChange={handleValueChange}
        className="flex-1"
      />
    </div>
  );
};
