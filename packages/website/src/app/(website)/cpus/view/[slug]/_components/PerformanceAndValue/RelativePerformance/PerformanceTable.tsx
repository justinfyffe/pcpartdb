'use client';

import {
  CpuProduct,
  formatProductName,
  getProductPerformanceRank,
  getViewCpuPath,
  productBenchmarkValue,
  ProductType,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Td } from 'packages/website/src/app/_common/components/Table/Td';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent, useMemo } from 'react';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const viewModel = useViewModel<ViewCpuViewModel>();
  const cpu = viewModel.cpu;
  const relativePerformanceCpus = viewModel.relativePerformanceCpus;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th className="text-center">Rank</Th>
          <Th>CPU</Th>
          <Th colSpan={2} className="text-right">
            Benchmark Performance
          </Th>
        </Tr>
      </THead>
      <TBody>
        {relativePerformanceCpus.map((relativeCpu) => (
          <PerformanceTableRow
            key={relativeCpu.id}
            baselineCpu={cpu}
            relativeCpu={relativeCpu}
          />
        ))}
      </TBody>
    </Table>
  );
};

interface PerformanceTableRowProps {
  baselineCpu: CpuProduct;
  relativeCpu: Partial<CpuProduct>;
}

const PerformanceTableRow: FunctionComponent<PerformanceTableRowProps> = (
  props,
) => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const { baselineCpu, relativeCpu } = props;

  const relativePerformancePct = useMemo(() => {
    const baseline = productBenchmarkValue(baselineCpu, preferredBenchmark);
    const relatedPerformance = productBenchmarkValue(
      relativeCpu,
      preferredBenchmark,
    );

    return Number(
      ((relatedPerformance / baseline) * 100).toFixed(0),
    ).toLocaleString();
  }, [baselineCpu, preferredBenchmark, relativeCpu]);

  const rating = useMemo(
    () =>
      productBenchmarkValue(relativeCpu, preferredBenchmark)?.toLocaleString(),
    [preferredBenchmark, relativeCpu],
  );

  const rank = useMemo(
    () =>
      getProductPerformanceRank(
        relativeCpu,
        preferredBenchmark,
      )?.toLocaleString(),
    [preferredBenchmark, relativeCpu],
  );

  const href = useMemo(() => getViewCpuPath(relativeCpu), [relativeCpu]);
  const cpuName = useMemo(
    () => formatProductName(relativeCpu, { company: false }),
    [relativeCpu],
  );

  if (rating == null) {
    return <></>;
  }

  return (
    <Tr
      className={classNames(
        baselineCpu.id === relativeCpu.id ? 'font-bold !bg-indigo-100' : '',
      )}
    >
      <Td className="text-center">{rank ?? '--'}</Td>
      <Td className="text-left">
        <a href={href}>{cpuName}</a>
      </Td>
      <Td className="text-right">{rating}</Td>
      <Td className="text-right">{relativePerformancePct}%</Td>
    </Tr>
  );
};
