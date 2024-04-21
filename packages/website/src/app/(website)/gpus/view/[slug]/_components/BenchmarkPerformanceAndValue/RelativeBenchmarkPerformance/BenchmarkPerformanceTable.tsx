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
import { Spinner } from 'packages/website/src/app/_common/components/Spinner/Spinner';
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

interface BenchmarkPerformanceTableProps {
  className?: string;
}

export const BenchmarkPerformanceTable: FunctionComponent<
  BenchmarkPerformanceTableProps
> = (props) => {
  const { className } = props;
  const viewModel = useViewModel<ViewGpuViewModel>();
  const gpu = viewModel.gpu;
  const relativePerformanceGpus = viewModel.relativeDataProducts
    ?.benchmarkPerformance as Partial<GpuProduct>[];
  const { loading } = useRelativeDataProducts();

  const hasRelativePerformanceGpus =
    relativePerformanceGpus != null && relativePerformanceGpus.length > 1;

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
        {!loading &&
          hasRelativePerformanceGpus &&
          relativePerformanceGpus.map((relativeGpu) => (
            <PerformanceTableRow
              key={relativeGpu.id}
              baselineGpu={getGpuChipset(gpu)}
              relativeGpu={relativeGpu}
            />
          ))}

        {!loading && !hasRelativePerformanceGpus && (
          <Tr>
            <Td colSpan={4} className="text-center p-8">
              Our database does not have enough data to compare the benchmark
              performance with other GPUs.
            </Td>
          </Tr>
        )}

        {loading &&
          [...new Array(3)].map((_, i) => (
            <Tr key={i} className="animate-pulse">
              <Td className="py-4">
                <div className="bg-loading w-8 h-3 rounded" />
              </Td>
              <Td className="py-4">
                <div className="bg-loading w-35 h-3 rounded" />
              </Td>
              <Td className="py-4">
                <div className="bg-loading w-12 h-3 rounded ml-auto" />
              </Td>
              <Td className="py-4">
                <div className="bg-loading w-12 h-3 rounded ml-auto" />
              </Td>
            </Tr>
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

    let pct = Number(
      ((relatedPerformance / baseline) * 100 - 100).toFixed(0),
    ).toLocaleString();
    if (relatedPerformance > baseline) {
      pct = `+${pct}`;
    }
    return pct;
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
      <Td className="text-right">
        {baselineGpu.id === relativeGpu.id ? '' : `${relativePerformancePct}%`}
      </Td>
    </Tr>
  );
};
