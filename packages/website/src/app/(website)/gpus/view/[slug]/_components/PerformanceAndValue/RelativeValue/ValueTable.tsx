'use client';

import {
  formatProductName,
  getGpuChipset,
  getProductValueRank,
  getViewGpuPath,
  GpuProduct,
  productBenchmarkValuePerMsrp,
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

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const viewModel = useViewModel<ViewGpuViewModel>();
  const gpu = viewModel.gpu;
  const relativeValueGpus = viewModel.relativeValueGpus;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th className="text-center">Rank</Th>
          <Th>GPU</Th>
          <Th colSpan={2} className="text-right">
            Performance Per Dollar
          </Th>
        </Tr>
      </THead>
      <TBody>
        {relativeValueGpus.map((relativeGpu) => (
          <ValueTableRow
            key={relativeGpu.id}
            baselineGpu={getGpuChipset(gpu)}
            relativeGpu={relativeGpu}
          />
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

    return Number(
      ((relatedValue / baseline) * 100).toFixed(0),
    ).toLocaleString();
  }, [baselineGpu, preferredBenchmark, relativeGpu]);

  const rating = useMemo(
    () =>
      productBenchmarkValuePerMsrp(
        relativeGpu,
        preferredBenchmark,
      )?.toLocaleString('en-US', { maximumFractionDigits: 2 }),
    [preferredBenchmark, relativeGpu],
  );

  const rank = useMemo(
    () =>
      getProductValueRank(relativeGpu, preferredBenchmark)?.toLocaleString(),
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
      <Td className="text-right">{relativeValuePct}%</Td>
    </Tr>
  );
};
