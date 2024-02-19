import { getProductBenchmarkName, ProductBenchmark } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { Td } from '../../../components/Table/Td';
import { Tr } from '../../../components/Table/Tr';
import { classNames } from '../../../utils/classNames';

interface ProductBenchmarkRowProps {
  benchmarks: ProductBenchmark[];

  indent?: boolean;
  className?: string;
}

export const ProductBenchmarkRow: FunctionComponent<
  ProductBenchmarkRowProps
> = (props) => {
  const { benchmarks, indent, className } = props;
  const [benchmark1, benchmark2] = benchmarks;

  const benchmarkKey = benchmark1?.benchmarkKey || benchmark2?.benchmarkKey;

  const label = getProductBenchmarkName(benchmarkKey);
  const benchmarkValues = benchmarks.map((benchmark) => benchmark?.value);
  const hasValues = benchmarkValues.some((value) => value != null);

  let diffs: string[] = [null, null];
  const score1 = benchmarkValues[0];
  const score2 = benchmarkValues[1];

  if (!score1 || !score2) {
    diffs = [null, null];
  }

  if (score1 > score2) {
    diffs = [
      ((score1 / score2 - 1) * 100).toLocaleString('en-US', {
        maximumFractionDigits: 2,
      }),
      null,
    ];
  } else if (score2 > score1) {
    diffs = [
      null,
      ((score2 / score1 - 1) * 100).toLocaleString('en-US', {
        maximumFractionDigits: 2,
      }),
    ];
  }

  if (!hasValues) {
    return <></>;
  }

  return (
    <Tr className={className}>
      <Td
        className={classNames(
          'text-left',
          benchmarks.length === 1 ? 'w-[50%]' : '',
          benchmarks.length === 2 ? 'w-[33%]' : '',
          indent ? 'pl-6' : '',
        )}
      >
        {label}
      </Td>
      {benchmarkValues.map((value, i) => (
        <Td
          key={i}
          className={classNames(
            'text-left',
            benchmarks.length === 1 ? 'w-[50%]' : '',
            benchmarks.length === 2 ? 'w-[33%]' : '',
          )}
        >
          <div className={classNames('flex gap-2 items-center')}>
            <span>{value?.toLocaleString() ?? '--'}</span>
            <span className="text-xs">{diffs[i] && <>(+{diffs[i]}%)</>}</span>
          </div>
        </Td>
      ))}
    </Tr>
  );
};
