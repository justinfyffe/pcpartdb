'use client';

import {
  CpuProduct,
  formatProductName,
  getProductValueRank,
  getViewCpuPath,
  productBenchmarkValuePerMsrp,
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

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const viewModel = useViewModel<ViewCpuViewModel>();
  const cpu = viewModel.cpu;
  const relativeValueCpus = viewModel.relativeValueCpus;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th className="text-center">Rank</Th>
          <Th>CPU</Th>
          <Th colSpan={2} className="text-right">
            Performance Per Dollar
          </Th>
        </Tr>
      </THead>
      <TBody>
        {relativeValueCpus.map((relativeCpu) => (
          <ValueTableRow
            key={relativeCpu.id}
            baselineCpu={cpu}
            relativeCpu={relativeCpu}
          />
        ))}
      </TBody>
    </Table>
  );
};

interface ValueTableRowProps {
  baselineCpu: CpuProduct;
  relativeCpu: Partial<CpuProduct>;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineCpu, relativeCpu } = props;

  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);

  const relativeValuePct = useMemo(() => {
    const baseline = productBenchmarkValuePerMsrp(
      baselineCpu,
      preferredBenchmark,
    );
    const relatedValue = productBenchmarkValuePerMsrp(
      relativeCpu,
      preferredBenchmark,
    );

    return Number(
      ((relatedValue / baseline) * 100).toFixed(0),
    ).toLocaleString();
  }, [baselineCpu, preferredBenchmark, relativeCpu]);

  const rating = useMemo(
    () =>
      productBenchmarkValuePerMsrp(
        relativeCpu,
        preferredBenchmark,
      )?.toLocaleString('en-US', { maximumFractionDigits: 2 }),
    [preferredBenchmark, relativeCpu],
  );

  const rank = useMemo(
    () =>
      getProductValueRank(relativeCpu, preferredBenchmark)?.toLocaleString(),
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
      <Td className="text-right">{relativeValuePct}%</Td>
    </Tr>
  );
};
