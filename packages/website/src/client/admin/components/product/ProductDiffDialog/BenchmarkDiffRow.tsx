import {
  BenchmarkKey,
  getProductBenchmark,
  getProductBenchmarkName,
  ProductDiff,
} from '@pcpartdb/shared';
import {
  Td,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useMemo } from 'react';

interface BenchmarkDiffRowProps {
  diff: ProductDiff;
  diffBenchmarkKey: BenchmarkKey;
}

export const BenchmarkDiffRow: FunctionComponent<BenchmarkDiffRowProps> = (
  props,
) => {
  const { diffBenchmarkKey, diff } = props;

  const { original, updated } = diff;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const before = getProductBenchmark(original, diffBenchmarkKey);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const after = getProductBenchmark(updated, diffBenchmarkKey);

  const hasChange = useMemo(() => {
    if (before == null || after == null) {
      return before !== after;
    }

    return before.value !== after.value;
  }, [after, before]);

  const label = useMemo(() => {
    return getProductBenchmarkName(diffBenchmarkKey);
  }, [diffBenchmarkKey]);

  const beforeText = useMemo(() => {
    if (before == null) {
      return '--';
    }

    return before?.value?.toLocaleString() ?? '--';
  }, [before]);

  const afterText = useMemo(() => {
    if (after == null) {
      return '--';
    }

    return after?.value?.toLocaleString() ?? '--';
  }, [after]);

  return (
    <Tr>
      <Td
        className={classNames('border-r-px', hasChange ? 'bg-yellow-100' : '')}
      >
        {label}
      </Td>
      <Td
        className={classNames('border-r-px', hasChange ? 'bg-yellow-100' : '')}
        colSpan={2}
      >
        {beforeText}
      </Td>
      <Td className={hasChange ? 'bg-yellow-100' : ''} colSpan={2}>
        {afterText}
      </Td>
    </Tr>
  );
};
