import {
  BenchmarkKey,
  formatProductName,
  getGpuChipset,
  getProductBenchmark,
  hasProductBenchmark,
} from '@pcpartdb/shared';
import { ProductBenchmarkRow } from 'packages/website/src/client/product/components/ProductBenchmarkRow/ProductBenchmarkRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import { Tab } from 'packages/website/src/client/shared/components/Tabs/Tab';
import { Tabs } from 'packages/website/src/client/shared/components/Tabs/Tabs';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';

const BENCHMARKS = [
  {
    name: 'Popular',
    benchmarks: [
      BenchmarkKey._3dMark_Timespy_Graphics,
      BenchmarkKey._3dMark_Timespy_Score,
      BenchmarkKey._3dMark_Cloud_Gate_Graphics,
      BenchmarkKey._3dMark_Fire_Strike_Standard_Graphics,
      BenchmarkKey._3dMark_Night_Raid_Graphics,
      BenchmarkKey._3dMark_11_Performance_Score,
      BenchmarkKey.Cinebench_R15_OpenGl_64_Bit,
      BenchmarkKey.PassMark_G3dMark,
      BenchmarkKey.PassMark_G2dMark,
      BenchmarkKey.UnigineHeaven_3_0_Dx_11,
      BenchmarkKey.UnigineHeaven_3_0_OpenGl,
    ],
  },

  {
    name: '3DMark',
    benchmarks: [
      BenchmarkKey._3dMark_Cloud_Gate_Graphics,
      BenchmarkKey._3dMark_Cloud_Gate_Score,
      BenchmarkKey._3dMark_Fire_Strike_Standard_Graphics,
      BenchmarkKey._3dMark_Fire_Strike_Standard_Score,
      BenchmarkKey._3dMark_Night_Raid_Graphics,
      BenchmarkKey._3dMark_Night_Raid_Score,
      BenchmarkKey._3dMark_Timespy_Graphics,
      BenchmarkKey._3dMark_Timespy_Score,
      BenchmarkKey._3dMark_Ice_Storm_Graphics,
      BenchmarkKey._3dMark_Ice_Storm_Unlimited_Graphics,
      BenchmarkKey._3dMark_Ice_Storm_Extreme_Graphics,
      BenchmarkKey._3dMark_Wild_Life_Unlimited,
      BenchmarkKey._3dMark_Wild_Life_Extreme_Unlimited,
      BenchmarkKey._3dMark_11_Performance_Gpu,
      BenchmarkKey._3dMark_11_Performance_Score,
      BenchmarkKey._3dMark_Vantage_Perf,
      BenchmarkKey._3dMark_06_Standard,
      BenchmarkKey._3dMark_05_Standard,
      BenchmarkKey._3dMark_03_Standard,
      BenchmarkKey._3dMark_2001SE_Standard,
    ],
  },
  {
    name: 'Cinebench',
    benchmarks: [
      BenchmarkKey.Cinebench_R15_OpenGl_64_Bit,
      BenchmarkKey.Cinebench_R11_5_OpenGl_64_Bit,
      BenchmarkKey.Cinebench_R10_Shading_32_Bit,
    ],
  },
  {
    name: 'ComputeMark',
    benchmarks: [BenchmarkKey.ComputeMark_2_1_Result],
  },
  {
    name: 'Geekbench',
    benchmarks: [
      BenchmarkKey.Geekbench_6_2_Gpu_OpenCl,
      BenchmarkKey.Geekbench_6_2_Gpu_Vulkan,
    ],
  },
  {
    name: 'LuxMark',
    benchmarks: [
      BenchmarkKey.LuxMark_2_0_Room_Gpu,
      BenchmarkKey.LuxMark_2_0_Sala_Gpu,
    ],
  },
  {
    name: 'PassMark',
    benchmarks: [BenchmarkKey.PassMark_G3dMark, BenchmarkKey.PassMark_G2dMark],
  },
  {
    name: 'SPECviewperf 2020',
    benchmarks: [
      BenchmarkKey.Specvp2020_3dsMax_07_4k,
      BenchmarkKey.Specvp2020_Catia_06_4k,
      BenchmarkKey.Specvp2020_Creo_03_4k,
      BenchmarkKey.Specvp2020_Energy_03_4k,
      BenchmarkKey.Specvp2020_Maya_06_4k,
      BenchmarkKey.Specvp2020_Medical_03_4k,
      BenchmarkKey.Specvp2020_Snx_03_4k,
      BenchmarkKey.Specvp2020_Sw_05_4k,
    ],
  },
  {
    name: 'SPECviewperf 13',
    benchmarks: [
      BenchmarkKey.Specvp13_3dsMax_06,
      BenchmarkKey.Specvp13_Catia_05,
      BenchmarkKey.Specvp13_Creo_02,
      BenchmarkKey.Specvp13_Energy_02,
      BenchmarkKey.Specvp13_Maya_05,
      BenchmarkKey.Specvp13_Medical_02,
      BenchmarkKey.Specvp13_Showcase_02,
      BenchmarkKey.Specvp13_Snx_03,
      BenchmarkKey.Specvp13_Sw_04,
    ],
  },
  {
    name: 'SPECviewperf 12',
    benchmarks: [
      BenchmarkKey.Specvp12_3dsMax_05,
      BenchmarkKey.Specvp12_Catia_04,
      BenchmarkKey.Specvp12_Creo_01,
      BenchmarkKey.Specvp12_Energy_01,
      BenchmarkKey.Specvp12_Maya_04,
      BenchmarkKey.Specvp12_Medical_01,
      BenchmarkKey.Specvp12_Showcase_01,
      BenchmarkKey.Specvp12_Snx_02,
      BenchmarkKey.Specvp12_Sw_03,
    ],
  },
  {
    name: 'SPECviewperf 11',
    benchmarks: [
      BenchmarkKey.Specvp11_Catia_03,
      BenchmarkKey.Specvp11_Ensight_04,
      BenchmarkKey.Specvp11_Lightwave_01,
      BenchmarkKey.Specvp11_Maya_03,
      BenchmarkKey.Specvp11_Proe_05,
      BenchmarkKey.Specvp11_Snx_01,
      BenchmarkKey.Specvp11_Sw_02,
      BenchmarkKey.Specvp11_Tcvis_02,
    ],
  },
  {
    name: 'Unigine',
    benchmarks: [
      BenchmarkKey.UnigineHeaven_3_0_Dx_11,
      BenchmarkKey.UnigineHeaven_3_0_OpenGl,
      BenchmarkKey.UnigineHeaven_2_1_High,
      BenchmarkKey.UnigineValley_1_0_Dx,
    ],
  },
];

interface BenchmarksTableProps {
  className?: string;
}

export const BenchmarkTables: FunctionComponent<BenchmarksTableProps> = () => {
  const { comparison } = useContext(ComparePageContext);

  const filteredBenchmarks = useMemo(() => {
    return BENCHMARKS.filter((group) =>
      comparison.some((gpu) =>
        group.benchmarks.some((benchmark) =>
          hasProductBenchmark(gpu, benchmark),
        ),
      ),
    );
  }, [comparison]);

  return (
    <Tabs tabClassName="p-1">
      {filteredBenchmarks.map((group, i) => (
        <BenchmarkTab
          key={i}
          label={group.name}
          name={group.name}
          benchmarks={group.benchmarks}
        />
      ))}
    </Tabs>
  );
};

interface BenchmarkTabProps {
  label: string;
  name: string;
  benchmarks: BenchmarkKey[];
  className?: string;
}

const BenchmarkTab: FunctionComponent<BenchmarkTabProps> = (props) => {
  const { name, benchmarks, className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(getGpuChipset(gpu1), { company: false }),
      formatProductName(getGpuChipset(gpu2), { company: false }),
    ];
  }, [gpu1, gpu2]);

  const hasValues = useMemo(
    () =>
      comparison.some((gpu) =>
        benchmarks.some((key) => hasProductBenchmark(gpu, key)),
      ),
    [benchmarks, comparison],
  );

  if (!hasValues) {
    return <></>;
  }

  return (
    <Tab label={name}>
      <Table border responsive className={classNames(className)}>
        <THead>
          <Tr>
            <Th>Benchmark</Th>
            <Th>{name1}</Th>
            <Th>{name2}</Th>
          </Tr>
        </THead>
        <TBody>
          {benchmarks.map((benchmark) => (
            <ProductBenchmarkRow
              key={benchmark}
              benchmarks={[
                getProductBenchmark(gpu1, benchmark),
                getProductBenchmark(gpu2, benchmark),
              ]}
            />
          ))}
        </TBody>
      </Table>
    </Tab>
  );
};
