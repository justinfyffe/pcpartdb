import {
  BenchmarkKey,
  formatProductName,
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
      BenchmarkKey._3dMark_11_Performance_Physics,
      BenchmarkKey._3dMark_Time_Spy_Cpu,
      BenchmarkKey.Cinebench_R15_Multi_Core,
      BenchmarkKey.Cinebench_R15_Single_Core,
      BenchmarkKey.Geekbench_6_2_Multi_Core,
      BenchmarkKey.Geekbench_6_2_Single_Core,
      BenchmarkKey.PassMark_CpuMark_Multi_Thread,
      BenchmarkKey.PassMark_CpuMark_Single_Thread,
    ],
  },
  {
    name: '3DMark',
    benchmarks: [
      BenchmarkKey._3dMark_Cloud_Gate_Physics,
      BenchmarkKey._3dMark_Fire_Strike_Standard_Physics,
      BenchmarkKey._3dMark_Ice_Storm_Physics,
      BenchmarkKey._3dMark_Ice_Storm_Unlimited_Physics,
      BenchmarkKey._3dMark_Ice_Storm_Extreme_Physics,
      BenchmarkKey._3dMark_Time_Spy_Cpu,
      BenchmarkKey._3dMark_11_Performance_Physics,
      BenchmarkKey._3dMark_06_Cpu,
    ],
  },
  {
    name: '7-Zip',
    benchmarks: [
      BenchmarkKey._7Zip_18_03_Multi_Thread,
      BenchmarkKey._7Zip_18_03_Single_Thread,
    ],
  },
  {
    name: 'Cinebench',
    benchmarks: [
      BenchmarkKey.Cinebench_R23_Multi_Core,
      BenchmarkKey.Cinebench_R23_Single_Core,
      BenchmarkKey.Cinebench_R20_Multi_Core,
      BenchmarkKey.Cinebench_R20_Single_Core,
      BenchmarkKey.Cinebench_R15_Multi_Core,
      BenchmarkKey.Cinebench_R15_Single_Core,
      BenchmarkKey.Cinebench_R11_5_Multi_Core,
      BenchmarkKey.Cinebench_R11_5_Single_Core,
    ],
  },
  {
    name: 'Geekbench',
    benchmarks: [
      BenchmarkKey.Geekbench_6_2_Multi_Core,
      BenchmarkKey.Geekbench_6_2_Single_Core,
      BenchmarkKey.Geekbench_5_4_Multi_Core,
      BenchmarkKey.Geekbench_5_4_Single_Core,
      BenchmarkKey.Geekbench_5_0_Multi_Core,
      BenchmarkKey.Geekbench_5_0_Single_Core,
      BenchmarkKey.Geekbench_4_4_Multi_Core,
      BenchmarkKey.Geekbench_4_4_Single_Core,
    ],
  },
  {
    name: 'PassMark',
    benchmarks: [
      BenchmarkKey.PassMark_CpuMark_Multi_Thread,
      BenchmarkKey.PassMark_CpuMark_Single_Thread,
    ],
  },
  {
    name: 'WinRar',
    benchmarks: [BenchmarkKey.WinRar_4_0],
  },
];

interface BenchmarksTableProps {
  className?: string;
}

export const BenchmarkTables: FunctionComponent<BenchmarksTableProps> = () => {
  const { comparison } = useContext(ComparePageContext);

  const filteredBenchmarks = useMemo(() => {
    return BENCHMARKS.filter((group) =>
      comparison.some((cpu) =>
        group.benchmarks.some((benchmark) =>
          hasProductBenchmark(cpu, benchmark),
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
  const [cpu1, cpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(cpu1, { company: false }),
      formatProductName(cpu2, { company: false }),
    ];
  }, [cpu1, cpu2]);

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
                getProductBenchmark(cpu1, benchmark),
                getProductBenchmark(cpu2, benchmark),
              ]}
            />
          ))}
        </TBody>
      </Table>
    </Tab>
  );
};
