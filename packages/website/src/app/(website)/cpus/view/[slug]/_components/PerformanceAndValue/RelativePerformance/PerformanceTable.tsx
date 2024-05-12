'use client';

import {
  CpuProduct,
  formatProductName,
  getViewCpuPath,
  productBenchmarkValue,
  ProductType,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import { Skeleton } from 'packages/website/src/app/_common/components/Skeleton/Skeleton';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Td } from 'packages/website/src/app/_common/components/Table/Td';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { useRelativeDataProducts } from 'packages/website/src/app/_common/product/contexts/RelativeDataProductsProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
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
  const relativePerformanceCpus = viewModel.relativeDataProducts
    ?.benchmarkPerformance as Partial<CpuProduct>[];
  const { loading } = useRelativeDataProducts();

  const hasRelativePerformanceCpus =
    relativePerformanceCpus != null && relativePerformanceCpus.length > 1;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>CPU</Th>
          <Th colSpan={2} className="text-right">
            Benchmark Performance
          </Th>
        </Tr>
      </THead>
      <TBody>
        {!loading &&
          hasRelativePerformanceCpus &&
          relativePerformanceCpus.map((relativeCpu) => (
            <PerformanceTableRow
              key={relativeCpu.id}
              baselineCpu={cpu}
              relativeCpu={relativeCpu}
            />
          ))}

        {!loading && !hasRelativePerformanceCpus && (
          <Tr>
            <Td colSpan={4} className="text-center p-8">
              Our database does not have enough data to compare the benchmark
              performance with other CPUs.
            </Td>
          </Tr>
        )}

        {loading &&
          [...new Array(3)].map((_, i) => (
            <Tr key={i}>
              <Td className="py-4">
                <Skeleton className="w-35 h-3" pulse />
              </Td>
              <Td className="py-4">
                <Skeleton className="w-12 h-3" pulse right />
              </Td>
              <Td className="py-4">
                <Skeleton className="w-12 h-3" pulse right />
              </Td>
            </Tr>
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

    let pct = Number(
      ((relatedPerformance / baseline) * 100 - 100).toFixed(0),
    ).toLocaleString();
    if (relatedPerformance > baseline) {
      pct = `+${pct}`;
    }
    return pct;
  }, [baselineCpu, preferredBenchmark, relativeCpu]);

  const rating = useMemo(
    () =>
      productBenchmarkValue(relativeCpu, preferredBenchmark)?.toLocaleString(),
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
      <Td className="text-left">
        <a href={href}>{cpuName}</a>
      </Td>
      <Td className="text-right">{rating}</Td>
      <Td className="text-right">
        {baselineCpu.id === relativeCpu.id ? '' : `${relativePerformancePct}%`}
      </Td>
    </Tr>
  );
};
