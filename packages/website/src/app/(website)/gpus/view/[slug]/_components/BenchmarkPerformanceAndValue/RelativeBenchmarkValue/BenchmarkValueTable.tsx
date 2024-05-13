'use client';

import {
  formatProductName,
  getViewGpuPath,
  GpuProduct,
  productBenchmarkValuePerMsrp,
  ProductType,
  ViewGpuViewModel,
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

interface BenchmarkValueTableProps {
  className?: string;
}

export const BenchmarkValueTable: FunctionComponent<
  BenchmarkValueTableProps
> = (props) => {
  const { className } = props;
  const viewModel = useViewModel<ViewGpuViewModel>();
  const gpu = viewModel.gpu;
  const relativeValueGpus = viewModel.relativeDataProducts
    ?.benchmarkPerformancePerDollar as Partial<GpuProduct>[];
  const { loading } = useRelativeDataProducts();

  const hasRelativeValueGpus =
    relativeValueGpus != null && relativeValueGpus.length > 1;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>GPU</Th>
          <Th colSpan={2} className="text-right">
            Performance Per Dollar
          </Th>
        </Tr>
      </THead>
      <TBody>
        {!loading &&
          hasRelativeValueGpus &&
          relativeValueGpus.map((relativeGpu) => (
            <ValueTableRow
              key={relativeGpu.id}
              baselineGpu={gpu}
              relativeGpu={relativeGpu}
            />
          ))}

        {!loading && !hasRelativeValueGpus && (
          <Tr>
            <Td colSpan={4} className="text-center p-8">
              Our database does not have enough data to compare the benchmark
              performance per dollar with other GPUs.
            </Td>
          </Tr>
        )}

        {loading &&
          [...new Array(10)].map((_, i) => (
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

interface ValueTableRowProps {
  baselineGpu: GpuProduct;
  relativeGpu: Partial<GpuProduct>;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineGpu, relativeGpu } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

  const relativeValuePct = useMemo(() => {
    const baseline = productBenchmarkValuePerMsrp(
      baselineGpu,
      preferredBenchmark,
    );
    const relatedValue = productBenchmarkValuePerMsrp(
      relativeGpu,
      preferredBenchmark,
    );

    let pct = Number(
      ((relatedValue / baseline) * 100 - 100).toFixed(0),
    ).toLocaleString();
    if (relatedValue > baseline) {
      pct = `+${pct}`;
    }
    return pct;
  }, [baselineGpu, preferredBenchmark, relativeGpu]);

  const rating = useMemo(
    () =>
      productBenchmarkValuePerMsrp(
        relativeGpu,
        preferredBenchmark,
      )?.toLocaleString('en-US', { maximumFractionDigits: 2 }),
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
      <Td className="text-left">
        <a href={href}>{gpuName}</a>
      </Td>
      <Td className="text-right">{rating}</Td>
      <Td className="text-right">
        {baselineGpu.id === relativeGpu.id ? '' : `${relativeValuePct}%`}
      </Td>
    </Tr>
  );
};
