'use client';

import {
  BenchmarkKey,
  getProductBenchmark,
  hasProductBenchmark,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { Tab } from 'packages/website/src/app/_common/components/Tabs/Tab';
import { Tabs } from 'packages/website/src/app/_common/components/Tabs/Tabs';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { BenchmarksCredit } from 'packages/website/src/app/_common/product/components/BenchmarksCredit/BenchmarksCredit';
import { ProductBenchmarkRow } from 'packages/website/src/app/_common/product/components/ProductBenchmarkRow/ProductBenchmarkRow';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent, useMemo } from 'react';

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

interface BenchmarkTablesProps {
  credit?: boolean;
  className?: string;
}

export const BenchmarkTables: FunctionComponent<BenchmarkTablesProps> = (
  props,
) => {
  const viewModel = useViewModel<ViewCpuViewModel>();
  const cpu = viewModel.cpu;

  const filteredBenchmarks = useMemo(() => {
    return BENCHMARKS.filter((group) =>
      group.benchmarks.some((benchmark) => hasProductBenchmark(cpu, benchmark)),
    );
  }, [cpu]);

  return (
    <div className="flex flex-col">
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
      {!!props.credit && (
        <BenchmarksCredit
          sourceName="Notebookcheck"
          sourceUrl="https://notebookcheck.net"
        />
      )}
    </div>
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
  const viewModel = useViewModel<ViewCpuViewModel>();
  const cpu = viewModel.cpu;

  const hasValues = useMemo(
    () => benchmarks.some((key) => hasProductBenchmark(cpu, key)),
    [benchmarks, cpu],
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
            <Th>Value</Th>
          </Tr>
        </THead>
        <TBody>
          {benchmarks.map((benchmark) => (
            <ProductBenchmarkRow
              key={benchmark}
              benchmarks={[getProductBenchmark(cpu, benchmark)]}
            />
          ))}
        </TBody>
      </Table>
    </Tab>
  );
};
