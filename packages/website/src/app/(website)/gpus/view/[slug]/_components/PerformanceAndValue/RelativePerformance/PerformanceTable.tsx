'use client';

import {
  formatProductName,
  getGpuChipset,
  getProductPerformanceRank,
  getViewGpuPath,
  GpuProduct,
  productBenchmarkValue,
  ProductType,
  ViewGpuViewModel,
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
  const viewModel = useViewModel<ViewGpuViewModel>();
  const gpu = viewModel.gpu;
  const relativePerformanceGpus = viewModel.relativePerformanceGpus;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th className="text-center">Rank</Th>
          <Th>GPU</Th>
          <Th colSpan={2} className="text-right">
            Benchmark Performance
          </Th>
        </Tr>
      </THead>
      <TBody>
        {relativePerformanceGpus.map((relativeGpu) => (
          <PerformanceTableRow
            key={relativeGpu.id}
            baselineGpu={getGpuChipset(gpu)}
            relativeGpu={relativeGpu}
          />
        ))}
      </TBody>
    </Table>
  );
};

interface PerformanceTableRowProps {
  baselineGpu: GpuProduct;
  relativeGpu: Partial<GpuProduct>;
}

const PerformanceTableRow: FunctionComponent<PerformanceTableRowProps> = (
  props,
) => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const { baselineGpu, relativeGpu } = props;

  const relativePerformancePct = useMemo(() => {
    const baseline = productBenchmarkValue(baselineGpu, preferredBenchmark);
    const relatedPerformance = productBenchmarkValue(
      relativeGpu,
      preferredBenchmark,
    );

    return Number(
      ((relatedPerformance / baseline) * 100).toFixed(0),
    ).toLocaleString();
  }, [baselineGpu, preferredBenchmark, relativeGpu]);

  const rating = useMemo(
    () =>
      productBenchmarkValue(relativeGpu, preferredBenchmark)?.toLocaleString(),
    [preferredBenchmark, relativeGpu],
  );

  const rank = useMemo(
    () =>
      getProductPerformanceRank(
        relativeGpu,
        preferredBenchmark,
      )?.toLocaleString(),
    [preferredBenchmark, relativeGpu],
  );

  const href = useMemo(() => getViewGpuPath(relativeGpu), [relativeGpu]);
  const gpuName = useMemo(
    () => formatProductName(relativeGpu, { company: false }),
    [relativeGpu],
  );

  if (rating == null) {
    return <></>;
  }

  return (
    <Tr
      className={classNames(
        baselineGpu.id === relativeGpu.id ? 'font-bold !bg-indigo-100' : '',
      )}
    >
      <Td className="text-center">{rank ?? '--'}</Td>
      <Td className="text-left">
        <a href={href}>{gpuName}</a>
      </Td>
      <Td className="text-right">{rating}</Td>
      <Td className="text-right">{relativePerformancePct}%</Td>
    </Tr>
  );
};
